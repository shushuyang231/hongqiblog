import { useState } from "react"
import { HeroSection } from "@/components/HeroSection"
import { BlogList } from "@/components/BlogList"
import { BlogPost } from "@/components/BlogPost"
import { PostEditor } from "@/components/PostEditor"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { PenSquare } from "lucide-react"
import type { Post } from "@/lib/types"

type View = "list" | "post" | "editor"

export function App() {
  const [view, setView] = useState<View>("list")
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  function handleSelectPost(id: string) {
    setSelectedPostId(id)
    setView("post")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleBack() {
    setView("list")
    setSelectedPostId(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handlePublished(_post: Post) {
    setRefreshKey((k) => k + 1)
    setView("list")
    setSelectedPostId(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleDeleted() {
    setRefreshKey((k) => k + 1)
    setView("list")
    setSelectedPostId(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-svh bg-background">
      <nav className="sticky top-0 z-50 border-b-2 border-red-flag bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-lg font-black tracking-tighter uppercase text-foreground transition-colors hover:text-primary"
          >
            <span className="text-red-flag">红旗</span>
            <span className="text-yellow-star">HONGQI</span>
          </button>

          <div className="flex items-center gap-3">
            {view !== "editor" && (
              <Button
                size="sm"
                onClick={() => {
                  setView("editor")
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="bg-red-flag border-2 border-yellow-star text-white font-black uppercase tracking-wider transition-all hover:bg-red-flag/90 active:scale-95 active:ring-4 active:ring-yellow-star/40"
              >
                <PenSquare className="mr-1 size-4" />
                发布文章
              </Button>
            )}
            <div className="hidden h-4 w-px bg-border sm:block" />
            <ModeToggle />
          </div>
        </div>
      </nav>

      {view === "list" && (
        <>
          <HeroSection />
          <BlogList key={refreshKey} onSelectPost={handleSelectPost} />
        </>
      )}

      {view === "post" && selectedPostId && (
        <BlogPost
          postId={selectedPostId}
          onBack={handleBack}
          onDeleted={handleDeleted}
        />
      )}

      {view === "editor" && (
        <PostEditor onPublished={handlePublished} onBack={handleBack} />
      )}

      <footer className="border-t-2 border-red-flag bg-carbon">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-3 text-sm font-bold uppercase text-white/70">
              <span className="text-red-flag">红旗</span>
              <span className="h-3 w-px bg-white/30" />
              <span className="text-yellow-star">HONGQI</span>
            </div>
            <p className="text-xs text-white/40">
              构成主义视觉实验 / Constructivist Visual Experiment
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
