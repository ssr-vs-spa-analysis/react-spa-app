type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
};

export const StableImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = ""
}: Props) => (
  <img
    src={src}
    alt={alt}
    className={className}
    width={width}
    height={height}
    loading={priority ? "eager" : "lazy"}
    fetchPriority={priority ? "high" : "auto"}
    decoding="async"
  />
);
