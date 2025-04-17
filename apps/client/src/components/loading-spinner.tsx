import React from 'react';
import { ScaleLoader } from 'react-spinners';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  loading?: boolean;
  children?: React.ReactNode;
  overlay?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = 'md',
  text,
  loading = true,
  children,
  overlay = true,
}) => {
  const { theme } = useTheme();
  
  // 根据主题设置颜色
  const color = 'var(--primary)';
  
  // 根据size设置大小
  const sizeMap = {
    sm: 8,
    md: 12,
    lg: 15
  };

  const spinnerSize = sizeMap[size];
  
  // 如果有children，创建一个相对定位的容器
  if (children) {
    return (
      <div className="relative">
        {children}
        {loading && overlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center">
              <ScaleLoader
                color={color}
                width={Math.ceil(spinnerSize / 3)}
                height={Math.ceil(spinnerSize * 1.5 )}
                margin={4}
              />
              {text && (
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 独立使用时的渲染
  if (!loading) return null;
  
  return (
    <div className={cn(
      'flex items-center justify-center',
      className
    )}>
      <div className="text-center">
        <ScaleLoader
          color={color}
          width={Math.ceil(spinnerSize / 3)}
          height={Math.ceil(spinnerSize * 1.5 )}
          margin={4}
        />
        {text && (
          <p className="mt-2 text-sm text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  );
};