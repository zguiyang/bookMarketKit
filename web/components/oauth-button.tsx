'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { LuLogIn, LuLoader } from 'react-icons/lu';
import { client } from '@/lib/auth/client';

type OAuthButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  provider: 'github' | 'google';
  callbackURL?: string;
};

const ProviderIcon = ({ provider }: { provider: string }) => {
  switch (provider) {
    case 'github':
      return <FaGithub className="size-6" />;
    case 'google':
      return <FcGoogle className={'size-6'} />;
    default:
      return <LuLogIn className="size-6" />;
  }
};

const getProviderName = (provider: string) => {
  return provider.charAt(0).toUpperCase() + provider.slice(1);
};

export function OAuthButton({ provider, children, className = '', ...props }: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await client.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/bookmarks`,
      });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className={`relative flex items-center justify-center gap-2 h-10 px-4 py-2 transition-all border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900 ${className}`}
      onClick={handleSignIn}
      disabled={isLoading}
      {...props}
    >
      <span className="flex items-center justify-center">
        <ProviderIcon provider={provider} />
      </span>

      <span className="flex-grow text-center">{children || `Continue with ${getProviderName(provider)}`}</span>

      {isLoading ? <LuLoader className="size-6 animate-spin" /> : <span className="size-5" />}
    </Button>
  );
}
