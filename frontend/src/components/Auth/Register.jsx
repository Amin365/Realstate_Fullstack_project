// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {  useNavigate } from "react-router";
import axios from 'axios'
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner"


export function RegisterForm({ className, ...props }) {
  const navigate = useNavigate();

  const [FormValue, setFormValue] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [Error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const RegisterMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await api.post( "auth/register",userData
      );
      return response.data;
    },
    onSuccess: (data) => {
      
      toast('Registration successful')
      navigate("/login");
    },
    onError: (error) => {
     
      toast(error)
      setError(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !FormValue.name ||
      !FormValue.email ||
      !FormValue.password ||
      !FormValue.confirmPassword
    ) {
      return setError("All fields are required");
    }

    if (FormValue.password !== FormValue.confirmPassword) {
      return setError("Passwords do not match");
    }

    setError("");

    RegisterMutation.mutate({
      name: FormValue.name,
      email: FormValue.email,
      password: FormValue.password,
    });
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to create your account
        </p>
      </div>

      {Error && <p className="text-red-500 text-sm">{Error}</p>}

      <div className="grid gap-6">
        {/* Name */}
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Gedi Farah"
            required
            value={FormValue.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            value={FormValue.email}
            onChange={handleChange}
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
            value={FormValue.password}
            onChange={handleChange}
          />
        </div>

        {/* Confirm Password */}
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            placeholder="******"
            value={FormValue.confirmPassword}
            onChange={handleChange}
          />
        </div>

        {/* Register Button */}
        <Button type="submit" className="w-full">
          {RegisterMutation.isPending ? (<span className='flex items-center gap-2'><LoaderCircle /> Creating account... </span>) : ("Create Account")}
        </Button>

        {/* Divider */}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            New To Waansan Real State
          </span>
        </div>
      </div>

      {/* Login link */}
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a
          onClick={() => navigate("/login")}
          className="text-primary hover:underline cursor-pointer"
        >
          Log in
        </a>
      </div>
    </form>
  );
}
