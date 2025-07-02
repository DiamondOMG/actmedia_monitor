import fs from "fs";
import path from "path";

export default function Home() {
  // อ่านโฟลเดอร์ใน src/app (ยกเว้น api, page.js, layout.js, globals.css ฯลฯ)
  const appDir = path.join(process.cwd(), "src/app");
  const routes = fs
    .readdirSync(appDir, { withFileTypes: true })
    .filter(
      (dirent) =>
        dirent.isDirectory() &&
        !dirent.name.startsWith("_") &&
        !["api"].includes(dirent.name)
    )
    .map((dirent) => dirent.name);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Overview</h1>
      <ul className="space-y-4">
        {routes.map((route) => (
          <li key={route}>
            <a
              href={`/${route}`}
              className="text-xl underline text-blue-400 hover:text-blue-200"
            >
              /{route}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
