import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { toast } from "@/components/ui/sonner"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      await login(values)
      toast.success("Logged in")
      const redirectTo = (location.state as any)?.from || "/chat"
      navigate(redirectTo)
    } catch (e: any) {
      toast.error(e?.message || "Login failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="h-screen w-full grid place-items-center p-4 relative">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" onClick={() => navigate("/")}> <ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl border p-6 backdrop-blur-sm gradient-card shadow-[var(--shadow-medium)]">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F32a7517d76b941f98c61312e3af1852a%2F53b5b2631496451f9497061e0706b217?format=webp&width=800"
          alt="Sahai logo"
          className="w-24 mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in to continue</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" placeholder="your username" {...register("username")} />
            {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...register("password")} />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={submitting || loading}>
            {submitting || loading ? "Signing in..." : "Sign in"}
          </Button>
          <Button variant="secondary" className="w-full" to="/admin">
            Login as Admin
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Don't have an account? <Link to="/signup" className="underline">Create one</Link>
        </p>
      </motion.div>
    </div>
  )
}
