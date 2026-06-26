import { RedFlag } from "./RedFlag"

export function HeroSection() {
  return (
    <header className="relative overflow-hidden bg-carbon">
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)",
          background: "var(--red-flag)",
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          clipPath: "polygon(60% 0, 100% 0, 100% 55%, 40% 80%)",
          background: "var(--yellow-star)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20 lg:py-28">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-12">
          <div className="shrink-0">
            <RedFlag className="h-32 w-auto sm:h-44 lg:h-56" />
          </div>

          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h1
              className="text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl"
              style={{ lineHeight: 0.9 }}
            >
              为了更好的
              <br />
              <span className="text-yellow-star">明天</span>
            </h1>

            <div className="mt-4 flex flex-col gap-1 font-bold tracking-wide text-white/80 sm:mt-6">
              <span className="text-lg sm:text-xl">Pour un avenir meilleur</span>
              <span className="text-base sm:text-lg">より良い明日のために</span>
              <span className="text-base sm:text-lg">За лучшее завтра</span>
            </div>

            <div className="mt-6 h-1 w-24 bg-yellow-star sm:mt-8 sm:w-32" />
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-2"
        style={{
          background: "var(--yellow-star)",
        }}
      />
    </header>
  )
}
