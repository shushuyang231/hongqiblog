export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  created_at: string
  published_at: string
}

export interface Comment {
  id: string
  post_id: string
  nickname: string
  body: string
  created_at: string
}
