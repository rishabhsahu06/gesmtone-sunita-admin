"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">
          <Skeleton height={40} />
          <Skeleton height={120} />
          <Skeleton height={40} count={3} />
        </div>
      </div>
    );
  }

  if (!session) return null;

  return children;
}
