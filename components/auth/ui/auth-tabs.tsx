'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { LoginForm } from '../forms/login-form';
import { RegisterForm } from '../forms/register-form';

export function AuthTabs() {
  return (
    <Tabs defaultValue="login" className="w-[500px] mx-auto rounded-lg p-2">
      {' '}
      <TabsList className="grid w-full grid-cols-2 ">
        {' '}
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        {' '}
        <Card>
          {' '}
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Log in to your account.</CardDescription>{' '}
          </CardHeader>
          <CardContent className="space-y-2">
            {' '}
            <LoginForm />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="register">
        {' '}
        <Card>
          {' '}
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create a new account.</CardDescription>{' '}
          </CardHeader>
          <CardContent className="space-y-2">
            {' '}
            <RegisterForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
