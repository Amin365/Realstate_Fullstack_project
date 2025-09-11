import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { extractErrorMessages } from "../../../../backend/util/GlobalEror.js"
import { useState } from "react"
import axios from "axios"
import { LoaderCircle } from "lucide-react"
import { useDispatch, useSelector } from "react-redux";
import api from "../../lib/api/CleintApi.js"
import { setAuth } from "../../lib/Reduxs/authSlice.js"


export function LoginForm({ className, ...props }) {
  const navigate = useNavigate()
  const disptach =useDispatch()
 
 
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  })

  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const LoginMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await api.post(
        "/auth/login",
        userData
      )
      return response.data
    },
    onSuccess: (data) => {
      if(data.token){
        disptach(setAuth({user:data.user,token:data.token}))
        navigate("/dashboard")
      }
    },
    onError: (err) => {
      setError(extractErrorMessages(err))
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    if (!formValue.email || !formValue.password) {
      setError("All fields are required")
      return
    }

    LoginMutation.mutate({
      email: formValue.email,
      password: formValue.password,
    })
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>

      {
        error && (
          <div className='p-3 bg-destructive/10 text-destructive text-sm rounded-md text-center'>
            {error}
          </div>
        )
      }

      <div className="grid gap-6">
        {/* Email */}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            value={formValue.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="******"
            value={formValue.password}
            onChange={handleChange}
          />
        </div>

        {/* Login Button */}
        <Button type="submit" className="w-full" disabled={LoginMutation.isLoading}>
          {LoginMutation.isLoading ? (<span className='flex items-center gap-2'><LoaderCircle /> login account... </span>) : ("login Account")}
        </Button>

        {/* Divider */}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            New To Waansan Real State
          </span>
        </div>
      </div>

      {/* Sign up link */}
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a
          onClick={() => navigate("/register")}
          className="underline underline-offset-4 text-primary hover:cursor-pointer"
        >
          Sign up
        </a>
      </div>
    </form>
  )
}
