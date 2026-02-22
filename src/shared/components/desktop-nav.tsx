import { productLinks } from "@/components/nav-links";
import { buttonVariants } from "@/components/ui/button";
import { useLocation, Link } from "react-router";
import { cn } from "@/lib/utils";

function normalizePath(path: string) {
	if (!path) return "/";
	if (path === "/") return "/";
	return path.replace(/\/+$/, "");
}

export function DesktopNav() {
	const location = useLocation();

	return (
		<div className="hidden items-center gap-1 md:flex">
			{productLinks.map((link, index) => {
				const href = link.href;
				const isLink = href !== "#";
				const current = normalizePath(location.pathname);
				const target = normalizePath(href);

				const isActive =
					isLink &&
					(target === "/"
						? current === "/"
						: current === target || current.startsWith(`${target}/`));

				return (
					<Link
						to={link.href}
						key={link.label}
						className={cn(
							buttonVariants({
								intent: isActive ? "primary" : "plain",
								size: "sm",
							}),
							"group relative overflow-hidden rounded-full px-3 py-1.5 text-xs sm:text-sm transition-all duration-300 border-b-2 border-transparent",
							!isActive && "hover:-translate-y-0.5 hover:bg-primary/10 hover:border-primary/60",
							"animate-in slide-in-from-top-1 fade-in-0",
							isActive && "border-primary shadow-sm hover:-translate-y-0.5 hover:border-primary/10"
						)}
						style={{
							animationDelay: `${index * 60}ms`,
						}}
					>
						<span className="flex items-center justify-center mr-1.5">
							{link.icon}
						</span>
						<span>{link.label}</span>
					</Link>
				);
			})}
		</div>
	);
}
