const players = new Set([
  "Inzuma", // ???
  "EvilDave",
  "ZephyrNoBar",
  "SenPi",
  "Miklowcic",
  "Cathadan",
  "ZOM585",
  "Eesa",
  "chezmix",
  "Telperion",
  "JENNIFER", // ???
  "JennuineInc",
  "JellySlosh",
  "emcat",
  "ParanoiaBoi",
  "Yokamaa",
  "Twans",
  "Grady",
  "Masongos",
  "EndersteveMC",
  "Shinobee",
  "Gr0f",
  "minatsooki",
  "JJK.",
  "Tokn316",
]);

export function filterPlayers<T extends { name: string }>(list: Iterable<T>) {
  return Array.from(list).filter((item) => players.has(item.name));
}
