"use client";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { buttonVariants } from "@/components/ui/button";
import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Link } from "react-router";

export function Header() {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full border-b border-transparent bg-background/70 backdrop-blur-md supports-backdrop-filter:bg-background/60 transition-colors duration-300",
				scrolled &&
					"border-border bg-background/95 supports-backdrop-filter:bg-background/80"
			)}
		>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 transition-all duration-300">
				<div className="flex items-center gap-5">
					<Link
						className="rounded-lg px-3 py-2.5 hover:bg-muted dark:hover:bg-muted/50"
						to="/"
					>
						<Logo className="h-6" />
					</Link>
					<DesktopNav />
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<Link to="/login" className={buttonVariants()}>
						Войти
					</Link>
				</div>
				<MobileNav />
			</nav>
		</header>
	);
}
