"use server";
import { readdirSync } from "fs";
import { join } from "path";

export async function getRoutes() {
  const appDir = join(process.cwd(), "src/app");
  return readdirSync(appDir, { withFileTypes: true })
    .filter(
      (dirent) =>
        dirent.isDirectory() &&
        !dirent.name.startsWith("_") &&
        !["api"].includes(dirent.name)
    )
    .map((dirent) => `/${dirent.name}`);
}