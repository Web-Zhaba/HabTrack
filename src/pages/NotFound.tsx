import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { TbFileSad } from "react-icons/tb";

export default function NotFoundPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-15">
          <TbFileSad />
        </EmptyMedia>
        <EmptyTitle className="text-3xl">404</EmptyTitle>
        <EmptyDescription>
          Вы попали куда-то не туда, вернитесь на одну из страниц с помощью кнопок в навигационном меню.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
      </EmptyContent>
    </Empty>
  )
}
