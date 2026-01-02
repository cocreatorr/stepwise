import { useEffect, useState } from 'react'

export default function Posts() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data))
  }, [])

  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post._id}>{post.title}</li>
      ))}
    </ul>
  )
}

