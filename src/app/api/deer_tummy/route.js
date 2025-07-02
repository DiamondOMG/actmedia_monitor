import axios from "axios";

export const dynamic = "force-dynamic";

const username = process.env.USERNAMEOMG;
const password = process.env.PASSWORDOMG;

const apiUrls = [
  {
    key: "TV Endgon",
    url: "https://stacks.targetr.net/rest-api/v1/screens?groupId=13D831BAD30E24",
  },
  {
    key: "KioskPowerBank",
    url: "https://stacks.targetr.net/rest-api/v1/screens?groupId=13400F370B2107",
  },
  {
    key: "Pillar",
    url: "https://stacks.targetr.net/rest-api/v1/screens?groupId=13B0683538D22E",
  },
  {
    key: "Kiosk",
    url: "https://stacks.targetr.net/rest-api/v1/screens?groupId=13071E00BB94A0",
  },
  {
    key: "TV Walkway",
    url: "https://stacks.targetr.net/rest-api/v1/screens?groupId=132556D3FA84CD",
  },
  {
    key: "Video Wall",
    url: "https://stacks.targetr.net/rest-api/v1/screens?groupId=13CD63587039FF",
  },
  {
    key: "Total",
    url: "https://stacks.targetr.net/rest-api/v1/screens?groupId=13D254249541D4",
  },
];

const ONE_HOUR_IN_MS = 1 * 60 * 60 * 1000;
const ONE_DAYS_IN_MS = 24 * 60 * 60 * 1000;
const CACHE_DURATION = 5 * 60 * 1000;

let cache = { data: null, timestamp: 0 };

function getStatus(lastLoaderMillis, now) {
  if (!lastLoaderMillis) return "Box-Offline (1+ day)";
  if (now - lastLoaderMillis <= ONE_HOUR_IN_MS) return "Box-Online";
  if (now - lastLoaderMillis <= ONE_DAYS_IN_MS) return "Box-Offline (1+ hour)";
  return "Box-Offline (1+ day)";
}

export async function GET() {
  const now = Date.now();

  if (cache.data && now - cache.timestamp < CACHE_DURATION) {
    return new Response(JSON.stringify(cache.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const options = {
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
        "Cache-Control": "no-store",
      },
    };

    const results = await Promise.all(
      apiUrls.map(async ({ key, url }) => {
        const res = await axios.get(url, options);
        const data = res.data;

        // เตรียม obj ตาม mock
        let obj = {
          Name: key,
          Box: 0,
          "Box-Online": 0,
          "Box-Offline (1+ hour)": 0,
          "Box-Offline (1+ day)": 0,
          Displays: 0,
          "Displays-Online": 0,
          "Displays-Offline (1+ hour)": 0,
          "Displays-Offline (1+ day)": 0,
        };

        // นับจำนวน box และ displays ตามสถานะ
        data.forEach((item) => {
          const lastLoaderMillis = Number(item.data.lastLoaderCommsMillis) || 0;
          const status = getStatus(lastLoaderMillis, now);
          const displaysConnected = parseInt(item.data.displaysConnected) || 0;

          obj.Box += 1;
          obj.Displays += displaysConnected;

          if (status === "Box-Online") {
            obj["Box-Online"] += 1;
            obj["Displays-Online"] += displaysConnected;
          } else if (status === "Box-Offline (1+ hour)") {
            obj["Box-Offline (1+ hour)"] += 1;
            obj["Displays-Offline (1+ hour)"] += displaysConnected;
          } else if (status === "Box-Offline (1+ day)") {
            obj["Box-Offline (1+ day)"] += 1;
            obj["Displays-Offline (1+ day)"] += displaysConnected;
          }
        });

        return obj;
      })
    );

    cache = { data: results, timestamp: now };

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
