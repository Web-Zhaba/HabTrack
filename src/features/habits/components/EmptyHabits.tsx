import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Link } from "react-router";
import { PiMaskSad } from "react-icons/pi";
import { ArrowUpRightIcon } from "lucide-react"

export function EmptyHabits() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PiMaskSad />
        </EmptyMedia>
        <EmptyTitle>Ещё нет привычек</EmptyTitle>
        <EmptyDescription>
          Вы еще не завели ни одной привычки, давайте сделаем это! 
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button>Добавить привычку</Button>
        <Button variant="outline">Импортировать данные</Button>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <Link to='/login'>
          Войти в аккаунт <ArrowUpRightIcon />
        </Link>
      </Button>
    </Empty>
  )
}
