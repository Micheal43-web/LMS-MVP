"use client"

import React, { useEffect, useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { useRouter } from 'next/navigation'
import Loader from '../Loader'
import Sidebar from '../components/SideBar'
import { useRole } from '../hooks/useRole'
import Link from 'next/link'
import { Check, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase/client'

function page() {

  interface Course {
    id: string,
    title: string,
    price: number,
    image_url: string 
  }

  interface Enrollment {
    id: string,
    student_id: string,
    course_id: string,
    courses: Course | null
  }

  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const { user, loading } = useUser()

  const fetchMyCourses = async () => {
    if (!user) return;

    const { data, error } = await supabase.from("enrollments").select("* , courses(id , title , price , image_url)").eq("student_id", user?.id)

    if (error) {
      alert("err")
      console.log(error)
      return;
    }

    if (data) {
      setEnrollments(data as Enrollment[])
      setLoadingCourses(false)
    }

  }

  useEffect(() => {
    fetchMyCourses()
  }, [user])


  const router = useRouter()
  const [sideMenuOpened, setSideMenuOpened] = useState(false)

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) return <Loader />
  if (!user) return null;

  if(loadingCourses) return (
    <div className='flex w-full h-screen'>
      <Sidebar isOpen={sideMenuOpened} onToggle={() => setSideMenuOpened((prev) => !prev)} />
        <div className="flex flex-col grow p-8">
          <Loader />
        </div>
    </div>
  )



  return (
    <>
      <div className='flex w-full h-screen'>
        <Sidebar isOpen={sideMenuOpened} onToggle={() => setSideMenuOpened((prev) => !prev)} />
        <div className="flex flex-col grow p-8">

            <h1 className='text-3xl font-bold my-10'>My Courses</h1>

          <div className={enrollments.length <= 0 ? "flex items-center justify-center" : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"}>
            {
              enrollments.length > 0 ? enrollments.map((enrollment) => (
                <div key={enrollment.id} className='flex flex-col justify-between gap-2 p-3 rounded-2xl  border-t-4 border-t-primary shadow-md'>
                  <div className="flex flex-col gap-2 ">
                    <img src={enrollment.courses?.image_url} className='rounded-2xl' />
                    <span className='mt-3 font-semibold'>{enrollment.courses?.title}</span>
                    <span className='font-semibold'>{enrollment.courses?.price} EGP</span>
                  </div>

                

                  <Link href={`/courses/${enrollment.courses?.id}/lessons`} className='flex items-center justify-center bg-primary py-4 rounded-2xl text-white font-bold mt-5 cursor-pointer hover:rounded-3xl transition-all duration-300'>Enter Course</Link>

                </div>
              )) : <span className='text-zinc-400 text-center mt-15'>No Enrolled Courses Right Now.</span>
            }
          </div>

        </div>
      </div>
    </>
  )
}

export default page