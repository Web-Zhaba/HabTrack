"use client";

import { CircleX, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import AnimatedInput from "../animated-input";

export interface AnimatedTagsProps {
  initialTags?: string[];
  selectedTags?: string[];
  onChange?: (selected: string[]) => void;
  className?: string;
}

export default function AnimatedTags({
  initialTags = ["react", "tailwindcss", "javascript"],
  selectedTags: controlledSelectedTags,
  onChange,
  className = "",
}: AnimatedTagsProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const shouldReduceMotion = useReducedMotion();

  const selectedTag = controlledSelectedTags ?? internalSelected;
  const tags = initialTags.filter((tag) => !selectedTag.includes(tag));

  const handleTagClick = (tag: string) => {
    const newSelected = [...selectedTag, tag];
    if (onChange) {
      onChange(newSelected);
    } else {
      setInternalSelected(newSelected);
    }
  };

  const handleDeleteTag = (tag: string) => {
    const newSelectedTag = selectedTag.filter((selected) => selected !== tag);
    if (onChange) {
      onChange(newSelectedTag);
    } else {
      setInternalSelected(newSelectedTag);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedInput = inputValue.trim();
      if (trimmedInput && !selectedTag.includes(trimmedInput)) {
        const newSelected = [...selectedTag, trimmedInput];
        if (onChange) {
          onChange(newSelected);
        } else {
          setInternalSelected(newSelected);
        }
        setInputValue("");
      }
    }
  };

  return (
    <div className={`flex w-full flex-col gap-4 ${className}`}>
      <div className="flex flex-col items-start justify-center gap-1">
        <AnimatedInput
          label="Добавить тег"
          value={inputValue}
          onChange={setInputValue}
          placeholder="Введите тег и нажмите Enter"
          onKeyDown={handleKeyDown}
          action={
            <button
              type="button"
              onClick={() => {
                const trimmedInput = inputValue.trim();
                if (trimmedInput && !selectedTag.includes(trimmedInput)) {
                  const newSelected = [...selectedTag, trimmedInput];
                  if (onChange) {
                    onChange(newSelected);
                  } else {
                    setInternalSelected(newSelected);
                  }
                  setInputValue("");
                }
              }}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus size={20} />
            </button>
          }
        />
        <AnimatePresence>
          <div className="flex min-h-12 w-full flex-wrap items-center gap-1 rounded-xl border bg-background p-2 mt-2">
            {selectedTag?.length > 0 ? (
              selectedTag.map((tag) => (
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : {
                          y: 0,
                          opacity: 1,
                          filter: "blur(0px)",
                        }
                  }
                  className="group flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md border bg-primary px-2 py-1 text-primary-foreground group-hover:bg-primary/90"
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0, transition: { duration: 0 } }
                      : { y: 20, opacity: 0, filter: "blur(4px)" }
                  }
                  initial={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { y: 20, opacity: 0, filter: "blur(4px)" }
                  }
                  key={tag}
                  layout
                  onClick={() => handleDeleteTag(tag)}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.25, bounce: 0, type: "spring" }
                  }
                >
                  {tag}{" "}
                  <CircleX
                    className="ease flex items-center justify-center rounded-full transition-all duration-200"
                    size={16}
                  />
                </motion.div>
              ))
            ) : (
              <span className="text-muted-foreground text-sm px-2">Нет выбранных тегов</span>
            )}
          </div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        <div className="flex flex-wrap items-center gap-1">
          {tags.map((tag) => (
            <motion.div
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                      y: 0,
                      opacity: 1,
                      filter: "blur(0px)",
                    }
              }
              className="group flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md border bg-background px-2 py-1 text-foreground hover:bg-muted"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { y: -20, opacity: 0, filter: "blur(4px)" }
              }
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { y: -20, opacity: 0, filter: "blur(4px)" }
              }
              key={tag}
              layout
              onClick={() => handleTagClick(tag)}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.25, bounce: 0, type: "spring" }
              }
            >
              {tag}{" "}
              <Plus
                className="ease flex items-center justify-center rounded-full transition-all duration-200"
                size={16}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
