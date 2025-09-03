"use client";

import { useEffect, useState } from "react";

const URL =
  "https://script.google.com/macros/s/AKfycbzepwpESHIzuyG_5oKOFFsio9BmfN88Wa57EYHGy6RMEl3HYKZd8J8gO60Mu87NosdU5Q/exec";

export default function Page() {
  const [text, setText] = useState("loading...");

  useEffect(() => {
    fetch(URL, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setText(JSON.stringify(data, null, 2))) // พิมพ์ทั้งหมด
      .catch((e) => setText("error: " + e.message));
  }, []);

  return <pre style={{ whiteSpace: "pre-wrap", margin: 12 }}>{text}</pre>;
}
