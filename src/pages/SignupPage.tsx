import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { toast } from "@/components/ui/sonner"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

const schema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Only letters, numbers, underscores, dots, and dashes"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm: z.string().min(6),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
})

type FormValues = z.infer<typeof schema>

export default function SignupPage() {
  const { signup, loading } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const onSubmit = async (values: FormValues) => {
  setSubmitting(true);
  try {
    // Step 1: Register user
    const registerRes = await fetch("http://127.0.0.1:8000/api/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: values.username,
        firstName: values.firstName,  // backend maps this to first_name
        lastName: values.lastName,    // backend maps this to last_name
        email: values.email,
        password: values.password,
        confirm: values.confirm,
      }),
    });

    if (!registerRes.ok) {
      const errData = await registerRes.json();
      throw new Error(errData?.detail || "Signup failed");
    }

    // Step 2: Auto login user after signup
    const loginRes = await fetch("http://127.0.0.1:8000/api/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    });

    if (!loginRes.ok) {
      throw new Error("Account created but login failed. Please try logging in.");
    }

    const loginData = await loginRes.json();

    // Step 3: Store JWT tokens
    localStorage.setItem("access", loginData.access);
    localStorage.setItem("refresh", loginData.refresh);

    toast.success("Account created");
    navigate("/profile");
  } catch (e: any) {
    toast.error(e?.message || "Signup failed");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="h-screen w-full grid place-items-center p-4 relative">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F32a7517d76b941f98c61312e3af1852a%2F53b5b2631496451f9497061e0706b217?format=webp&width=800"
          alt="Sahai logo"
          className="h-8 w-auto"
        />
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl">
        <div className="w-full rounded-2xl border p-4 md:p-6 backdrop-blur-sm gradient-card shadow-[var(--shadow-medium)]">
          <h1 className="text-xl font-bold mb-1">Create account</h1>
          <p className="text-xs text-muted-foreground mb-4">Join Sahai</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row items-center justify-center gap-3 mx-auto">
          <div className="space-y-3 rounded-md border p-2 w-full max-w-xs" style={{ backgroundColor: '#8b7cb2' }}>
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" className="h-10" placeholder="Your first name" {...register("firstName")} />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" className="h-10" placeholder="Your last name" {...register("lastName")} />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-3 rounded-md border p-2 w-full max-w-xs" style={{ backgroundColor: '#9182b8' }}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" className="h-10" placeholder="Choose a username" {...register("username")} />
              {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="h-10" placeholder="you@example.com" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} className="h-10" placeholder="••••••••" {...register("password")} />
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
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <div className="relative">
                <Input id="confirm" type={showConfirm ? "text" : "password"} className="h-10" placeholder="••••••••" {...register("confirm")} />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirm && <p className="text-sm text-destructive">{errors.confirm.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={submitting || loading}>
              {submitting || loading ? "Creating..." : "Create account"}
            </Button>
          </div>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="underline">Sign in</Link>
        </p>
        </div>
      </motion.div>
    </div>
  )
}
