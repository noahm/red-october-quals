import { JSDOM } from "jsdom";
import { kv } from "@vercel/kv";

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

export async function cachedScoresForSong(songId: number, mode: Mode) {
  const key = cacheKey(songId, mode);
  // const cache = await kv.get<Score[]>(key);
  // if (cache) return cache;
  const results = await getScoresForSong(songId, mode);
  kv.set(key, results, { ex: EXPIRE_SECONDS });
  return results;
}

async function getScoresForSong(songId: number, mode: Mode) {
  const url = `https://statmaniax.com/song/${songId}/${mode}`;
  const dom = await JSDOM.fromURL(url);
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
