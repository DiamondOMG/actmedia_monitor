"use server";

import axios from "axios";

const username = process.env.USERNAMEOMG;
const password = process.env.PASSWORDOMG;

const apiUrl =
  'https://stacks.targetr.net/rest-api/v1/screens?filter=screenId=="020035EB40C7" || screenId=="020037E82DD9"|| screenId=="02006DCF252D"|| screenId=="02008CE90EE1"|| screenId=="0200A178D582"|| screenId=="0200C0FFD975"|| screenId=="0200C8DF1833"|| screenId=="0200DC921FEE"|| screenId=="0200E3318561"|| screenId=="0200F03AC791"';

const ONE_HOUR_IN_MS = 1 * 60 * 60 * 1000;
const ONE_DAYS_IN_MS = 24 * 60 * 60 * 1000;

function getStatus(lastLoaderMillis, now) {
  if (!lastLoaderMillis) return "No last loader data";
  if (now - lastLoaderMillis <= ONE_HOUR_IN_MS) return "Box-Online";
  if (now - lastLoaderMillis <= ONE_DAYS_IN_MS) return "Box-Offline (1+ hour)";
  return "Box-Offline (1+ day)";
}

export async function fetchData() {
  const now = Date.now();

  try {
    const options = {
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
        "Cache-Control": "no-store",
      },
    };

    const res = await axios.get(apiUrl, options);
    const data = res.data;

    // Map ข้อมูลให้เหลือเฉพาะ id และ status
    const simplifiedData = data.map((item) => ({
      id: item.id || item.screenId,
      status: getStatus(item.data.lastLoaderCommsMillis, now),
    }));

    return simplifiedData; // ✅ return data ตรง ๆ
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error("Failed to fetch data"); // ✅ ให้ client จัดการ error
  }
}
