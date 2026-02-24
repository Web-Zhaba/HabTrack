import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { Mail, KeyRound } from 'lucide-react';
import { Link } from 'react-router';
import AnimatedInput from '@/components/ui/smoothui/animated-input';

interface IForm {
  email: string;
  password: string;
}

export default function LogInPage() {
  const { control, handleSubmit, formState } = useForm<IForm>({
    mode: 'onChange',
    defaultValues: {
      email: 'test@test.com',
      password: 'pass',
    },
  });

  const emailError = formState.errors.email?.message;
  const passwordError = formState.errors.password?.message;

  const onSubmit: SubmitHandler<IForm> = () => {
    // TODO: подключить авторизацию
  };

  return (
    <Card className="w-full max-w-sm border border-border/70 bg-background/80 backdrop-blur-sm shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-300">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">Добро пожаловать</CardTitle>
        <CardDescription>Введите ваши данные, чтобы войти в HabTrack</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Это поле обязательно',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
                  message: 'Некорректный email адрес',
                },
              }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <AnimatedInput
                    label="Email"
                    placeholder="email@example.com"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={field.disabled}
                    icon={<Mail />}
                    type="email"
                    autoComplete="email"
                  />
                  {(fieldState.error || emailError) && (
                    <p className="text-xs text-destructive">
                      {fieldState.error?.message || emailError}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Это поле обязательно',
              }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Link
                      to="/reset-password"
                      className="ml-auto inline-flex items-center text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Забыли пароль?
                    </Link>
                  </div>
                  <AnimatedInput
                    label="Пароль"
                    placeholder="Введите пароль"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={field.disabled}
                    icon={<KeyRound />}
                    type="password"
                    autoComplete="current-password"
                  />
                  {(fieldState.error || passwordError) && (
                    <p className="text-xs text-destructive">
                      {fieldState.error?.message || passwordError}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full hover:bg-accent hover:scale-110 transition-all duration-300"
          >
            Войти
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-2">
        <Button intent="outline" className="w-full hover:scale-110 transition-all duration-300">
          Войти с помощью Google
        </Button>
        <CardAction className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">Нет аккаунта?</span>
          <Link to="/register">
            <Button intent="plain" size="sm">
              Регистрация
            </Button>
          </Link>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
