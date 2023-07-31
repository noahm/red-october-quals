import { filterPlayers } from "@/data/players";
import styles from "./page.module.css";
import { Mode, cachedScoresForSong } from "@/data/statmaniax";

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

export default async function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Red October Qualifiers</h1>
      </div>

      <div className={styles.grid}>
        {await Promise.all(
          songs.map(async (song) => (
            <div key={song.id}>
              <h2>{song.title}</h2>
              <table className={styles.scoreTable}>
                <tbody>
                  {filterPlayers(
                    await cachedScoresForSong(song.id, song.mode),
                  ).map((score) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          )),
        )}
      </div>
    </main>
  );
}
