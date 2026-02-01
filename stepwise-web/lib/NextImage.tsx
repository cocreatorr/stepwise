import Image, { ImageProps } from "next/image";
import { urlFor, urlForBlur } from "./urlFor";

interface NextImageProps extends Omit<ImageProps, "src"> {
  source: any; // Sanity image source
  width?: number;
  height?: number;
}

export default function NextImage({
  source,
  width = 800,
  height = 450,
  alt = "",
  ...rest
}: NextImageProps) {
  return (
    <Image
      src={urlFor(source).width(width).url()}
      alt={alt}
      width={width}
      height={height}
      placeholder="blur"
      blurDataURL={urlForBlur(source)}
      {...rest} // safe: no duplicate alt
    />
  );
}
