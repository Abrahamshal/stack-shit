import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  aspectRatio?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  srcSet?: string;
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  aspectRatio,
  priority = false,
  onLoad,
  onError,
  className,
  sizes,
  srcSet,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const shouldLoad = priority || isInView;
  const imageSrc = hasError ? fallbackSrc : src;

  return (
    <div 
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      <img
        ref={imgRef}
        src={shouldLoad ? imageSrc : undefined}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        sizes={sizes}
        srcSet={srcSet}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        {...props}
      />
    </div>
  );
}

// Picture component for art-directed responsive images
interface PictureSource {
  srcSet: string;
  media?: string;
  type?: string;
}

interface OptimizedPictureProps extends Omit<OptimizedImageProps, 'srcSet'> {
  sources?: PictureSource[];
}

export function OptimizedPicture({
  sources = [],
  src,
  alt,
  ...props
}: OptimizedPictureProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <picture className="relative block">
      {sources.map((source, index) => (
        <source
          key={index}
          srcSet={source.srcSet}
          media={source.media}
          type={source.type}
        />
      ))}
      <OptimizedImage
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        {...props}
      />
    </picture>
  );
}

// Background image component with lazy loading
interface BackgroundImageProps {
  src: string;
  fallbackSrc?: string;
  className?: string;
  children?: React.ReactNode;
  priority?: boolean;
}

export function BackgroundImage({
  src,
  fallbackSrc = '/placeholder.svg',
  className,
  children,
  priority = false
}: BackgroundImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = src;
    
    img.onload = () => setIsLoaded(true);
    img.onerror = () => {
      setHasError(true);
      setIsLoaded(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, isInView]);

  const backgroundImage = hasError ? fallbackSrc : src;
  const shouldShowBackground = isLoaded && isInView;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-cover bg-center bg-no-repeat transition-opacity duration-700',
        className
      )}
      style={{
        backgroundImage: shouldShowBackground ? `url(${backgroundImage})` : undefined,
        opacity: shouldShowBackground ? 1 : 0
      }}
    >
      {children}
    </div>
  );
}