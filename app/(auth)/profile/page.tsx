import Image from 'next/image';

import NotLoggedIn from '@/components/auth/ui/not-logged-in';
import ContentWrapper from '@/components/global/content-width-wrapper';
import MaxWidthWrapper from '@/components/global/max-width-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { avatar } from '@/public/image';

export default async function ProfilePage() {
  const sessionUser = await currentUser();
  const user = sessionUser ? await getUserById(sessionUser.id as string) : undefined;

  return (
    <MaxWidthWrapper>
      <div className="container mx-auto min-h-[calc(100vh-30rem)] md:my-32 my-12">
        <ContentWrapper className="px-4">
          <div className="mx-4 md:mx-auto max-w-3xl">
            {user && sessionUser ? (
              <Card className="shadow-xl">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-6 items-center">
                    <Image
                      src={user.image || avatar}
                      alt={user.name || 'User Avatar'}
                      height={124}
                      width={124}
                      priority={true}
                      className="rounded-full border-4 border-primary/50 bg-primary p-4"
                    />
                  </div>

                  <CardTitle className="text-3xl font-bold text-secondary">
                    {user.name || 'User Name Not Available'}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4 overflow-hidden rounded-lg  p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="text-muted-foreground">Email</div>
                      <div className="text-primary">{user.email || 'Email Not Available'}</div>

                      <div className="text-muted-foreground">Full Name</div>
                      <div className="text-primary">
                        {user.name && user.lastName
                          ? `${user.name} ${user.lastName}`
                          : 'Full Name Not Available'}
                      </div>

                      <div className="text-muted-foreground">Member Since</div>
                      <div className="text-primary">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : 'Date Not Available'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <NotLoggedIn />
            )}
          </div>
        </ContentWrapper>
      </div>
    </MaxWidthWrapper>
  );
}
