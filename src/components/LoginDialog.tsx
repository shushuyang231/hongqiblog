import { useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { LockKeyhole } from "lucide-react"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function LoginDialog({ open, onOpenChange, onSuccess }: LoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (authError) {
      setError("邮箱或密码错误，请重试。")
      return
    }

    setEmail("")
    setPassword("")
    onOpenChange(false)
    onSuccess()
  }

  function handleOpenChange(val: boolean) {
    if (!loading) {
      setError(null)
      onOpenChange(val)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm border-2 border-primary/30">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center bg-red-flag text-white">
              <LockKeyhole className="size-4" />
            </div>
            <DialogTitle className="text-lg font-black uppercase tracking-tight">
              管理员登录
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-foreground">
              邮箱
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
              className="border-primary/30 bg-background focus-visible:border-primary focus-visible:ring-primary/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-foreground">
              密码
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="border-primary/30 bg-background focus-visible:border-primary focus-visible:ring-primary/30"
            />
          </div>

          {error && (
            <p className="border-l-4 border-destructive bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-flag border-2 border-yellow-star text-white font-black uppercase tracking-wider hover:bg-red-flag/90 active:scale-95 active:ring-4 active:ring-yellow-star/40 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Spinner className="mr-2" />
                验证中…
              </>
            ) : (
              "登录"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
