import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const baseDir = path.join(process.cwd(), "src", "files");

    // Read AI files
    const aiFiles = await fs.readdir(path.join(baseDir, "ai"));

    // Read i18n directories and files
    const i18nDir = path.join(baseDir, "i18n");
    const i18nLangs = await fs.readdir(i18nDir);

    const i18nFiles: any[] = [];
    for (const lang of i18nLangs) {
      const langPath = path.join(i18nDir, lang);
      const stat = await fs.stat(langPath);

      if (stat.isDirectory()) {
        const files = await fs.readdir(langPath);
        files.forEach((file) => {
          i18nFiles.push({
            language: lang,
            filename: file,
          });
        });
      }
    }

    return NextResponse.json({
      ai: aiFiles,
      i18n: i18nFiles,
    });
  } catch (error) {
    console.error("Error listing files:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}
