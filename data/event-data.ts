import { Mode } from "./statmaniax";

const players: Record<string, { wild?: true; mild?: true; full?: true }> = {
  // everything
  Inzuma: { mild: true, wild: true, full: true }, // no idea what this player's IGN is
  ZephyrNoBar: { mild: true, wild: true, full: true },
  Gr0f: { mild: true, wild: true, full: true },

  // no mild
  Miklowcic: { wild: true, full: true },
  SenPi: { wild: true, full: true },
  Eesa: { wild: true, full: true },
  chezmix: { wild: true, full: true },
  Telperion: { wild: true, full: true },
  JellySlosh: { wild: true, full: true },
  emcat: { wild: true, full: true },
  ParanoiaBoi: { wild: true, full: true },
  Masongos: { wild: true, full: true },
  "JJK.": { wild: true, full: true },
  werdwerdus: { wild: true, full: true },
  Grady: { wild: true, full: true },

  // wild only
  Yokamaa: { wild: true },
  Twans: { wild: true },
  minatsooki: { wild: true },
  EvilDave: { wild: true },
  Sneaky: { wild: true },

  // mild only
  Jennergy: { mild: true },
  JennuineInc: { mild: true },
  ZOM585: { mild: true },
  EndersteveMC: { mild: true },
  Tokn316: { mild: true },

  // no full
  Cathadan: { mild: true, wild: true },
  Shinobee: { wild: true, mild: true },
};

function allPlayersFor(event: "wild" | "mild" | "full") {
  return new Set(
    Object.keys(players).filter((player) => !!players[player][event]),
  );
}

export const groups = [
  {
    name: "Mild",
    players: allPlayersFor("mild"),
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
    players: allPlayersFor("wild"),
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
    players: allPlayersFor("full"),
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

export const songs = groups.flatMap((g) => g.songs);
