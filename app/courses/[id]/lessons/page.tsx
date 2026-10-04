"use client"

import { useUser } from '@/app/contexts/UserContext'
import { useRole } from '@/app/hooks/useRole'
import { supabase } from '@/app/lib/supabase/client'
import { ArrowDown, ArrowLeft, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function page() {

  interface Lesson {
    id: string,
    video_url: string,
    title: string,
    order: number
  }

  interface Course {
    title: string,
    image_url: string | null,
    description: string,
    instructor_id: string
  }

  const params = useParams()
  const courseId = params.id as string

  const [lessons, setLessons] = useState<Lesson[]>([])
  const [course, setCourses] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [IsOpened, setIsOpened] = useState(false)



  const fetchCourse = async () => {
    const { data, error } = await supabase.from("courses").select("title , image_url , description , instructor_id").eq("id", courseId).single()

    if (error) {
      alert("err")
      console.log(error)
      setError("Course No Found")
      return;
    }

    if (data) {
      setCourses(data)
    }

    setLoading(false)
  }


  const fetchLessons = async () => {


    const { data, error } = await supabase.from("lessons").select("id , video_url , title , order").eq("course_id", courseId).order("order", { ascending: true })

    if (error) {
      alert("err")
      console.log(error)
      setError("Lessons Not Found !")
      return;
    }

    if (data) {
      setLessons(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (courseId) {
      const loadAll = async () => {
        await Promise.all([fetchCourse(), fetchLessons()])
        setLoading(false)
      }

      loadAll()
    }
  }, [courseId])


  const { role, loadingRole } = useRole()

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    if (lessons.length > 0 && !selectedLesson) {
      setSelectedLesson(lessons[0])
    }
  }, [lessons])

  const [isEnrolled, setIsEnrolled] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    const checkEnrollment = async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("id")
        .eq("student_id", user?.id)
        .eq("course_id", courseId)
        .maybeSingle()   // ← زي single بس بترجع null بدل error لو مفيش نتيجة

      setIsEnrolled(!!data)
    }
    if (user) checkEnrollment()
  }, [user, courseId])




  return (
    <div className='flex flex-col gap-3'>
      {course && (

        <div className='flex flex-col md:flex-row-reverse p-5 md:p-8 bg-primary md:items-start justify-between gap-4 mb-5 rounded-b-4xl'>

          {course.image_url && (
            <img src={course.image_url} alt={course.title} className='w-auto h-70 object-cover rounded-3xl border-8 border-white' />
          )}
          <div className="flex flex-col gap-3">
            <div className="flex">
              <Link href={"/my-courses"} className='flex text-white items-center gap-2 mb-5 hover:gap-3 cursor-pointer transition-all'>
                <ArrowLeft />
                <span>Go Back</span>
              </Link>

            </div>
            <h1 className='text-3xl font-bold text-white'>{course.title}</h1>
            <h1 className='text-xl font-semibold text-zinc-300'>{course.description}</h1>
          </div>
        </div>
      )}

      <span className='flex items-start mx-10'>
        {
          (role === "admin" || course?.instructor_id === user?.id) && <Link href={"lessons/new"} className='flex items-center justify-center gap-3 cursor-pointer bg-primary text-white rounded-xl p-2.5 transition-all hover:-translate-y-0.5'><Plus /> Add New Lesson</Link>
        }
      </span>


      <div className='flex md:flex-row flex-col-reverse gap-6  px-5 md:px-8 mb-15'>

        <div className='flex-1 grow-5'>
          {selectedLesson?.video_url ? (
            <video controls className="w-full rounded-2xl" key={selectedLesson.id}>
              <source src={selectedLesson.video_url} type="video/mp4" />
            </video>
          ) : (
            <div className="w-full h-64 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400">
              There's No Video
            </div>
          )}
          <h2 className="text-xl font-bold mt-4">{selectedLesson?.title}</h2>
        </div>


        <div className='w-64 flex flex-col grow gap-2'>
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className={`text-left p-3 rounded-xl  ${selectedLesson?.id === lesson.id ? 'bg-primary text-white' : 'bg-zinc-50 cursor-pointer '}`}
            >
              {lesson.order}. {lesson.title}
            </button>
          ))}
        </div>
      </div>



    </div>
  )
}

export default page