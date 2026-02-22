import { cn } from "@/lib/utils";
import type React from "react";
import { Link } from "react-router";

export type LinkItemType = {
	label: string;
	href: string;
	icon: React.ReactNode;
	description?: string;
};

type LinkItemProps = Omit<React.ComponentProps<typeof Link>, "to"> & LinkItemType;

export function LinkItem({
	label,
	description,
	icon,
	className,
	href,
	...props
}: LinkItemProps) {
	return (
		<Link
			className={cn("flex items-center gap-x-2", className)}
			to={href}
			{...props}
		>
			<div
				className={cn(
					"flex aspect-square size-12 items-center justify-center rounded-md border bg-card text-sm shadow-sm",
					"[&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='size-'])]:text-foreground"
				)}
			>
				{icon}
			</div>
			<div className="flex flex-col items-start justify-center">
				<span className="font-medium">{label}</span>
				<span className="line-clamp-2 text-muted-foreground text-xs">
					{description}
				</span>
			</div>
		</Link>
	);
}
