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
import { Mail } from 'lucide-react';
import { Link } from 'react-router';
import AnimatedInput from '@/components/ui/smoothui/animated-input';

interface ResetForm {
  email: string;
}

export default function ResetPasswordPage() {
  const { control, handleSubmit, formState } = useForm<ResetForm>({
    mode: 'onChange',
  });

  const emailError = formState.errors.email?.message;

  const onSubmit: SubmitHandler<ResetForm> = (data) => {
    console.log(data);
  };

  return (
    <Card className="w-full max-w-sm border border-border/70 bg-background/80 backdrop-blur-sm shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-300">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Восстановление пароля
        </CardTitle>
        <CardDescription>
          Укажите email, на который вы регистрировали аккаунт. Мы отправим вам письмо с инструкцией
          по восстановлению.
        </CardDescription>
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
          </div>
          <Button
            type="submit"
            className="w-full hover:bg-accent hover:scale-110 transition-all duration-300"
          >
            Отправить ссылку для сброса
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-2">
        <CardAction className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Вспомнили пароль?</span>
          <Link to="/login">
            <Button intent="plain" size="sm">
              Войти
            </Button>
          </Link>
        </CardAction>
        <CardAction className="flex items-center justify-between">
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
