import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Link } from "react-router"

interface IForm {
  'email': string
  'password': string
}

export default function LogInPage() {

  const {register, handleSubmit, formState } = useForm<IForm>({
    mode: 'onChange',
    defaultValues: {
      'email': 'test@test.com',
      'password': 'pass'
    },
  })

  const emailError = formState.errors['email']?.message

  const onSubmit:SubmitHandler<IForm> = (data: any) => {
    console.log(data['email'], data['password'])
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Войдите в ваш аккаунт</CardTitle>
        <CardDescription>
          Введите вашу почту ниже, чтобы войти
        </CardDescription>
        <CardAction>
          <Link to='/register'>
            <Button variant="link">Регистрация</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                {...register (
                  'email', {
                    required: 'Это поле обязательно',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
                      message: 'Некорректный email адрес'
                    }
                  }
                )}
              />
              {emailError && <p className="text-red-400">{emailError}</p>}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Пароль</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Забыли пароль?
                </a>
              </div>
              <Input
              id="password" 
              type="password" 
              {...register (
                  'password', {
                    required: 'Это поле обязательно',
                  }
                )}
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-6">
            Войти!
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="outline" className="w-full">
          Войти с помощью Google
        </Button>
      </CardFooter>
    </Card>
  )
}
