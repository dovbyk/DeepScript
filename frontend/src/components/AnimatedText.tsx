
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  el?: keyof JSX.IntrinsicElements;
  animation?: 'slide-up' | 'slide-down' | 'fade-in' | 'rotate-in' | 'blur-in';
  delay?: number;
  once?: boolean;
  threshold?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  el = 'h1',
  animation = 'fade-in',
  delay = 0,
  once = true,
  threshold = 0.1,
}) => {
  const textRef = useRef<HTMLElement | null>(null);
  const Component = el as any;

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              element.classList.add(`animate-${animation}`);
              element.style.opacity = '1';
            }, delay);

            if (once) observer.unobserve(element);
          } else if (!once) {
            element.classList.remove(`animate-${animation}`);
            element.style.opacity = '0';
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [animation, delay, once, threshold]);

  return (
    <Component
      ref={textRef}
      className={cn(className)}
      style={{ opacity: 0, animationDuration: '0.8s', animationFillMode: 'forwards' }}
    >
      {text}
    </Component>
  );
};

export default AnimatedText;
