import { songs } from "@/data/event-data";
import { refreshCacheForSong } from "@/data/statmaniax";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

const lastIndexKey = "special:api/refetch;last-index";

export async function GET(req: NextRequest) {
  const queryIndex = req.nextUrl.searchParams.get("index");
  let refetchIndex: number;
  if (queryIndex) {
    refetchIndex = parseInt(queryIndex, 10) % songs.length;
  } else {
    const lastIndex = await kv.get<number>(lastIndexKey);
    refetchIndex = lastIndex === null ? 0 : (lastIndex + 1) % songs.length;
  }
  const songToRefetch = songs[refetchIndex];
  await refreshCacheForSong(songToRefetch.song);
  await kv.set(lastIndexKey, refetchIndex);
  return NextResponse.json(
    {
      status: "ok",
      index: refetchIndex,
      song: songToRefetch.title,
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    },
  );
}
