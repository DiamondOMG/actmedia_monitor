"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navigate() {
  const router = useRouter();
  const pathname = usePathname();

  // กำหนด path ทั้งหมดที่ต้องการให้วน
  const paths = ["/deer_tummy", "/bigc", "/tops", "/", "deer_tummy_map_1","deer_tummy_map_2","tops_digital"];

  useEffect(() => {
    window.DigitalSignageTriggerCallback = (data) => {
      if (!data) return;
      const [cmd, dir] = data.split("_");

      // เช็คกรณี cmd เป็น monitor
      if (cmd === "monitor") {
        switch (dir) {
          case "deertummy":
            router.push("/deer_tummy");
            return;
          case "bigc":
            router.push("/bigc");
            return;
          case "tops":
            router.push("/tops");
            return;
          case "deermap1":
            router.push("/deer_tummy_map_1");
            return;
          case "deermap2":
            router.push("/deer_tummy_map_2");
            return;
          case "topsdigital":
            router.push("/tops_digital");
            return;
        }
      }

      // กรณี hand gesture (โค้ดเดิม)
      if (cmd === "hand" && (dir === "right" || dir === "left")) {
        const currentIdx = paths.indexOf(pathname);
        if (currentIdx === -1) return;
        let nextIdx = currentIdx;
        if (dir === "right") {
          nextIdx = (currentIdx + 1) % paths.length;
        } else if (dir === "left") {
          nextIdx = (currentIdx - 1 + paths.length) % paths.length;
        }
        router.push(paths[nextIdx]);
      }
    };
  }, [pathname, router, paths]);

  return null;
}