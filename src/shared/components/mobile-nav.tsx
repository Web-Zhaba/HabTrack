import { cn } from "@/lib/utils";
import React from "react";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { Button, buttonVariants } from "@/components/ui/button";
import { productLinks } from "@/components/nav-links";
import { LinkItem } from "@/components/sheard";
import { XIcon, MenuIcon } from "lucide-react";
import { Link } from "react-router";

export function MobileNav() {
	const [open, setOpen] = React.useState(false);

	return (
		<div className="md:hidden">
			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				className="md:hidden"
				onClick={() => setOpen(!open)}
				size="icon"
				intent="outline"
			>
				<div
					className={cn(
						"transition-all",
						open ? "scale-100 opacity-100" : "scale-0 opacity-0"
					)}
				>
					<XIcon
					/>
				</div>
				<div
					className={cn(
						"absolute transition-all",
						open ? "scale-0 opacity-0" : "scale-100 opacity-100"
					)}
				>
					<MenuIcon
					/>
				</div>
			</Button>
			{open && (
				<Portal className="top-14">
					<PortalBackdrop />
					<div
						className={cn(
							"size-full overflow-y-auto p-4",
							"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in"
						)}
						data-slot={open ? "open" : "closed"}
					>
						<div className="flex w-full flex-col gap-y-2">
							<span className="text-sm text-muted-foreground">Навигация</span>
							{productLinks.map((link) => (
								<LinkItem
									className="rounded-lg p-2 active:bg-muted dark:active:bg-muted/50"
									key={`product-${link.label}`}
									{...link}
								/>
							))}
						</div>
						<div className="mt-5 flex flex-col gap-2">
							<Link to="/login" className={buttonVariants({ className: "w-full" })}>
								Войти
							</Link>
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
}
