import { songs } from "@/data/event-data";
import { refreshCacheForSong } from "@/data/statmaniax";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

const lastIndexKey = "special:api/refetch;last-index";

export async function GET(_: Request) {
  const lastIndex = await kv.get<number>(lastIndexKey);
  const refetchIndex = lastIndex === null ? 0 : (lastIndex + 1) % songs.length;
  const randomSong = songs[refetchIndex];
  await refreshCacheForSong(randomSong.song);
  await kv.set(lastIndexKey, refetchIndex);
  return NextResponse.json(
    {
      status: "ok",
      index: refetchIndex,
      song: randomSong.title,
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
