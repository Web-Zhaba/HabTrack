import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, SettingsIcon, UserIcon } from "lucide-react"
import { Link } from "react-router"

export function AvatarDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button intent="plain" size="icon-lg" className="rounded-full">
          <Avatar>
            <AvatarImage src="/avatar-placeholder.svg" alt="icon" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon />
            Профиль
          </DropdownMenuItem>
          <Link to='/settings'>
            <DropdownMenuItem >
              <SettingsIcon />
              Настройки 
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <LogOut />
            Выйти из аккаунта
            </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
