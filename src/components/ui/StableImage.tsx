type Props = {
  src: string;
  alt: string;
  className?: string;
};

export const StableImage = ({ src, alt, className = "" }: Props) => (
  <img
    src={src}
    alt={alt}
    className={className}
    width={600}
    height={600}
    loading="lazy"
    decoding="async"
    style={{ aspectRatio: "1 / 1" }}
  />
);
