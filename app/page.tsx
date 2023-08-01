import styles from "./page.module.css";
import { Mode, filteredScoresForSong } from "@/data/statmaniax";
import { Suspense } from "react";

const songs = [
  { title: "Everything is Changing", id: 615, mode: Mode.Wild },
  { title: "Love", id: 1558, mode: Mode.Wild },
  { title: "Stockholm to Bombay", id: 1554, mode: Mode.Wild },
  { title: "Forever and a Day", id: 1531, mode: Mode.Wild },
  { title: "Exotica", id: 12129, mode: Mode.Wild },
  { title: "Rainbow Rave Parade", id: 1510, mode: Mode.Wild },
  { title: "Secret 2K12", id: 218, mode: Mode.Full },
  { title: "Boom Boom Dollars", id: 30164, mode: Mode.Full },
  { title: "Into My Dream", id: 1379, mode: Mode.Full },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Red October Qualifiers</h1>
      </div>

      <div className={styles.grid}>
        {songs.map((song) => (
          <div key={song.id}>
            <h2>{song.title}</h2>
            <Suspense fallback={<div className={styles.loadingTable} />}>
              <ScoreTable songId={song.id} mode={song.mode} />
            </Suspense>
          </div>
        ))}
      </div>
    </main>
  );
}

async function ScoreTable(props: { songId: number; mode: Mode }) {
  return (
    <table className={styles.scoreTable}>
      <tbody>
        {(await filteredScoresForSong(props.songId, props.mode)).map(
          (score) => (
            <tr key={score.name}>
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
          ),
        )}
      </tbody>
    </table>
  );
}
