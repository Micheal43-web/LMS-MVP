"use client"

import React, { useEffect, useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { useRouter } from 'next/navigation'
import Loader from '../Loader'
import Sidebar from '../components/SideBar'
import { useRole } from '../hooks/useRole'
import Link from 'next/link'
import { Menu, Plus, Trash } from 'lucide-react'
import { supabase } from '../lib/supabase/client'

function page() {

  interface Course {
    id: string,
    title: string,
    price: number,
    image_url: string,
    instructor_id: string
  }

  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const { user, loading } = useUser()

  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([])

  const checkEnrollments = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("student_id", user.id)

    if (error) {
      console.log(error)
      return
    }

    if (data) {
      setEnrolledCourseIds(data.map((e) => e.course_id))
    }
  }

  useEffect(() => {
    if (user) {
      fetchCourses()
      checkEnrollments()
    }
  }, [user])



  const fetchCourses = async () => {
    const { data, error } = await supabase.from("courses").select("id , image_url , title , price, instructor_id")

    if (error) {
      alert("err")
      console.log(error)
      return;
    }

    if (data) {
      setCourses(data)

    }

    setLoadingCourses(false)

  }

  const deleteCourses = async (id: string) => {
    const { error } = await supabase.from("courses").delete().eq("id",id)

    setCourses((prev) => prev.filter((cour) => cour.id !== id))
  }




  const handleEnroll = async (id: string) => {


    const { error } = await supabase.from("enrollments").insert({
      student_id: user?.id,
      course_id: id
    })

    if (error) {
      alert("You Can't Enroll The Same Course")
      console.log(error)
      return;
    }

    setEnrolledCourseIds((prev) => [...prev, id])
    alert("Course Enrolled Successfully !")


  }







  const { role, loadingRole } = useRole()
  const router = useRouter()

  const [sideMenuOpened, setSideMenuOpened] = useState(false)

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) return <Loader />
  if (!user) return null;

  if (loadingCourses) return (
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
          <div className="items-center justify-between flex">
            <h1 className='text-3xl font-bold my-10'>All Courses</h1>
            {
              (role === "instructor" || role === "admin") &&
              <Link href={"/courses/new"} className='bg-primary p-4 text-white rounded-2xl'>
                <Plus />
              </Link>

            }
          </div>



          <div className={courses.length <= 0 ? "flex items-center justify-center" : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"}>
            {courses.map((cour) => {
              const enrolled = enrolledCourseIds.includes(cour.id)

              return (
                <div key={cour.id} className='flex flex-col justify-between gap-2 p-3 rounded-2xl  border-t-4 border-t-primary shadow-md'>
                  <div className="flex flex-col gap-2">
                    <img src={cour.image_url} className='rounded-2xl' />
                    <span className='mt-3 font-semibold'>{cour.title}</span>
                    <span className='font-semibold'>{cour.price} EGP</span>
                  </div>

                  {!enrolled ? (
                    <button onClick={() => handleEnroll(cour.id)} className='bg-primary py-4 rounded-2xl text-white font-bold mt-5 cursor-pointer hover:rounded-3xl transition-all duration-300'>
                      Enroll Course
                    </button>
                  ) : (
                    <>
                      <Link className='flex items-center justify-center border-2 border-primary bg-white py-4 rounded-2xl text-primary font-bold mt-5 cursor-pointer hover:rounded-3xl transition-all duration-300' href={`/courses/${cour.id}/lessons`}>
                        Go To Course
                      </Link>
                      {
                        cour.instructor_id === user?.id && <button onClick={() => deleteCourses(cour.id)} className='bg-primary rounded-2xl p-3 text-white flex items-center justify-center gap-3'><Trash /> Delete</button>
                      }
                    </>
                  )}
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </>
  )
}

export default page