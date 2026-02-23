/* eslint-disable react-hooks/incompatible-library */
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
import { KeyRound, Mail, PencilLine } from 'lucide-react';
import { Link } from 'react-router';
import AnimatedInput from '@/components/ui/smoothui/animated-input';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const { control, handleSubmit, watch, formState } = useForm<RegisterForm>({
    mode: 'onChange',
  });

  const emailError = formState.errors.email?.message;
  const passwordError = formState.errors.password?.message;
  const confirmError = formState.errors.confirmPassword?.message;

  const passwordValue = watch('password');

  const onSubmit: SubmitHandler<RegisterForm> = (data) => {
    console.log(data);
  };

  return (
    <Card className="w-full max-w-sm border border-border/70 bg-background/80 backdrop-blur-sm shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-300">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">Создайте аккаунт</CardTitle>
        <CardDescription>Заполните поля ниже, чтобы начать пользоваться HabTrack</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Это поле обязательно',
                minLength: {
                  value: 2,
                  message: 'Минимум 2 символа',
                },
              }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <AnimatedInput
                    label="Имя"
                    placeholder="Как к вам обращаться"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={field.disabled}
                    icon={<PencilLine />}
                    autoComplete="name"
                  />
                  {fieldState.error && (
                    <p className="text-xs text-destructive">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
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
                minLength: {
                  value: 6,
                  message: 'Минимум 6 символов',
                },
              }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <AnimatedInput
                    label="Пароль"
                    placeholder="Придумайте пароль"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={field.disabled}
                    icon={<KeyRound />}
                    type="password"
                    autoComplete="new-password"
                  />
                  {(fieldState.error || passwordError) && (
                    <p className="text-xs text-destructive">
                      {fieldState.error?.message || passwordError}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: 'Это поле обязательно',
                validate: (value) => value === passwordValue || 'Пароли не совпадают',
              }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <AnimatedInput
                    label="Повторите пароль"
                    placeholder="Повторите пароль"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={field.disabled}
                    icon={<KeyRound />}
                    type="password"
                    autoComplete="new-password"
                  />
                  {(fieldState.error || confirmError) && (
                    <p className="text-xs text-destructive">
                      {fieldState.error?.message || confirmError}
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
            Зарегистрироваться
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-2">
        <Button intent="outline" className="w-full hover:scale-110 transition-all duration-300">
          Продолжить с Google
        </Button>
        <CardAction className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">Уже есть аккаунт?</span>
          <Link to="/login">
            <Button intent="plain" size="sm">
              Войти
            </Button>
          </Link>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
