import axios from "axios";

export const dynamic = "force-dynamic";

const username = process.env.USERNAMEOMG;
const password = process.env.PASSWORDOMG;

const apiUrl = "https://stacks.targetr.net/rest-api/v1/screens?filter=screenId==\"06BC2025145F\" || screenId==\"06BC202513BA\"|| screenId==\"06BC20251312\"|| screenId==\"06BC2025145A\"|| screenId==\"06BC202514D4\"|| screenId==\"788A869F72CB\"";

const ONE_HOUR_IN_MS = 1 * 60 * 60 * 1000;
const ONE_DAYS_IN_MS = 24 * 60 * 60 * 1000;

function getStatus(lastLoaderMillis, now) {
  if (!lastLoaderMillis) return "No last loader data";
  if (now - lastLoaderMillis <= ONE_HOUR_IN_MS) return "Box-Online";
  if (now - lastLoaderMillis <= ONE_DAYS_IN_MS) return "Box-Offline (1+ hour)";
  return "Box-Offline (1+ day)";
}

export async function GET() {
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

    return new Response(JSON.stringify(simplifiedData), {
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