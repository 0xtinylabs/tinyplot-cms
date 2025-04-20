import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getFile, isExist, saveFile } from "@/db/db";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const p = await params;

    let content;

    const filePath = path.join(
      process.cwd(),
      "src",
      "files",
      "i18n",
      p.language,
      p.filename
    );
    const filename = "i18n_" + p.language + "_" + p.filename;
    const isFileExist = await isExist(filename);
    if (!isFileExist) {
      content = await fs.readFile(filePath, "utf-8");
    } else {
      content = await getFile(filename);
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error reading file:", error);
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: any) {
  try {
    const p = await params;

    const { content, reset } = await request.json();

    if (reset) {
      const filePath = path.join(
        process.cwd(),
        "src",
        "files",
        "i18n",
        p.language,
        p.filename
      );
      const content = await fs.readFile(filePath, "utf-8");
      await saveFile("i18n_" + p.language + "_" + p.filename, content);
      return NextResponse.json({ success: true, content: content });
    }

    await saveFile("i18n_" + p.language + "_" + p.filename, content);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing file:", error);
    return NextResponse.json(
      { error: "Failed to write file" },
      { status: 500 }
    );
  }
}
