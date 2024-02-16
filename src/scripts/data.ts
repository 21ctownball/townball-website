import { csvParse } from 'd3-dsv';
import { z } from 'zod';

const abbreviationSchema = z.array(
  z.object({
    abbreviation: z.string(),
    title: z.string(),
    description: z.optional(z.string()),
  }),
);

const scoreboardFileSchema = z.array(
  z.object({
    path: z.string(),
    date: z.string(),
    visitingTeam: z.string(),
    homeTeam: z.string(),
  }),
);

const scoreboardSchema = z.array(
  z
    .object({
      Team: z.string(),
      R: z.string(),
      H: z.string(),
      SS: z.string(),
    })
    .catchall(z.string()),
);

export async function getAbbreviations() {
  const string = (await import('/src/stats/abbreviations.csv?url&raw')).default;
  const data = csvParse(string);
  return abbreviationSchema.parse(data);
}

/**
 * @see https://vitejs.dev/guide/features.html#glob-import
 */
export function getScoreboardFilePaths() {
  const gameFilePaths = Object.keys(import.meta.glob('/src/stats/games/*-scbd.csv', { as: 'url' }));
  const gameFileRegex = /(?<date>\d\d\d\d-\d\d-\d\d)-(?<visitingTeam>\w\w\w)(?<homeTeam>\w\w\w)-scbd\.csv/;
  return scoreboardFileSchema.parse(gameFilePaths.map((path) => ({ path, ...gameFileRegex.exec(path)?.groups })));
}

/**
 * @see https://github.com/rollup/plugins/tree/master/packages/dsv
 */
export async function loadScoreboard(path: string) {
  const teamString = `${String.fromCharCode(65279)}Team`;
  const string = (await import(`${path}?url&raw` /* @vite-ignore */)).default;
  const data = csvParse(string);
  return scoreboardSchema.parse(data.map((scores: Record<string, string>) => Object.fromEntries(Object.entries(scores).map((s) => (s[0] === teamString ? ['Team', s[1]] : s)))));
}

export function getTeamsPerYear() {
  const gameScoreboardFiles = getScoreboardFilePaths();
  const years = [...new Set(gameScoreboardFiles.map(({ date }) => date.slice(0, 4)))];
  const teamsPerYear = years.map((year) => {
    const games = gameScoreboardFiles.filter((game) => game.date.slice(0, 4) === year);
    const teams = [...new Set(games.flatMap((t) => [t.homeTeam, t.visitingTeam]))];
    const result = [year, teams] as const;
    return result;
  });
  return Object.fromEntries(teamsPerYear);
}

export async function getTeamStats({ team, year }: { team: string; year: string }) {
  const scoreboardFiles = getScoreboardFilePaths().filter(({ date }) => date.slice(0, 4) === year);
  const scoreboards = await Promise.all(scoreboardFiles.map(({ path }) => loadScoreboard(path)));
  const teamScores = scoreboards.flatMap((teamScores) => teamScores.find((ts) => ts.Team === team)).filter((scores) => scores);
  const teamRunsAndHits = teamScores.map((scorecard) => ({ runs: parseInt(scorecard!.R), hits: parseInt(scorecard!.H) }));
  return teamRunsAndHits.reduce((prev, cur) => ({ hits: prev.hits + cur.hits, runs: prev.runs + cur.runs }), { hits: 0, runs: 0 });
}
