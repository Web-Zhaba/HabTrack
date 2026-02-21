import type { LinkItemType } from "@/components/sheard";
import { UserPlusIcon, BarChart3Icon, Settings, Home, BookCheck } from "lucide-react";

export const productLinks: LinkItemType[] = [
	{
		label: "Домашняя страница",
		href: "/",
		description: "Перейти на главную страницу с основной информацией",
		icon: (
			<Home
			/>
		),
	},
	{
		label: "Привычки",
		href: "/habits",
		description: "Добавить, удалить, отредактировать привычки",
		icon: (
			<BookCheck
			/>
		),
	},
	{
		label: "Друзья",
		href: "#",
		description: "Добавить друга для совместного отслеживания привычек",
		icon: (
			<UserPlusIcon
			/>
		),
	},
	{
		label: "Статистика",
		href: "/stats",
		description: "Отслеживание статистики по привычкам в виде различных графиков",
		icon: (
			<BarChart3Icon
			/>
		),
	},
	{
		label: "Настройки",
		href: "/settings",
		description: "Страница с тонкими настройками дневника привычек",
		icon: (
			<Settings
			/>
		),
	},
];
