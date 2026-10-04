"use client";

import { ArrowLeft, BookOpen, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/app/contexts/UserContext";



export default function AddLessonPage() {


  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { user } = useUser()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)



  const handleUploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const fileName = `${Date.now()}-${imageFile.name}`

    const { error } = await supabase.storage.from("courses-thumianals").upload(fileName, imageFile)

    if (error) {
      console.log(error)
      alert("err")
      return null;
    }

    const { data: urlPublic } = supabase.storage.from("courses-thumianals").getPublicUrl(fileName)

    return urlPublic.publicUrl;
  }


  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()

    setSubmitting(true)

    const imageUrl = await handleUploadImage()

    const { error } = await supabase.from("courses").insert({
      title: name,
      description: description,
      price: Number(price),
      instructor_id: user?.id,
      image_url: imageUrl
    })

    setSubmitting(false)

    if (error) {
      console.log(error)
      alert("err")
      return;
    }

    router.push("/courses")

  }

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])











  return (
    <main className="min-h-screen w-full bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">


        <Link
          href={`/courses/`}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
          Back to Courses
        </Link>


        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50">

          <form onSubmit={handleAdd} className="flex flex-col gap-6">
            <h1 className="text-center text-3xl font-bold mb-4">Add a New Course</h1>

            <input
              required
              className="border border-primary grow p-3 rounded-2xl outline-0 shadow-primary shadow-2xs"
              placeholder="Course name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              required
              className="border border-primary grow p-3 rounded-2xl outline-0 shadow-primary shadow-2xs"
              placeholder="Course Price"
              onChange={(e) => setPrice(e.target.value)}
            />
            <textarea
              required
              className="border border-primary grow p-3 rounded-2xl outline-0 shadow-primary shadow-2xs"
              placeholder="Course description"
              onChange={(e) => setDescription(e.target.value)}
            />

            {imagePreview && (
              <img src={imagePreview} className="w-full h-48 object-cover rounded-2xl border border-primary" />
            )}

            <input
              required
              accept="image/*"
              type="file"
              className="border border-primary grow p-3 rounded-2xl outline-0 shadow-primary shadow-2xs"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setImageFile(file)
                if (file) {
                  const previewImage = URL.createObjectURL(file)
                  setImagePreview(previewImage)
                } else {
                  setImagePreview(null)
                }
              }}
            />

            <button
              disabled={submitting}
              type="submit"
              className={`bg-primary text-white rounded-2xl p-3 cursor-pointer ${submitting && "opacity-35"}`}
            >
              {submitting ? "Adding..." : "Add Course"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}