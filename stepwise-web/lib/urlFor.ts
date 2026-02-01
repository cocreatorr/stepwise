// lib/urlFor.ts
import { sanityClient } from "./sanity.client";
import { createImageUrlBuilder } from "@sanity/image-url";

// Create a builder instance using your Sanity client
const builder = createImageUrlBuilder(sanityClient);

// Return the builder so callers can chain methods like .width().url()
export const urlFor = (source: any) => builder.image(source);

// Helper to generate a blur placeholder (tiny image)
export const urlForBlur = (source: any) =>
  builder.image(source).width(20).height(20).blur(50).url();
