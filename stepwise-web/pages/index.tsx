import { sanityClient } from '../lib/sanity.client'

export async function getStaticProps() {
  // GROQ query: fetch all posts with title + slug
  const query = `*[_type == "post"]{title, slug}`
  const posts = await sanityClient.fetch(query)

  return {
    props: { posts },
  }
}

export default function Home({ posts }: { posts: any[] }) {
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug.current}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}

