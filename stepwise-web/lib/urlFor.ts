import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "./sanity.client";

const builder = createImageUrlBuilder(sanityClient.config());

export const urlFor = (source: any) => builder.image(source);
