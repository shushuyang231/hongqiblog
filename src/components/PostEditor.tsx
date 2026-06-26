import { useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Post } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft } from "lucide-react"

interface PostEditorProps {
  onPublished: (post: Post) => void
  onBack: () => void
}

function slugify(text: string): string {
  const map: Record<string, string> = {
    构成主义: "constructivism",
    设计: "design",
    红色: "red",
    几何: "geometry",
    对角线: "diagonal",
    字体: "typography",
    排版: "layout",
    视觉: "visual",
    政治: "politics",
    美学: "aesthetics",
    工业: "industrial",
    构图: "composition",
    理论: "theory",
    谱系: "genealogy",
  }
  let slug = text
  for (const [cn, en] of Object.entries(map)) {
    slug = slug.replaceAll(cn, en)
  }
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return slug || `post-${Date.now()}`
}

export function PostEditor({ onPublished, onBack }: PostEditorProps) {
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedExcerpt = excerpt.trim()
    const trimmedContent = content.trim()
    if (!trimmedTitle || !trimmedExcerpt || !trimmedContent) return

    const tags = tagsInput
      .split(/[,，、\s]+/)
      .map((t) => t.trim())
      .filter(Boolean)

    setSubmitting(true)
    setError(null)

    try {
      const { data, error: insertError } = await supabase
        .from("posts")
        .insert({
          title: trimmedTitle,
          slug: slugify(trimmedTitle),
          excerpt: trimmedExcerpt,
          content: trimmedContent,
          tags,
          published_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) throw insertError
      if (data) {
        onPublished(data as Post)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "发布失败，请重试")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="relative overflow-hidden bg-red-flag">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            clipPath: "polygon(70% 0, 100% 0, 100% 100%, 50% 100%)",
            background: "var(--yellow-star)",
          }}
        />
        <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="mb-6 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="mr-1 size-4" />
            返回
          </Button>

          <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl lg:text-5xl">
            发布新文章
          </h1>
          <p className="mt-3 text-sm font-bold text-white/70 uppercase">
            Publish a new manifesto
          </p>
        </div>

        <div className="h-1 bg-yellow-star" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-bold uppercase text-foreground">
              标题
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章标题"
              required
              className="border-primary/30 bg-background font-medium placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold uppercase text-foreground">
              摘要
            </label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="一句话概括文章主旨……"
              required
              rows={2}
              className="border-primary/30 bg-background font-medium placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold uppercase text-foreground">
              正文
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="用空行分隔段落……"
              required
              rows={10}
              className="border-primary/30 bg-background font-medium placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              段落之间用空行分隔。
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold uppercase text-foreground">
              标签
            </label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="构成主义, 设计理论"
              className="border-primary/30 bg-background font-medium placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              用逗号或空格分隔多个标签。
            </p>
          </div>

          {error && (
            <p className="border-l-4 border-destructive bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="bg-red-flag border-2 border-yellow-star text-white font-black uppercase tracking-wider transition-all hover:bg-red-flag/90 active:scale-95 active:ring-4 active:ring-yellow-star/40 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Spinner className="mr-2" />
                发布中…
              </>
            ) : (
              "发布文章"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
