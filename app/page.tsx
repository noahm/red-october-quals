import styles from "./page.module.css";
import { SongInMode, filteredScoresForSong } from "@/data/statmaniax";
import { Fragment, Suspense } from "react";
import { TableRow, HighlightContextProvider } from "./highlights";
import { groups } from "@/data/event-data";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Red October Qualifiers</h1>
      </div>

      <HighlightContextProvider>
        <div className={styles.grid}>
          {groups.map((group) => (
            <Fragment key={group.name}>
              {group.songs.map((table) => (
                <div key={table.song.id}>
                  <h2>{table.title}</h2>
                  <Suspense fallback={<div className={styles.loadingTable} />}>
                    <ScoreTable song={table.song} players={group.players} />
                  </Suspense>
                </div>
              ))}
              <div>
                <h2>Totals: {group.name}</h2>
                <Suspense fallback={<div className={styles.loadingTable} />}>
                  <TotalTable
                    songs={group.songs.map((s) => s.song)}
                    players={group.players}
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

async function ScoreTable(props: { song: SongInMode; players: Set<string> }) {
  const scores = await filteredScoresForSong(props.players, props.song);
  const scoreAtIndex = (idx: number) => scores[idx].score;
  return (
    <table className={styles.scoreTable}>
      <tbody>
        {scores.map((score, idx) => (
          <TableRow key={score.name} name={score.name}>
            <td className={styles.ranks}>{rankForScore(idx, scoreAtIndex)}</td>
            <td className={styles.leftAlign}>{score.name}</td>
            <td className={styles.rightAlign}>
              {score.score.toLocaleString()}
            </td>
            <td className={styles.rightAlign}>
              <time dateTime={score.timestamp}>
                {new Date(score.timestamp).toLocaleDateString()}
              </time>
            </td>
          </TableRow>
        ))}
      </tbody>
    </table>
  );
}

async function TotalTable(props: {
  songs: SongInMode[];
  players: Set<string>;
}) {
  const scoresBySong = await Promise.all(
    props.songs.map(filteredScoresForSong.bind(undefined, props.players)),
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
          <TableRow key={name} name={name}>
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
