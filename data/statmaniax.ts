import { JSDOM } from "jsdom";
import { kv } from "@vercel/kv";

const EXPIRE_SECONDS = 60 * 60 * 36;

export type Mode = "beginner" | "easy" | "hard" | "wild" | "dual" | "full";

export function idForMode(m: Mode) {
  switch (m) {
    case "beginner":
      return 0;
    case "easy":
      return 1;
    case "hard":
      return 2;
    case "wild":
      return 3;
    case "dual":
      return 4;
    case "full":
      return 5;
  }
}

export interface Score {
  name: string;
  score: number;
  timestamp: string;
}

export interface SongMode {
  id: number;
  mode: Mode;
}

function cacheKey({ id, mode }: SongMode) {
  return `song:${id};mode:${mode}`;
}

function filterPlayers<T extends { name: string }>(
  list: Iterable<T>,
  players: Set<string>,
) {
  return Array.from(list).filter((item) =>
    players.has(item.name.toUpperCase()),
  );
}

export const filteredScoresForSong = async (
  players: Set<string>,
  sim: SongMode,
) => filterPlayers(await cachedScoresForSong(sim), players);

export async function refreshCacheForSong(sim: SongMode) {
  const results = await getScoresForSong(sim);
  kv.set(cacheKey(sim), results, { ex: EXPIRE_SECONDS });
  return results;
}

async function cachedScoresForSong(sim: SongMode) {
  const key = cacheKey(sim);
  const cache = await kv.get<Score[]>(key);
  if (cache) return cache;
  return refreshCacheForSong(sim);
}

async function getScoresForSong({ id, mode }: SongMode) {
  const url = `https://statmaniax.com/song/${id}/${idForMode(mode)}`;
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
