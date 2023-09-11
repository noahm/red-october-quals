import { JSDOM } from "jsdom";
import { kv } from "@vercel/kv";
import { mapIter, filterIter, mergeIter } from "../app/utils";

const EXPIRE_SECONDS = 60 * 60 * 36;

export type Mode = "beginner" | "easy" | "hard" | "wild" | "dual" | "full";

export interface PrivateScore {
  songId: number;
  mode: Mode;
  score: number;
}

export type PlayersForMode = Map<string, PrivateScore[] | undefined>;

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
  timestamp: string | null;
}

export interface SongMode {
  id: number;
  mode: Mode;
}

export type CacheContext = Record<string, Score[] | Promise<Score[]>>;

export function getCacheContext(): CacheContext {
  return {};
}

function cacheKey({ id, mode }: SongMode) {
  return `song:${id};mode:${mode}`;
}

function filterPlayers<T extends { name: string }>(
  list: Iterable<T>,
  players: PlayersForMode,
) {
  return Array.from(list).filter((item) =>
    players.has(item.name.toUpperCase()),
  );
}

export const filteredScoresForSong = async (
  cacheContext: CacheContext,
  players: PlayersForMode,
  sim: SongMode,
) => {
  const isApplicableScore = (s: PrivateScore) =>
    s.songId === sim.id && s.mode === sim.mode;
  const scores = filterPlayers(
    await cachedScoresForSong(sim, cacheContext || {}),
    players,
  );
  const playersToInsert = filterIter(
    ([, scores]) => !!scores && scores.some(isApplicableScore),
    players,
  );
  const scoresToInsert = mapIter(([name, scores]): Score => {
    const { score } = scores!.find(isApplicableScore)!;
    return {
      name,
      score,
      timestamp: null,
    };
  }, playersToInsert);

  return Array.from(
    mergeIter(
      (a, b) => {
        return a.score - b.score;
      },
      scores,
      scoresToInsert,
    ),
  );
};

async function cachedScoresForSong(
  sim: SongMode,
  cacheContext: CacheContext,
): Promise<Score[]> {
  const key = cacheKey(sim);
  if (cacheContext[key]) return cacheContext[key];
  const cachedValuePromise = kv.get<Score[]>(key).then((result) => {
    if (!result) {
      return refreshCacheForSong(sim, cacheContext);
    }
    return result;
  });
  return (cacheContext[key] = cachedValuePromise);
}

export async function refreshCacheForSong(
  sim: SongMode,
  cacheContext?: CacheContext,
): Promise<Score[]> {
  const resultPromise = getScoresForSong(sim);
  const key = cacheKey(sim);
  if (cacheContext) {
    cacheContext[key] = resultPromise;
  }
  const results = await resultPromise;
  await kv.set(key, results, { ex: EXPIRE_SECONDS });
  return results;
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
