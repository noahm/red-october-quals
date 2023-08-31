import type { SongMode } from "./statmaniax";

const players: Record<string, { wild?: true; mild?: true; full?: true }> = {
  // everything
  Inzuma: { mild: true, wild: true, full: true }, // no idea what this player's IGN is
  Gr0f: { mild: true, wild: true, full: true },
  datcoreedoe: { mild: true, wild: true, full: true },

  // no wild
  ZephyrNoBar: { mild: true, full: true },
  GlobalPanda7678: { mild: true, full: true },

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
  WDrM: { wild: true, full: true },

  // wild only
  Yokamaa: { wild: true },
  Twans: { wild: true },
  minatsooki: { wild: true },
  EvilDave: { wild: true },
  Sneaky: { wild: true },
  SMXSquid: { wild: true },
  MarkJ: { wild: true },
  iamchris4life: { wild: true },

  // mild only
  Jennergy: { mild: true },
  JennuineInc: { mild: true },
  ZOM585: { mild: true },
  EndersteveMC: { mild: true },
  Tokn316: { mild: true },
  "Big Matt": { mild: true },
  Pilot: { mild: true },

  // no full
  Cathadan: { mild: true, wild: true },
  Shinobee: { wild: true, mild: true },
};

function allPlayersFor(event: "wild" | "mild" | "full") {
  return new Set(
    Object.keys(players)
      .filter((player) => !!players[player][event])
      .map((name) => name.toUpperCase()),
  );
}

export const groups: Array<{
  name: string;
  players: Set<string>;
  songs: Array<{ title: string; song: SongMode }>;
}> = [
  {
    name: "Mild",
    players: allPlayersFor("mild"),
    songs: [
      {
        title: "Everything is Changing - Wild 19",
        song: { id: 615, mode: "wild" },
      },
      { title: "Love - Wild 20", song: { id: 1558, mode: "wild" } },
      {
        title: "Stockholm to Bombay - Wild 21",
        song: { id: 1554, mode: "wild" },
      },
    ],
  },
  {
    name: "Wild",
    players: allPlayersFor("wild"),
    songs: [
      {
        title: "Forever and a Day - Wild 22",
        song: { id: 1531, mode: "wild" },
      },
      { title: "Exotica - Wild 23", song: { id: 12129, mode: "wild" } },
      {
        title: "Rainbow Rave Parade - Wild 24",
        song: { id: 1510, mode: "wild" },
      },
    ],
  },
  {
    name: "Full",
    players: allPlayersFor("full"),
    songs: [
      { title: "Secret 2K12 - Full 22", song: { id: 218, mode: "full" } },
      {
        title: "Boom Boom Dollars - Full 23",
        song: { id: 30164, mode: "full" },
      },
      { title: "Into My Dream - Full 24", song: { id: 1379, mode: "full" } },
    ],
  },
];

export const songs = groups.flatMap((g) => g.songs);
