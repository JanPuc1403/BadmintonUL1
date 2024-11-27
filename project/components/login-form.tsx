'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserColorsChart } from '@/components/user-colors-chart';
import { users } from '@/lib/users';
import { useToast } from '@/hooks/use-toast';
import Cookies from 'js-cookie';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.username === username.toUpperCase() && u.password === password
    );

    if (user) {
      Cookies.set('user', JSON.stringify(user), { expires: 30 }); // Extended to 30 days
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/dashboard');
    } else {
      toast({
        title: 'Error',
        description: 'Invalid username or password',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Presence Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="space-y-4">
          <Separator />
          <div className="text-sm text-center text-muted-foreground">
            Team Members
          </div>
          <UserColorsChart />
        </div>
      </CardContent>
    </Card>
  );
}