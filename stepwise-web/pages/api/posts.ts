import type { NextApiRequest, NextApiResponse } from "next";
import { sanityServerClient } from "../../lib/sanity.server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = `*[_type == "post"]{
      _id,
      title,
      slug,
      excerpt,
      "author": author->{ name, slug },
      categories[]->{ title, slug }
    } | order(publishedAt desc)`;

    const posts = await sanityServerClient.fetch(query);

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching posts" });
  }
}
