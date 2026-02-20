import { useParams } from "react-router"

export default function HabitDetailPage() {
  const { id } = useParams();
  return (
    <p>Страница деталей привычки с ID: {id}</p>
  )
}
