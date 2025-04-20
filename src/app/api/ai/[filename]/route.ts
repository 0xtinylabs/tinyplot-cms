import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { connect, getFile, isExist, saveFile } from "@/db/db";

connect();

export async function GET(request: NextRequest, context: any) {
  try {
    const { filename } = await context.params;
    let content;

    const filePath = path.join(process.cwd(), "src", "files", "ai", filename);
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

export async function PUT(request: NextRequest, context: any) {
  try {
    const { content } = await request.json();
    const { filename } = await context.params;

    await saveFile(filename, content);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing file:", error);
    return NextResponse.json(
      { error: "Failed to write file" },
      { status: 500 }
    );
  }
}
