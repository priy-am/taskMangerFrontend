'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from './Header';

const HeaderWrapper = () => {
  const pathname = usePathname();
  const hideHeader = pathname.startsWith("/auth");
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user); // assuming backend returns { user: {...} }
        } else {
          localStorage.removeItem("token"); // invalid token
          router.push("/auth/login");
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
  };

  if (hideHeader || isLoading) return null;

  return (
    <div className="h-16">
      <Header 
        isAuthenticated={!!user} 
        user={user} 
        onLogout={handleLogout} 
      />
    </div>
  );
};

export default HeaderWrapper;
