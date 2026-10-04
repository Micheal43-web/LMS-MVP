
"use client";

import { School } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";
import { useUser } from "../contexts/UserContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useUser()
  const [ loading, setLoading ] = useState(false)
  const [ error, setError ] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password
    })

    if(error) {
      console.log(error)
      setError(error.message)
      return
    }

    router.push("/courses")
  };


  useEffect(() => {
    if(user && !loading) {
      router.push("/courses")
    }
  },[user, loading, router])

  return (
    <main className="min-h-screen bg-slate-50 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">


        {/* Login Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Logo */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                <School />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to your account to continue
              </p>
            </div>

            {
              error && <span className="text-red-500 my-5">{error}</span>
            }
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                
              </div>

              <input
                
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              />
            </div>

            

            {/* Login Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.99]"
            >
              Sign in
            </button>
          </form>

          {/* Divider */}



        </div>


      </div>
    </main>
  );
}

