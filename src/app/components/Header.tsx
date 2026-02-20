import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { HomeIcon, BookCheckIcon } from "lucide-react"
import { IoStatsChartOutline } from "react-icons/io5";
import { ModeToggle } from "@/components/ui/mode-toggle"
import { AvatarDropdown } from "@/components/ui/AvatarDropdown"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Header() {
  return (
    <header className="bg-background py-2 flex items-center justify-start flex-row">
      <nav>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              size="icon-lg"
              variant="outline"
              className="mr-2 ml-6"
            >
              <Link to='/'>
                <HomeIcon />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Домашняя страница</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              size="icon-lg"
              variant="outline"
              className="mr-2"
            >
              <Link to='/habits'>
                <BookCheckIcon />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Список привычек, их добавление, редактирование и другое</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              size="icon-lg"
              variant="outline"
              className="mr-2"
            >
              <Link to='/stats'>
                <IoStatsChartOutline />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Графики выполнения по привычкам, общая статистика</p>
          </TooltipContent>
        </Tooltip>

      </nav>
      <span className="ml-auto mr-6 flex items-center gap-2">
        <ModeToggle />
        <AvatarDropdown />
      </span>
    </header>
  )
}
