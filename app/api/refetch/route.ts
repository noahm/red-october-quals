import { songs } from "@/data/songs";
import { refreshCacheForSong } from "@/data/statmaniax";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const randomSong = songs[Math.floor(Math.random() * songs.length)];
  await refreshCacheForSong(randomSong);
  return new NextResponse(undefined, { status: 204 });
}
