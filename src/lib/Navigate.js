"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getRoutes } from "@/lib/getRoutes";

export default function Navigate() {
  const router = useRouter();
  const pathname = usePathname();
  const [paths, setPaths] = useState([]);

  // โหลด paths จาก localStorage หรือ Server Action
  useEffect(() => {
    async function loadPaths() {
      const CACHE_KEY = "appRoutes";
      const cachedPaths = localStorage.getItem(CACHE_KEY);
      if (cachedPaths) {
        setPaths(JSON.parse(cachedPaths));
        return;
      }

      try {
        const routes = await getRoutes();
        setPaths(routes);
        localStorage.setItem(CACHE_KEY, JSON.stringify(routes));
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    }
    loadPaths();
  }, []);

  useEffect(() => {
    window.DigitalSignageTriggerCallback = (data) => {
      if (!data) return;
      const [cmd, target] = data.split("_", 2); // Split แค่ 2 ส่วน

      // กรณี monitor
      if (cmd === "monitor" && target) {
        const targetPath = `/${target}`; // เพิ่ม / นำหน้า
        router.push(targetPath); // ใช้ target โดยตรง
        return;
      }

      // กรณี hand gesture
      if (cmd === "hand" && (target === "right" || target === "left")) {
        const currentIdx = paths.indexOf(pathname);
        if (currentIdx === -1) return;
        let nextIdx = currentIdx;
        if (target === "right") {
          nextIdx = (currentIdx + 1) % paths.length;
        } else if (target === "left") {
          nextIdx = (currentIdx - 1 + paths.length) % paths.length;
        }
        router.push(paths[nextIdx]);
      }
    };
  }, [pathname, router, paths]);

  return null;
}