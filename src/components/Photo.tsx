import Image from "next/image";
import type { CSSProperties } from "react";

type PhotoProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
};

export const Photo = ({
  src,
  alt,
  width,
  height,
  fill,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  style,
  priority,
}: PhotoProps) => {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        style={style}
        priority={priority}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 1200}
      sizes={sizes}
      className={className}
      style={style}
      priority={priority}
    />
  );
};
