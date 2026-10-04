"use client"

import Image from "next/image";
import { useContext, useEffect } from "react";
import { useUser } from "./contexts/UserContext";
import { redirect, useRouter } from "next/navigation";

export default function Home() {


  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if(!user){
      router.push("/login")
    }
    else {
      redirect("/courses")
    }
  },[user])


  return (
    <>

    </>
  );
}
