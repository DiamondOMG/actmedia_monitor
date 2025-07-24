import axios from "axios";

export const dynamic = "force-dynamic";

const username = process.env.USERNAMEOMG;
const password = process.env.PASSWORDOMG;
const apiUrl =
  "https://stacks.targetr.net/rest-api/v1/screens?groupId=0303FAE3C37A9E";

const THAI_TIME_OFFSET = 7 * 60 * 60 * 1000; // UTC+7 hours in milliseconds
const ONE_HOUR_IN_MS = 1 * 60 * 60 * 1000; // 1+ hour in milliseconds
const ONE_DAYS_IN_MS = 24 * 60 * 60 * 1000; // 1+ days in milliseconds
const CACHE_DURATION = 5 * 60 * 1000; // 5 นาที

let cache = { data: null, timestamp: 0 };

function formatTimestamp(timestamp) {
  const date = new Date(Number(timestamp) + THAI_TIME_OFFSET);
  return date.toISOString().replace("T", " ").substring(0, 19); // Convert to 'YYYY-MM-DD HH:mm:ss'
}

export async function GET() {
  const currentTime = Date.now(); // Get current time in milliseconds

  if (cache.data && currentTime - cache.timestamp < CACHE_DURATION) {
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
          "Cache-Control":"no-store", 
      },
    };

    const response = await axios.get(apiUrl, options);

    const rawData = response.data;

  //!--------------------normalize data-------------------------------
    const normalizeData = rawData.map((obj) => {
      const lastOnline = obj.data.lastLoaderCommsMillis
        ? formatTimestamp(obj.data.lastLoaderCommsMillis)
        : "-";
      const lastLoaderMillis = Number(obj.data.lastLoaderCommsMillis) || 0;
      const status =
        currentTime - lastLoaderMillis <= ONE_HOUR_IN_MS
          ? "online"
          : currentTime - lastLoaderMillis <= ONE_DAYS_IN_MS
          ? "offline (1+ hour)"
          : "offline (1+ day)";
      return {
        screenId: obj.data.screenId || "-", // Replace missing field with '-'
        displayAspectRatio: obj.data.displayAspectRatio || "-", // Replace missing field with '-'
        storeCode: obj.data.storeCode || "-", // Replace missing field with '-'
        storeSection: obj.data.storeSection || "-", // Replace missing field with '-'
        displaysConnected: parseInt(obj.data.displaysConnected) || 0, // Convert to integer, default to 0 if invalid
        lastOnline, // Renamed field
        status, // Added status field
      };
    });

    //!--------------------summary data-------------------------------

    const summary = (normalizeData) => {
      const result = [
        {
          Kiosk: 0,
          Online: 0,
          "Offline (1+ hour)": 0,
          "Offline (1+ day)": 0,
          Displays: 0,
          "Displays-Online": 0,
          "Displays-Offline (1+ hour)": 0,
          "Displays-Offline (1+ day)": 0,
          Store: 0,
          storeCodes: new Set(), // Ensure this is always initialized
        },
      ];

      normalizeData.forEach((obj) => {
        // Only process for Kiosk
        if (obj.displayAspectRatio === "1080x1920") {
          result[0].Kiosk += 1;
          result[0].Displays += obj.displaysConnected;
          result[0].storeCodes.add(obj.storeCode); // Add unique storeCode
          if (obj.status === "online") {
            result[0].Online += 1;
            result[0]["Displays-Online"] += obj.displaysConnected; // Count online displays
          } else if (obj.status === "offline (1+ hour)") {
            result[0]["Offline (1+ hour)"] += 1;
            result[0]["Displays-Offline (1+ hour)"] += obj.displaysConnected; // Count offline displays (1+ hour)
          } else if (obj.status === "offline (1+ day)") {
            result[0]["Offline (1+ day)"] += 1;
            result[0]["Displays-Offline (1+ day)"] += obj.displaysConnected; // Count offline displays (1+ day)
          }
        }
      });

      // Add Store count by the size of the storeCodes set
      result[0].Store = result[0].storeCodes.size;

      return result;
    };

    const result = summary(normalizeData);

    cache = { data: result , timestamp: currentTime };

    // Return the filtered result (only Kiosk data)
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",

      },
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",

      },
    });
  }
}