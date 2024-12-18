import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  try {
    const filePath = "./config.json";
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error leyendo el archivo JSON",
      },
      {
        status: 500,
      }
    );
  }
}
