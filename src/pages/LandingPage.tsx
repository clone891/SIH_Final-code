import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const words = [
  "Sahai",
  "सहाई",
  "सहाय",
  "সহাই",
  "સહાઈ",
  "ਸਹਾਈ",
  "सहाय्य",
  "सहाय",
  "సహాయి",
  "ಸಹಾಯಿ",
  "സഹായി",
  "சஹாய்",
  "سہائی",
  "سهاي",
  "サハイ",
  "사하이",
  "萨海",
  "Сахай",
  "Σαχάι",
]

const instances = Array.from({ length: 36 }, (_, i) => i)

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Animated multilingual background */}
      <div className="absolute inset-0 select-none pointer-events-none">
        {instances.map((i) => {
          const word = words[i % words.length]
          const left = (i * 137) % 100 // pseudo-random spread
          const top = (i * 83) % 100
          const delay = (i % 10) * 0.25
          const duration = 6 + (i % 5)
          const size = 28 + (i % 6) * 4

          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.18, y: [0, -8, 0] }}
              transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
              style={{ left: `${left}%`, top: `${top}%` }}
              className="absolute text-foreground/50 whitespace-nowrap"
            >
              <span className="font-semibold" style={{ fontSize: `${size}px` }}>{word}</span>
            </motion.span>
          )
        })}

        {/* slow shimmer overlay */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(1200px 500px at 20% 20%, rgba(255,255,255,0.15), transparent 60%), radial-gradient(1200px 500px at 80% 80%, rgba(255,255,255,0.12), transparent 60%)",
          }}
        />
      </div>

      {/* Foreground logo and CTA */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-8">
        <motion.img
          src="https://cdn.builder.io/api/v1/image/assets%2F32a7517d76b941f98c61312e3af1852a%2F53b5b2631496451f9497061e0706b217?format=webp&width=800"
          alt="Sahai logo"
          className="w-[260px] max-w-[70vw] drop-shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Welcome to Sahai
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Your calm space for support and growth.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              size="lg"
              className="rounded-xl px-8 py-6 text-lg shadow-lg hover:scale-105 transition"
              onClick={() => navigate("/chat")}
            >
              Enter Sahai
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="secondary" className="rounded-xl" onClick={() => navigate("/login")}>
                Log in
              </Button>
              <Button className="rounded-xl" onClick={() => navigate("/signup")}>
                Sign up
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* soft vignette and gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(60,45,90,0.08), rgba(80,65,110,0.06)), radial-gradient(circle at 20% 0%, rgba(255,255,255,0.5), transparent 35%), radial-gradient(circle at 80% 100%, rgba(255,255,255,0.4), transparent 35%)",
        }}
      />
    </div>
  )
}

export default LandingPage
