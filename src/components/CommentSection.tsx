import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Comment } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [nickname, setNickname] = useState("")
  const [body, setBody] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function fetchComments() {
      try {
        const timeout = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 4000)
        )
        const fetch = supabase
          .from("comments")
          .select("*")
          .eq("post_id", postId)
          .order("created_at", { ascending: true })
          .then(({ data, error }) => {
            if (error) throw error
            return data
          })

        const data = await Promise.race([fetch, timeout])
        if (!cancelled && data) setComments(data)
      } catch {
        // no comments available
      }
    }
    fetchComments()
    return () => { cancelled = true }
  }, [postId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedNickname = nickname.trim()
    const trimmedBody = body.trim()
    if (!trimmedNickname || !trimmedBody) return

    setSubmitting(true)

    const optimisticComment: Comment = {
      id: crypto.randomUUID(),
      post_id: postId,
      nickname: trimmedNickname,
      body: trimmedBody,
      created_at: new Date().toISOString(),
    }

    setComments((prev) => [...prev, optimisticComment])
    setBody("")

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          nickname: trimmedNickname,
          body: trimmedBody,
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === optimisticComment.id ? data : c
          )
        )
      }
    } catch {
      setComments((prev) =>
        prev.filter((c) => c.id !== optimisticComment.id)
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pb-16">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-0.5 flex-1 bg-yellow-star" />
        <h3 className="text-xl font-black tracking-tight text-foreground uppercase">
          评论
        </h3>
        <div className="h-0.5 flex-1 bg-yellow-star" />
      </div>

      <form onSubmit={handleSubmit} className="mb-10 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-bold uppercase text-foreground">
            昵称
          </label>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="你的名字"
            required
            className="border-primary/30 bg-background font-medium placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-bold uppercase text-foreground">
            评论内容
          </label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="写下你的想法……"
            required
            rows={3}
            className="border-primary/30 bg-background font-medium placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30"
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="bg-red-flag border-2 border-yellow-star text-white font-black uppercase tracking-wider transition-all hover:bg-red-flag/90 active:scale-95 active:ring-4 active:ring-yellow-star/40 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Spinner className="mr-2" />
              发表中…
            </>
          ) : (
            "发表评论"
          )}
        </Button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-center text-sm text-muted-foreground italic">
            暂无评论，来写下第一条吧
          </p>
        )}
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border-l-4 border-red-flag bg-card p-4 transition-colors hover:bg-accent/5"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-black text-yellow-star uppercase">
                {comment.nickname}
              </span>
              <time className="text-xs font-medium text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString("zh-CN", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              {comment.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
