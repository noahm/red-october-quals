import styles from "./page.module.css";
import {
  type SongMode,
  filteredScoresForSong,
  getCacheContext,
  CacheContext,
  PlayersForMode,
} from "@/data/statmaniax";
import { Fragment, Suspense } from "react";
import { TableRow, HighlightContextProvider } from "./highlights";
import { groups } from "@/data/event-data";
import { PreviewForm } from "./preview";

export default function Home({
  searchParams,
}: {
  searchParams: { preview?: string };
}) {
  const preview = searchParams.preview?.toUpperCase();
  const cacheContext = getCacheContext();
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Red October Qualifiers</h1>
        <h2 className={styles.previewHeader}>
          Preview Player Placement
          <PreviewForm>
            <input
              type="search"
              defaultValue={searchParams.preview}
              name="preview"
              placeholder="Player name"
              enterKeyHint="go"
            />
            <button>Go</button>
          </PreviewForm>
        </h2>
      </div>
      <HighlightContextProvider>
        <div className={styles.grid}>
          {groups.map((group) => (
            <Fragment key={group.name}>
              {group.songs.map((table) => (
                <div key={table.song.id}>
                  <h2>{table.title}</h2>
                  <Suspense fallback={<div className={styles.loadingTable} />}>
                    <ScoreTable
                      cacheContext={cacheContext}
                      song={table.song}
                      players={group.players}
                      previewPlayer={preview}
                    />
                  </Suspense>
                </div>
              ))}
              <div>
                <h2>Totals: {group.name}</h2>
                <Suspense fallback={<div className={styles.loadingTable} />}>
                  <TotalTable
                    cacheContext={cacheContext}
                    songs={group.songs.map((s) => s.song)}
                    players={group.players}
                    previewPlayer={preview}
                  />
                </Suspense>
              </div>
            </Fragment>
          ))}
        </div>
      </HighlightContextProvider>
    </main>
  );
}

async function ScoreTable(props: {
  song: SongMode;
  players: PlayersForMode;
  previewPlayer?: string;
  cacheContext: CacheContext;
}) {
  let players = new Map(props.players);
  if (props.previewPlayer) {
    players.set(props.previewPlayer, undefined);
  }
  const scores = await filteredScoresForSong(
    props.cacheContext,
    players,
    props.song,
  );
  const scoreAtIndex = (idx: number) => scores[idx].score;
  return (
    <table className={styles.scoreTable}>
      <tbody>
        {scores.map((score, idx) => (
          <TableRow
            key={score.name}
            name={score.name}
            isPreview={score.name.toUpperCase() === props.previewPlayer}
          >
            <td className={styles.ranks}>{rankForScore(idx, scoreAtIndex)}</td>
            <td className={styles.leftAlign}>{score.name}</td>
            <td className={styles.rightAlign}>
              {score.score.toLocaleString()}
            </td>
            <td className={styles.rightAlign}>
              <time dateTime={score.timestamp || "unknown date"}>
                {score.timestamp
                  ? new Date(score.timestamp).toLocaleDateString()
                  : "---"}
              </time>
            </td>
          </TableRow>
        ))}
      </tbody>
    </table>
  );
}

async function TotalTable(props: {
  songs: SongMode[];
  players: PlayersForMode;
  previewPlayer?: string;
  cacheContext: CacheContext;
}) {
  let players = new Map(props.players);
  if (props.previewPlayer) {
    players.set(props.previewPlayer, undefined);
  }
  const scoresBySong = await Promise.all(
    props.songs.map(
      filteredScoresForSong.bind(undefined, props.cacheContext, players),
    ),
  );
  const scorePerPlayer = new Map<string, number>();
  for (const songScores of scoresBySong) {
    for (const player of songScores) {
      const total = scorePerPlayer.get(player.name) || 0;
      scorePerPlayer.set(player.name, player.score + total);
    }
  }
  const sortedScores = Array.from(scorePerPlayer.entries()).sort(
    (a, b) => b[1] - a[1],
  );
  const scoreAtIndex = (idx: number) => sortedScores[idx][1];

  return (
    <table className={styles.scoreTable}>
      <tbody>
        {sortedScores.map(([name, score], idx) => (
          <TableRow
            key={name}
            name={name}
            isPreview={name.toUpperCase() === props.previewPlayer}
          >
            <td className={styles.ranks}>{rankForScore(idx, scoreAtIndex)}</td>
            <td className={styles.leftAlign}>{name}</td>
            <td className={styles.rightAlign}>{score.toLocaleString()}</td>
          </TableRow>
        ))}
      </tbody>
    </table>
  );
}

function rankForScore(idx: number, scoreAtIndex: (idx: number) => number) {
  if (idx === 0) return 1;
  if (scoreAtIndex(idx - 1) > scoreAtIndex(idx)) {
    return idx + 1;
  }
  return rankForScore(idx - 1, scoreAtIndex);
}
