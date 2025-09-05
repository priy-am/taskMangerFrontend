"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState } = useForm();
  const { errors } = formState || {};
  const router = useRouter();
  const [show, setShow] = useState(false);

  const onSubmit = async (form) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        router.push("/tasks");
      }
      if (!res.ok) {
        return toast.error(data.message || `Failed to register`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7ff] p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-[#05264e]">
            Create an Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* FULL NAME (Register only) */}

            {/* <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    {...register("name", {
                      required: "Full name is required",
                      validate: (value) =>{
                        const trimmed = value.trim();
                        if( trimmed.length < 3){
                          return"Full name must be at least 3 characters";
                        }
                        return true;
                      }
                    })}
                    placeholder="Your full name"
                  />
                  {errors?.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div> */}

            {/* EMAIL */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Invalid email format",
                  },
                })}
                type="email"
                placeholder="example@mail.com"
              />
              {errors?.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label>Password</Label>

              <div className="relative">
                <Input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    validate: (value) => {
                      const trimmed = value.trim();
                      if (trimmed.length < 6) {
                        return "Password must be at least 6 characters";
                      }
                      if (!/[A-Z]/.test(trimmed)) {
                        return "Password must contain at least one uppercase letter";
                      }
                      if (!/[a-z]/.test(trimmed)) {
                        return "Password must contain at least one lowercase letter";
                      }
                      if (!/[0-9]/.test(trimmed)) {
                        return "Password must contain at least one number";
                      }
                      if (!/[!@#$%^&*(),.?":{}|<>]/.test(trimmed)) {
                        return "Password must contain at least one special character";
                      }
                      return true;
                    },
                  })}
                  type={!show ? "password" : "text"}
                  placeholder={!show ? "********" : "password"}
                />
                <span
                  className="absolute right-5 top-1"
                  onClick={() => {
                    setShow(!show);
                  }}
                >
                  {" "}
                  {!show ? <IoEye size={"25px"} /> : <IoEyeOff size={"25px"} />}
                </span>
              </div>

              {errors?.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              className="w-full bg-[#3c65f5] hover:bg-[#274fcc] text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Loading...
                </span>
              ) : (
                "Login"
              )}
            </Button>

            {/* TOGGLE LINK */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?
              <span
                className="text-[#3c65f5] hover:underline cursor-pointer"
                onClick={() => {
                  router.push(`/auth/signup`);
                }}
              >
                Register
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
