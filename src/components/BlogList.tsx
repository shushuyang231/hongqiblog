import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Post } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface BlogListProps {
  onSelectPost: (id: string) => void
}

const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    title: "构成主义宣言：新世界的视觉语言",
    slug: "constructivist-manifesto",
    excerpt:
      "当塔特林将钢铁与玻璃编织成第三国际纪念碑的蓝图时，一种前所未有的视觉语言诞生了——它不属于沙龙，不属于宫廷，而属于广场与工厂。",
    content: `当塔特林将钢铁与玻璃编织成第三国际纪念碑的蓝图时，一种前所未有的视觉语言诞生了——它不属于沙龙，不属于宫廷，而属于广场与工厂。

构成主义不是装饰的艺术，而是建造的艺术。它拒绝再现世界的外貌，转而揭示世界的结构。在这里，直线就是力量，圆弧就是运动，红色就是意志，黑色就是深度。

罗德琴柯说：「我们不需要艺术的圣殿，我们需要生活的实验室。」这句话至今仍在回响。每一面由几何色块分割的海报，每一条穿越画面的对角线，每一个以工业字体书写的标语，都在延续这场视觉革命的遗产。

我们站在巨人的肩膀上，但我们的目光投向更远的地平线。构成主义的未来，在每一个敢于以设计重塑世界的行动中。`,
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
    content: `从李西茨基的「红色楔子击穿白色圆」到今日的数字视觉叙事，红色几何始终是变革意志的视觉化身。

1919年，李西茨基创作了那幅著名的宣传画：一个锐利的红色三角形刺入白色圆形。这不是抽象的装饰，而是一个视觉论点——进步的力量突破保守的壁垒。几何不再是中立的形式语言，而是立场鲜明的政治表达。

这种视觉策略贯穿了整个二十世纪。古巴的革命海报、巴黎六八年的街头涂鸦、日本全共斗的版画——它们共享着同一套视觉语法：高对比度的色块、粗犷的字体、对角线的张力、留白与实体的戏剧性对抗。

进入数字时代，这套语法并未消亡，而是获得了新的载体。CSS的clip-path继承了剪纸的锐利，SVG的渐变承续了油墨的厚重，动画曲线延续了对运动的赞颂。红色几何在屏幕上获得了新的生命。`,
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
    content: `对称是秩序的修辞，对角线是变革的语法。每一次对画面对角线的穿越，都是对既定秩序的视觉挑战。

古典主义将构图锁定在垂直与水平的交叉点上——那是神坛与王座的视觉语言，是权威固若金汤的暗示。而构成主义者选择了对角线。从左下到右上的斜线是上升的力量，从左上到右下的斜线是冲击的动能。

亚历山大·罗德琴柯的诗歌插图将文字沿对角线排列，迫使读者的视线穿越画面的每一寸领土。古斯塔夫·克鲁西斯的政治拼贴将红旗的飘扬方向与对角线重合，让意识形态的信仰获得了物理性的动感。

在网页设计中，对角线的遗产依然鲜活。clip-path: polygon() 创造的斜角切边，transform: skew() 带来的形变，gradient 的倾斜方向——每一次对正交体系的偏离，都是对视觉惯性的微小革命。`,
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
    content: `当字母不再是文人墨客的专利，而成为街头与工厂的视觉武器，排版便从技艺升华为行动。

构成主义的字体哲学可以浓缩为一个原则：可读性即民主性。华丽的衬线体属于图书馆和教堂，而粗犷的无衬线体属于街头和广场。当罗德琴柯将巨型字母横跨整个画面时，他不是在「排版」，而是在「宣言」——每一个字符都像一块砖，构建着新世界的视觉立面。

二十世纪的政治海报传承了这一传统。弗拉迪米尔·梅德韦杰夫为苏联航空展设计的海报上，字母的粗细几乎与飞机的钢梁等量齐观。雷内·梅托的诗意排印中，字间距本身就是节奏的呼吸。

今天的网页字体技术让这种传统获得了新的维度。可变字体(variable fonts)让我们可以在粗细之间连续调节，就像调节扩音器的音量。@font-face 让任何字体都能抵达任何屏幕，就像当年的油印传单抵达任何街角。`,
    tags: ["字体", "排版"],
    created_at: "2024-07-20T16:00:00Z",
    published_at: "2024-07-20T16:00:00Z",
  },
]

export function BlogList({ onSelectPost }: BlogListProps) {
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS)

  useEffect(() => {
    let cancelled = false

    async function fetchPosts() {
      try {
        const timeout = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 4000)
        )
        const fetch = supabase
          .from("posts")
          .select("*")
          .order("published_at", { ascending: false })
          .then(({ data, error }) => {
            if (error) throw error
            return data
          })

        const data = await Promise.race([fetch, timeout])
        if (!cancelled && data && data.length > 0) {
          setPosts(data)
        }
      } catch {
        // keep SAMPLE_POSTS
      }
    }
    fetchPosts()
    return () => { cancelled = true }
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-1 flex-1 bg-red-flag" />
        <h2 className="text-2xl font-black tracking-tight text-foreground uppercase sm:text-3xl">
          文章
        </h2>
        <div className="h-1 flex-1 bg-red-flag" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <article
            key={post.id}
            className="group relative cursor-pointer overflow-hidden border-2 border-primary/20 bg-card transition-all duration-300 hover:border-primary hover:shadow-[4px_4px_0_var(--yellow-star)] hover:-translate-y-1"
            style={{
              clipPath:
                index % 3 === 0
                  ? "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)"
                  : index % 3 === 1
                    ? "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)"
                    : "polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)",
            }}
            onClick={() => onSelectPost(post.id)}
          >
            <div className="absolute top-0 left-0 h-1 w-full bg-red-flag" />

            <div className="p-5">
              <div className="mb-3 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-red-flag/40 text-red-flag font-bold text-xs uppercase"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h3 className="mb-2 text-lg font-black leading-tight tracking-tight text-foreground uppercase group-hover:text-primary sm:text-xl">
                {post.title}
              </h3>

              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <time className="text-xs font-bold text-yellow-star uppercase">
                  {new Date(post.published_at).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span className="text-sm font-black text-primary transition-transform group-hover:translate-x-1">
                  阅读 →
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
