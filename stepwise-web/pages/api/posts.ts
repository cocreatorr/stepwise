import type { NextApiRequest, NextApiResponse } from "next";
import { sanityServerClient } from "../../lib/sanity.server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Query for posts
    const postsQuery = `*[_type == "post"]{
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      "author": author->{ name, slug },
      categories[]->{ title, slug }
    } | order(publishedAt desc)`;

    // Query for site settings (tags for navigation)
    const settingsQuery = `*[_type == "settings"][0]{
      siteTitle,
      logo,
      favicon,
      tags[]{
        label,
        slug,
        order
      }
    }`;

    // Fetch both in parallel
    const [posts, settings] = await Promise.all([
      sanityServerClient.fetch(postsQuery),
      sanityServerClient.fetch(settingsQuery),
    ]);

    // Return combined response
    res.status(200).json({
      posts,
      siteTitle: settings?.siteTitle || null,
      logo: settings?.logo || null,
      favicon: settings?.favicon || null,
      tags: settings?.tags || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching posts and settings" });
  }
}

