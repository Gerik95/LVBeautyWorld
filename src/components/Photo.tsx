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
  /** Detail page: the photo stays in color. The visitor already opened this work. */
  stayColor?: boolean;
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
  stayColor = false,
}: PhotoProps) => {
  const imageClass = ["photo-treat-img", className].filter(Boolean).join(" ");
  const frameClass = stayColor ? "photo-hit photo-stay absolute inset-0 block" : "photo-hit absolute inset-0 block";
  if (fill) {
    return (
      <span className={frameClass}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={imageClass}
          style={style}
          priority={priority}
        />
      </span>
    );
  }
  return (
    <span className={stayColor ? "photo-hit photo-stay block" : "photo-hit block"}>
      <Image
        src={src}
        alt={alt}
        width={width ?? 1200}
        height={height ?? 1200}
        sizes={sizes}
        className={imageClass}
        style={style}
        priority={priority}
      />
    </span>
  );
};
