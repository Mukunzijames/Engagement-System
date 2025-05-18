import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Socket.io handles its own connections through the server
  return new NextResponse("Socket.io is handled through server middleware");
}

export async function POST(request: Request) {
  // Socket.io handles its own connections through the server
  return new NextResponse("Socket.io is handled through server middleware");
} 