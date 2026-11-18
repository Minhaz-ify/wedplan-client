"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader } from "@/components/Ui";

export default function DashboardIndex() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  useEffect(() => {
    if (!isPending && data?.user) router.replace(`/dashboard/${data.user.role || "customer"}`);
  }, [isPending, data, router]);
  return <Loader />;
}
