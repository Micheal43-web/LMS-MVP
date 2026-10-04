// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  const response = NextResponse.next()

  
  
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()


  

  // مش مسجل دخول خالص → login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // بس لو بيحاول يدخل /courses/new، نتحقق من الـrole
  if (request.nextUrl.pathname.startsWith('/courses/new')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'instructor' && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/courses', request.url))
    }
  }

  // بس لو بيحاول يدخل صفحة إضافة دروس (لأي كورس)
  if (request.nextUrl.pathname.includes('/lessons/new')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'instructor' && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/courses', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/courses/new', '/courses/:path*/lessons/new', '/my-courses/:path*' , '/courses/:path*'],
}