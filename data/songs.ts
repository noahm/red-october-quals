import { Mode } from "./statmaniax";

export const groups = [
  {
    name: "Mild",
    songs: [
      {
        title: "Everything is Changing - Wild 19",
        song: { id: 615, mode: Mode.Wild },
      },
      { title: "Love - Wild 20", song: { id: 1558, mode: Mode.Wild } },
      {
        title: "Stockholm to Bombay - Wild 21",
        song: { id: 1554, mode: Mode.Wild },
      },
    ],
  },
  {
    name: "Wild",
    songs: [
      {
        title: "Forever and a Day - Wild 22",
        song: { id: 1531, mode: Mode.Wild },
      },
      { title: "Exotica - Wild 23", song: { id: 12129, mode: Mode.Wild } },
      {
        title: "Rainbow Rave Parade - Wild 24",
        song: { id: 1510, mode: Mode.Wild },
      },
    ],
  },
  {
    name: "Full",
    songs: [
      { title: "Secret 2K12 - Full 22", song: { id: 218, mode: Mode.Full } },
      {
        title: "Boom Boom Dollars - Full 23",
        song: { id: 30164, mode: Mode.Full },
      },
      { title: "Into My Dream - Full 24", song: { id: 1379, mode: Mode.Full } },
    ],
  },
];

export const songs = groups.flatMap((g) => g.songs.map((s) => s.song));
