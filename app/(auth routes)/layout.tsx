"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthRoutesLayoutProps {
  children: React.ReactNode;
}

export default function AuthRoutesLayout({ children }: AuthRoutesLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    router.refresh();

    startTransition(() => {
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
}
