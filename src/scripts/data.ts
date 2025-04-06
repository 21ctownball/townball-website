import { csvParse } from 'd3-dsv';
import { abbreviationSchema, scoreboardFileSchema, scoreboardSchema } from './schemas';

// @ts-expect-error CSVs are not recognized as valid imports
import abbreviationsString from '../stats/abbreviations.csv?url&raw';

export async function getAbbreviations() {
  const data = csvParse(abbreviationsString);
  return abbreviationSchema.parse(data);
}

/**
 * @see https://vitejs.dev/guide/features.html#glob-import
 */
export function getScoreboardFilePaths() {
  const gameFilePaths = Object.keys(import.meta.glob('../stats/games/*-scbd.csv', { as: 'url' }));
  const gameFileRegex = /(?<date>\d\d\d\d-\d\d-\d\d)-(?<visitingTeam>\w\w\w)(?<homeTeam>\w\w\w)-scbd\.csv/;
  return scoreboardFileSchema.parse(
    gameFilePaths
      // Ensure file path is correct format, since the file name is "metadata" -- the game date and teams
      .map((path) => ({ path, ...gameFileRegex.exec(path)?.groups })))
      // Add "?url&raw" query parameter to ensure dsv plugin works properly
      .map(({ path, ...others }) => ({ ...others, path: path.concat('?url&raw') })
  );
}

/**
 * @see https://github.com/rollup/plugins/tree/master/packages/dsv
 */
export async function loadScoreboard(path: string) {
  const teamString = `${String.fromCharCode(65279)}Team`;
  const string = (await import(/* @vite-ignore */`${path}`)).default;
  const data = csvParse(String(string));
  return scoreboardSchema.parse(data.map((scores: Record<string, string>) => Object.fromEntries(Object.entries(scores).map((s) => (s[0] === teamString ? ['Team', s[1]] : s)))));
}

export function getTeamsPerYear() {
  const gameScoreboardFiles = getScoreboardFilePaths();
  const years = [...new Set(gameScoreboardFiles.map(({ date }) => date.slice(0, 4)))];
  const teamsPerYear = years.map((year) => {
    const games = gameScoreboardFiles.filter((game) => game.date.slice(0, 4) === year);
    const teams = [...new Set(games.flatMap((t) => [t.homeTeam, t.visitingTeam]))];
    const result = [year, teams] as const;
    return result as [string, string[]];
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
