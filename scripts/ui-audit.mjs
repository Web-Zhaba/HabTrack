import fs from "node:fs/promises"
import path from "node:path"
import puppeteer from "puppeteer"

const BASE_URL = process.env.UI_AUDIT_URL ?? "http://localhost:5174/"

const VIEWPORTS = [
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
]

const CRITICAL_SELECTORS = {
  header: "header",
  calendar: "[data-slot='calendar']",
  accordion: "[data-slot='accordion']",
}

function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-")
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function injectPerformanceObservers(page) {
  await page.evaluateOnNewDocument(() => {
    if (window.__habtrackMetrics) return

    window.__habtrackMetrics = {
      lcp: null,
      cls: 0,
      fid: null,
      tbt: 0,
    }

    const poLcp = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__habtrackMetrics.lcp = entry.startTime
      }
    })
    poLcp.observe({ type: "largest-contentful-paint", buffered: true })

    const poCls = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__habtrackMetrics.cls += entry.value
        }
      }
    })
    poCls.observe({ type: "layout-shift", buffered: true })

    const poLongTasks =
      "PerformanceObserver" in window
        ? new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const blockingTime = entry.duration - 50
              if (blockingTime > 0) {
                window.__habtrackMetrics.tbt += blockingTime
              }
            }
          })
        : null
    poLongTasks?.observe({ type: "longtask", buffered: true })

    const poFirstInput = new PerformanceObserver((list) => {
      const first = list.getEntries()[0]
      if (first && window.__habtrackMetrics.fid == null) {
        window.__habtrackMetrics.fid = first.processingStart - first.startTime
      }
    })
    try {
      poFirstInput.observe({ type: "first-input", buffered: true })
    } catch {
      // older browsers may not support this entry type
    }
  })
}

async function collectAccessibilityReport(page) {
  return page.evaluate(() => {
    function getAccessibleName(el) {
      const ariaLabel = el.getAttribute("aria-label")
      if (ariaLabel) return ariaLabel
      const labelledBy = el.getAttribute("aria-labelledby")
      if (labelledBy) {
        const labelled = document.getElementById(labelledBy)
        if (labelled) return labelled.textContent ?? ""
      }
      const text = el.textContent ?? ""
      return text
    }

    const buttonIssues = []
    const buttons = Array.from(document.querySelectorAll("button,[role='button']"))
    for (const el of buttons) {
      const name = getAccessibleName(el).trim()
      if (!name) {
        buttonIssues.push({
          role: el.getAttribute("role") ?? "button",
          snippet: el.outerHTML.slice(0, 200),
        })
      }
    }

    const validAria = new Set([
      "aria-label",
      "aria-labelledby",
      "aria-hidden",
      "aria-expanded",
      "aria-pressed",
      "aria-describedby",
      "aria-controls",
      "aria-current",
      "aria-selected",
      "aria-disabled",
      "aria-invalid",
    ])

    const ariaIssues = []
    const withAria = Array.from(document.querySelectorAll("[aria-*]"))
    for (const el of withAria) {
      for (const attr of Array.from(el.attributes)) {
        if (attr.name.startsWith("aria-") && !validAria.has(attr.name)) {
          ariaIssues.push({
            attribute: attr.name,
            value: attr.value,
            snippet: el.outerHTML.slice(0, 200),
          })
        }
      }
    }

    function parseColor(input) {
      if (!input) return null
      const ctx = document.createElement("canvas").getContext("2d")
      if (!ctx) return null
      ctx.fillStyle = input
      const computed = ctx.fillStyle
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(computed)
      if (!m) return null
      return {
        r: parseInt(m[1], 16),
        g: parseInt(m[2], 16),
        b: parseInt(m[3], 16),
      }
    }

    function luminance({ r, g, b }) {
      const a = [r, g, b].map((v) => {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
    }

    function contrastRatio(c1, c2) {
      const l1 = luminance(c1)
      const l2 = luminance(c2)
      const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1]
      return (light + 0.05) / (dark + 0.05)
    }

    const contrastIssues = []
    const percentNodes = Array.from(
      document.querySelectorAll("[data-slot='calendar'] span"),
    ).filter((el) => (el.textContent ?? "").trim().endsWith("%"))

    for (const el of percentNodes) {
      const style = getComputedStyle(el)
      const parentStyle = el.parentElement ? getComputedStyle(el.parentElement) : style
      const fg = parseColor(style.color)
      const bg = parseColor(style.backgroundColor || parentStyle.backgroundColor)
      if (!fg || !bg) continue
      const ratio = contrastRatio(fg, bg)
      if (ratio < 4.5) {
        contrastIssues.push({
          text: (el.textContent ?? "").trim(),
          ratio,
          snippet: el.outerHTML.slice(0, 200),
        })
      }
    }

    const calendarLayout = (() => {
      const calendar = document.querySelector("[data-slot='calendar']")
      if (!calendar) return null
      const headerRow = calendar.querySelector("thead tr") ?? calendar.querySelector("tr")
      const firstDayCell = calendar.querySelector("tbody tr td, [role='gridcell']")
      if (!headerRow || !firstDayCell) return null

      const headerRect = headerRow.getBoundingClientRect()
      const cellRect = firstDayCell.getBoundingClientRect()

      const deltaX = Math.abs(headerRect.left - cellRect.left)
      const deltaY = Math.abs(headerRect.bottom - cellRect.top)

      const container = calendar.parentElement
      if (!container) {
        return {
          headerToCellDeltaX: deltaX,
          headerToCellDeltaY: deltaY,
        }
      }

      const containerRect = container.getBoundingClientRect()
      const gap = containerRect.bottom - cellRect.bottom

      return {
        headerToCellDeltaX: deltaX,
        headerToCellDeltaY: deltaY,
        containerClientHeight: container.clientHeight,
        containerScrollHeight: container.scrollHeight,
        parentClientHeight: containerRect.height,
        bottomGapPx: gap,
      }
    })()

    return {
      summary: {
        buttonNameIssues: buttonIssues.length,
        ariaIssues: ariaIssues.length,
        contrastIssues: contrastIssues.length,
      },
      buttonNameIssues: buttonIssues,
      ariaIssues,
      contrastIssues,
      calendarLayout,
    }
  })
}

async function runMultiDateScrollTest(page) {
  const result = {
    attemptedClicks: 0,
    accordion: null,
  }

  const cells = await page.$$("[data-slot='calendar'] [role='gridcell']")
  const count = Math.min(30, cells.length)
  for (let i = 0; i < count; i += 1) {
    await cells[i].click()
    result.attemptedClicks += 1
    await page.waitForTimeout(40)
  }

  result.accordion = await page.evaluate(() => {
    const scrollArea =
      document.querySelector("[data-slot='scroll-area-viewport']") ??
      document.querySelector("[data-slot='scroll-area']")
    if (!scrollArea) return null
    const style = getComputedStyle(scrollArea)
    const scrollbarWidth = scrollArea.offsetWidth - scrollArea.clientWidth
    return {
      clientHeight: scrollArea.clientHeight,
      scrollHeight: scrollArea.scrollHeight,
      overflowY: style.overflowY,
      scrollbarWidth,
    }
  })

  return result
}

async function run() {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: null,
  })

  const page = await browser.newPage()
  await injectPerformanceObservers(page)

  for (const viewport of VIEWPORTS) {
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
    })

    await page.goto(BASE_URL, { waitUntil: "networkidle0" })

    const timestamp = getTimestamp()
    const viewportDir = path.join("screenshots", `${viewport.width}x${viewport.height}`)
    await ensureDir(viewportDir)

    const userAgent = await page.evaluate(() => navigator.userAgent)

    await page.screenshot({
      path: path.join(viewportDir, `home-full_${timestamp}.png`),
      fullPage: true,
      type: "png",
    })

    await page.screenshot({
      path: path.join(viewportDir, `home-viewport_${timestamp}.png`),
      fullPage: false,
      type: "png",
    })

    for (const [name, selector] of Object.entries(CRITICAL_SELECTORS)) {
      const el = await page.$(selector)
      if (!el) continue
      await el.screenshot({
        path: path.join(viewportDir, `${name}_${timestamp}.png`),
        type: "png",
      })
    }

    await page.waitForTimeout(2000)

    const perfMetrics = await page.evaluate(() => {
      return window.__habtrackMetrics ?? null
    })

    const accessibility = await collectAccessibilityReport(page)
    const multiDateScroll = await runMultiDateScrollTest(page)

    const auditsDir = "audits"
    await ensureDir(auditsDir)

    const baseMeta = {
      viewport,
      deviceScaleFactor: 1,
      userAgent,
      timestamp,
      url: BASE_URL,
    }

    await fs.writeFile(
      path.join(auditsDir, `${viewport.width}x${viewport.height}_performance.json`),
      JSON.stringify(
        {
          ...baseMeta,
          metrics: perfMetrics,
        },
        null,
        2,
      ),
      "utf8",
    )

    await fs.writeFile(
      path.join(auditsDir, `${viewport.width}x${viewport.height}_accessibility.json`),
      JSON.stringify(
        {
          ...baseMeta,
          accessibility,
          multiDateScroll,
        },
        null,
        2,
      ),
      "utf8",
    )
  }

  await browser.close()
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
