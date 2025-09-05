"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // ✅ User already logged in → go to tasks page
      router.push("/tasks");
    } else {
      // ❌ No token → go to login page
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div class="flex items-center justify-center h-screen">
      <div class="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
}
