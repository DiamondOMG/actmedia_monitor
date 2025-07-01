"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navigate() {
  const router = useRouter();

  useEffect(() => {
    window.DigitalSignageTriggerCallback = (data) => {
      router.push(`/${data}`);
    };
  }, [router]);
  return null;
}