import { useState, useEffect } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { HeroSection } from "@/components/HeroSection"
import { BlogList } from "@/components/BlogList"
import { BlogPost } from "@/components/BlogPost"
import { PostEditor } from "@/components/PostEditor"
import { LoginDialog } from "@/components/LoginDialog"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { PenSquare, LogIn, LogOut } from "lucide-react"
import type { Post } from "@/lib/types"

type View = "list" | "post" | "editor"

export function App() {
  const [view, setView] = useState<View>("list")
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [session, setSession] = useState<Session | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => subscription.unsubscribe()
  }, [])

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

  function handlePublishClick() {
    if (!session) {
      setLoginOpen(true)
      return
    }
    setView("editor")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    if (view === "editor") {
      setView("list")
    }
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
                onClick={handlePublishClick}
                className="bg-red-flag border-2 border-yellow-star text-white font-black uppercase tracking-wider transition-all hover:bg-red-flag/90 active:scale-95 active:ring-4 active:ring-yellow-star/40"
              >
                <PenSquare className="mr-1 size-4" />
                发布文章
              </Button>
            )}

            {session ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
                title="退出登录"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline ml-1">退出</span>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setLoginOpen(true)}
                className="text-muted-foreground hover:text-foreground"
                title="管理员登录"
              >
                <LogIn className="size-4" />
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
          isAdmin={!!session}
          onBack={handleBack}
          onDeleted={handleDeleted}
        />
      )}

      {view === "editor" && session && (
        <PostEditor onPublished={handlePublished} onBack={handleBack} />
      )}

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSuccess={() => {
          setView("editor")
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
      />

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
