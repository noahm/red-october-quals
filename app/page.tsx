import styles from "./page.module.css";
import { Mode, SongInMode, filteredScoresForSong } from "@/data/statmaniax";
import { Suspense } from "react";

const groups = [
  {
    name: "Mild",
    songs: [
      { title: "Everything is Changing", song: { id: 615, mode: Mode.Wild } },
      { title: "Love", song: { id: 1558, mode: Mode.Wild } },
      { title: "Stockholm to Bombay", song: { id: 1554, mode: Mode.Wild } },
    ],
  },
  {
    name: "Wild",
    songs: [
      { title: "Forever and a Day", song: { id: 1531, mode: Mode.Wild } },
      { title: "Exotica", song: { id: 12129, mode: Mode.Wild } },
      { title: "Rainbow Rave Parade", song: { id: 1510, mode: Mode.Wild } },
    ],
  },
  {
    name: "Full",
    songs: [
      { title: "Secret 2K12", song: { id: 218, mode: Mode.Full } },
      { title: "Boom Boom Dollars", song: { id: 30164, mode: Mode.Full } },
      { title: "Into My Dream", song: { id: 1379, mode: Mode.Full } },
    ],
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Red October Qualifiers</h1>
      </div>

      <div className={styles.grid}>
        {groups.map((group) => (
          <>
            {group.songs.map((table) => (
              <div key={table.song.id}>
                <h2>{table.title}</h2>
                <Suspense fallback={<div className={styles.loadingTable} />}>
                  <ScoreTable song={table.song} />
                </Suspense>
              </div>
            ))}
            <div>
              <h2>Totals: {group.name}</h2>
              <Suspense fallback={<div className={styles.loadingTable} />}>
                <TotalTable songs={group.songs.map((s) => s.song)} />
              </Suspense>
            </div>
          </>
        ))}
      </div>
    </main>
  );
}

async function ScoreTable(props: { song: SongInMode }) {
  const scores = await filteredScoresForSong(props.song);
  const scoreAtIndex = (idx: number) => scores[idx].score;
  return (
    <table className={styles.scoreTable}>
      <tbody>
        {scores.map((score, idx) => (
          <tr key={score.name}>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}

async function TotalTable(props: { songs: SongInMode[] }) {
  const scoresBySong = await Promise.all(
    props.songs.map(filteredScoresForSong),
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
          <tr key={name}>
            <td className={styles.ranks}>{rankForScore(idx, scoreAtIndex)}</td>
            <td className={styles.leftAlign}>{name}</td>
            <td className={styles.rightAlign}>{score.toLocaleString()}</td>
          </tr>
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
