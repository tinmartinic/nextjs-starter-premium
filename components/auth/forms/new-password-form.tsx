'use client';

import { useSearchParams } from 'next/navigation';
import * as z from 'zod';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { ScaleLoader } from 'react-spinners';

import { zodResolver } from '@hookform/resolvers/zod';

import { newPassword } from '@/actions/auth/password-reset';
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
import { NewPasswordFormSchema } from '@/lib/validations/auth-schema';
import { loginRoute } from '@/routes';

import AuthCard from '../ui/auth-card';
import { FormError } from '../ui/form-error';
import { FormSuccess } from '../ui/form-success';

const NewPasswordForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const form = useForm<z.infer<typeof NewPasswordFormSchema>>({
    resolver: zodResolver(NewPasswordFormSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordFormSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
    console.log(values);
  };

  return (
    <AuthCard
      headerLabel="Forgot your password?"
      buttonLabel="Back to login"
      buttonHref={loginRoute}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? <ScaleLoader height={5} color="white" /> : 'Change Password'}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default NewPasswordForm;
