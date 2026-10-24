'use client';

import * as z from 'zod';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { ScaleLoader } from 'react-spinners';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';

import { login } from '@/actions/auth/login';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginFormSchema } from '@/lib/validations/auth-schema';
import { resetPasswordRoute } from '@/routes';

import { FormError } from '../ui/form-error';
import { FormSuccess } from '../ui/form-success';
import { SocialLogin } from '../ui/social-login';

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof LoginFormSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      login(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <Form {...form}>
      {' '}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
        <>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="john.doe@example.com"
                    type="email"
                    {...field}
                    className="border border-gray-900"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="********"
                    type="password"
                    {...field}
                    className="border border-gray-900"
                  />
                </FormControl>
                <FormMessage />
                <Link href={resetPasswordRoute}>
                  <Button variant="link" size="sm" className="px-0 font-normal">
                    Forgot password?
                  </Button>
                </Link>
              </FormItem>
            )}
          />
        </>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? <ScaleLoader height={5} color="white" /> : 'Login'}{' '}
        </Button>
      </form>
      <SocialLogin />
    </Form>
  );
};
