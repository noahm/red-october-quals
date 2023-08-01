import { JSDOM } from "jsdom";
import { cache } from "react";
import { kv } from "@vercel/kv";
import { filterPlayers } from "./players";

const EXPIRE_SECONDS = 3600;

export enum Mode {
  Beginner,
  Easy,
  Hard,
  Wild,
  Dual,
  Full,
  Team,
}

interface Score {
  name: string;
  score: number;
  timestamp: string;
}

function cacheKey(songId: number, mode: Mode) {
  return `song:${songId};mode:${mode}`;
}

export const filteredScoresForSong = cache(async (songId: number, mode: Mode) =>
  filterPlayers(await cachedScoresForSong(songId, mode)),
);

export const revalidate = EXPIRE_SECONDS;

async function cachedScoresForSong(songId: number, mode: Mode) {
  const key = cacheKey(songId, mode);
  const cache = await kv.get<Score[]>(key);
  if (cache) return cache;
  const results = await getScoresForSong(songId, mode);
  kv.set(key, results, { ex: EXPIRE_SECONDS });
  return results;
}

async function getScoresForSong(songId: number, mode: Mode) {
  const url = `https://statmaniax.com/song/${songId}/${mode}`;
  const resp = await fetch(url, { cache: "no-cache" });
  const dom = new JSDOM(await resp.arrayBuffer());
  const scoreRows = dom.window.document.querySelectorAll("#hiscores tbody tr");
  const ret: Array<Score> = [];
  for (const row of scoreRows) {
    const cells = row.querySelectorAll("td");
    const name = cells[0].textContent!.trim();
    const score = parseInt(cells[1].textContent!.trim(), 10);
    const timestamp = cells[3].textContent!;
    ret.push({ name, score, timestamp });
  }
  return ret;
}
