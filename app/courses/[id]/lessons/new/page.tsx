"use client";

import { ArrowLeft, BookOpen, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";



export default function AddLessonPage() {


  const params = useParams()
  const courseId = params.id as string
  const router = useRouter()

  const [name, setName] = useState("")
  const [order, setOrder] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)


  const handleUploadVideo = async (): Promise<string | null> => {
    if (!videoFile) return null;

    const fileName = `${Date.now()}-${videoFile.name}`

    const { error } = await supabase.storage.from("lessons-videos").upload(fileName,videoFile)

    if(error) {
      alert("errr")
      console.log(error)
      return null;
    }

    const { data: urlData } = supabase.storage.from("lessons-videos").getPublicUrl(fileName)

    return urlData.publicUrl
  }



  const handleAdd = async (e: React.FormEvent) => {

    e.preventDefault()

    if (!name || !order) {
      alert("Please Full The Inputs !")
      return;
    }

    const videoUrl = await handleUploadVideo()

    setSubmitting(true)

    const { error } = await supabase.from("lessons").insert({
      title: name,
      order: Number(order),
      video_url: videoUrl,
      course_id: courseId
    })

    setSubmitting(false)

    if (error) {
      console.log(error)
      alert("err")
      return;
    }



    router.push(`/courses/${courseId}/lessons`)
  }

  useEffect(() => {
    return () => {
      if(videoPreview) URL.revokeObjectURL(videoPreview)
    }
  },[videoPreview])




  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">


        <Link
          href={`/courses/${courseId}/lessons`}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
          Back to lessons
        </Link>


        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50">

          <form onSubmit={handleAdd} className="flex flex-col justify-between min-h-64">

            <div className="flex flex-col space-y-6">
              <h1 className="text-center text-3xl font-bold mb-10">Add a New Lesson</h1>

              <input
                required
                className="border border-primary grow p-3 rounded-2xl outline-0 shadow-primary shadow-2xs"
                placeholder="Lesson Title"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="number"
                required
                className="border border-primary grow p-3 rounded-2xl outline-0 shadow-primary shadow-2xs"
                placeholder="Lesson Number"
                onChange={(e) => setOrder(e.target.value)}
              />

              {
                videoPreview && <video controls>
                  <source src={videoPreview} type="video/mp4"/>
                </video>
              }

              <input
                accept="video/*"
                type="file"
                required
                className="border border-primary grow p-3 rounded-2xl outline-0 shadow-primary shadow-2xs"
                placeholder="Choose Video"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setVideoFile(file)

                  if(file) {
                    const previewUrl = URL.createObjectURL(file)
                    setVideoPreview(previewUrl)
                  }
                  else{
                    setVideoPreview(null)
                  }
                }}
              />
            </div>

            <button disabled={submitting} type="submit" className={`bg-primary text-white rounded-2xl p-3 cursor-pointer mt-15 ${submitting && "opacity-35"}`}>
              {
                submitting ? "Adding..." : "Add Lesson"
              }
            </button>


          </form>
        </div>
      </div>
    </main>
  );
}