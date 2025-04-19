import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest, context: any) {
  try {
    const { filename } = await context.params;
    const filePath = path.join(process.cwd(), "src", "files", "ai", filename);
    const content = await fs.readFile(filePath, "utf-8");

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
    const filePath = path.join(process.cwd(), "src", "files", "ai", filename);

    await fs.writeFile(filePath, content);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing file:", error);
    return NextResponse.json(
      { error: "Failed to write file" },
      { status: 500 }
    );
  }
}
