import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Post } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { CommentSection } from "./CommentSection"

const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    title: "构成主义宣言：新世界的视觉语言",
    slug: "constructivist-manifesto",
    excerpt:
      "当塔特林将钢铁与玻璃编织成第三国际纪念碑的蓝图时，一种前所未有的视觉语言诞生了——它不属于沙龙，不属于宫廷，而属于广场与工厂。",
    content: `当塔特林将钢铁与玻璃编织成第三国际纪念碑的蓝图时，一种前所未有的视觉语言诞生了——它不属于沙龙，不属于宫廷，而属于广场与工厂。\n\n构成主义不是装饰的艺术，而是建造的艺术。它拒绝再现世界的外貌，转而揭示世界的结构。在这里，直线就是力量，圆弧就是运动，红色就是意志，黑色就是深度。\n\n罗德琴柯说：「我们不需要艺术的圣殿，我们需要生活的实验室。」这句话至今仍在回响。每一面由几何色块分割的海报，每一条穿越画面的对角线，每一个以工业字体书写的标语，都在延续这场视觉革命的遗产。\n\n我们站在巨人的肩膀上，但我们的目光投向更远的地平线。构成主义的未来，在每一个敢于以设计重塑世界的行动中。`,
    tags: ["构成主义", "设计理论"],
    created_at: "2024-06-01T10:00:00Z",
    published_at: "2024-06-01T10:00:00Z",
  },
  {
    id: "2",
    title: "红色几何：政治美学的视觉谱系",
    slug: "red-geometry-political-aesthetics",
    excerpt:
      `从李西茨基的「红色楔子击穿白色圆」到今日的数字视觉叙事，红色几何始终是变革意志的视觉化身。`,
    content: `从李西茨基的「红色楔子击穿白色圆」到今日的数字视觉叙事，红色几何始终是变革意志的视觉化身。\n\n1919年，李西茨基创作了那幅著名的宣传画：一个锐利的红色三角形刺入白色圆形。这不是抽象的装饰，而是一个视觉论点——进步的力量突破保守的壁垒。几何不再是中立的形式语言，而是立场鲜明的政治表达。\n\n这种视觉策略贯穿了整个二十世纪。古巴的革命海报、巴黎六八年的街头涂鸦、日本全共斗的版画——它们共享着同一套视觉语法：高对比度的色块、粗犷的字体、对角线的张力、留白与实体的戏剧性对抗。\n\n进入数字时代，这套语法并未消亡，而是获得了新的载体。CSS的clip-path继承了剪纸的锐利，SVG的渐变承续了油墨的厚重，动画曲线延续了对运动的赞颂。红色几何在屏幕上获得了新的生命。`,
    tags: ["视觉谱系", "政治美学"],
    created_at: "2024-06-15T14:00:00Z",
    published_at: "2024-06-15T14:00:00Z",
  },
  {
    id: "3",
    title: "对角线宣言：不对称构图的力量",
    slug: "diagonal-manifesto",
    excerpt:
      "对称是秩序的修辞，对角线是变革的语法。每一次对画面对角线的穿越，都是对既定秩序的视觉挑战。",
    content: `对称是秩序的修辞，对角线是变革的语法。每一次对画面对角线的穿越，都是对既定秩序的视觉挑战。\n\n古典主义将构图锁定在垂直与水平的交叉点上——那是神坛与王座的视觉语言，是权威固若金汤的暗示。而构成主义者选择了对角线。从左下到右上的斜线是上升的力量，从左上到右下的斜线是冲击的动能。\n\n亚历山大·罗德琴柯的诗歌插图将文字沿对角线排列，迫使读者的视线穿越画面的每一寸领土。古斯塔夫·克鲁西斯的政治拼贴将红旗的飘扬方向与对角线重合，让意识形态的信仰获得了物理性的动感。\n\n在网页设计中，对角线的遗产依然鲜活。clip-path: polygon() 创造的斜角切边，transform: skew() 带来的形变，gradient 的倾斜方向——每一次对正交体系的偏离，都是对视觉惯性的微小革命。`,
    tags: ["构图理论", "对角线"],
    created_at: "2024-07-01T09:00:00Z",
    published_at: "2024-07-01T09:00:00Z",
  },
  {
    id: "4",
    title: "工业字体与群众之声",
    slug: "industrial-typography",
    excerpt:
      "当字母不再是文人墨客的专利，而成为街头与工厂的视觉武器，排版便从技艺升华为行动。",
    content: `当字母不再是文人墨客的专利，而成为街头与工厂的视觉武器，排版便从技艺升华为行动。\n\n构成主义的字体哲学可以浓缩为一个原则：可读性即民主性。华丽的衬线体属于图书馆和教堂，而粗犷的无衬线体属于街头和广场。当罗德琴柯将巨型字母横跨整个画面时，他不是在「排版」，而是在「宣言」——每一个字符都像一块砖，构建着新世界的视觉立面。\n\n二十世纪的政治海报传承了这一传统。弗拉迪米尔·梅德韦杰夫为苏联航空展设计的海报上，字母的粗细几乎与飞机的钢梁等量齐观。雷内·梅托的诗意排印中，字间距本身就是节奏的呼吸。\n\n今天的网页字体技术让这种传统获得了新的维度。可变字体(variable fonts)让我们可以在粗细之间连续调节，就像调节扩音器的音量。@font-face 让任何字体都能抵达任何屏幕，就像当年的油印传单抵达任何街角。`,
    tags: ["字体", "排版"],
    created_at: "2024-07-20T16:00:00Z",
    published_at: "2024-07-20T16:00:00Z",
  },
]

interface BlogPostProps {
  postId: string
  onBack: () => void
}

export function BlogPost({ postId, onBack }: BlogPostProps) {
  const initialPost = SAMPLE_POSTS.find((p) => p.id === postId) ?? null
  const [post, setPost] = useState<Post | null>(initialPost)

  useEffect(() => {
    let cancelled = false
    async function fetchPost() {
      try {
        const timeout = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 4000)
        )
        const fetch = supabase
          .from("posts")
          .select("*")
          .eq("id", postId)
          .maybeSingle()
          .then(({ data, error }) => {
            if (error) throw error
            return data
          })

        const data = await Promise.race([fetch, timeout])
        if (!cancelled && data) setPost(data)
      } catch {
        // keep initial sample post
      }
    }
    fetchPost()
    return () => { cancelled = true }
  }, [postId])

  if (!post) return null

  return (
    <article>
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

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                className="border-yellow-star bg-transparent text-yellow-star font-bold uppercase"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <time className="mt-4 block text-sm font-bold text-white/70 uppercase">
            {new Date(post.published_at).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        <div className="h-1 bg-yellow-star" />
      </div>

      <div
        className="mx-auto max-w-3xl px-4 py-10 sm:px-6"
        style={{
          background:
            "repeating-linear-gradient(-45deg, transparent, transparent 10px, oklch(0.95 0.01 27 / 0.05) 10px, oklch(0.95 0.01 27 / 0.05) 11px)",
        }}
      >
        <div className="prose prose-lg max-w-none">
          {post.content.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="mb-6 text-base leading-relaxed text-foreground sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="h-1 bg-red-flag mb-10" />
        <CommentSection postId={post.id} />
      </div>
    </article>
  )
}
