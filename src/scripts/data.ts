/**
 * @file Contains helper functions that load and transform data
 * from the `/data` directory.
 *
 * - [Vite glob import](https://vitejs.dev/guide/features.html#glob-import)
 * - [DSV Rollup plugin](https://github.com/rollup/plugins/tree/master/packages/dsv)
 *
 * NOTE: imported data must have the query string `?url&raw` appended to the
 * file path for CSV parsing to work.
 */

import { csvParse } from 'd3-dsv';
import { abbreviationSchema, playerSchema, scoreboardFileSchema, scoreboardSchema } from './schemas';

// @ts-expect-error CSVs are not recognized as valid imports
import abbreviationsString from '@stats/abbreviations.csv?url&raw';

// @ts-expect-error CSVs are not recognized as valid imports
import playersString from '@stats/players.csv?url&raw';

/**
 * Pattern that all game files must match.
 *
 * Used to extract metadata from file name.
 */
const GAME_FILEPATH_REGEX = /(?<date>\d\d\d\d-\d\d-\d\d)-(?<visitingTeam>\w\w\w)(?<homeTeam>\w\w\w)-scbd\.csv/;

/**
 * Imported data must have the query string `?url&raw` appended
 * to the file path for CSV parsing to work.
 */
function formatModulePath(path: string) {
  if (!/\?url&raw$/.test(path)) path += '?url&raw';
  return path;
}

/**
 * Loads information from the abbreviations table.
 */
export async function getAbbreviations() {
  return abbreviationSchema.parse( csvParse(abbreviationsString) );
}

/**
 * Loads information from the player table.
 */
export async function getPlayers() {
  return playerSchema.parse( csvParse(playersString) );
}

/**
 * Returns the file paths and metadata of all "scoreboard" files.
 */
export function getScoreboardFilePaths() {
  // Get relevant files from stats directory
  const pathMap = import.meta.glob('@stats/games/*-scbd.csv', { query: '?url' });
  const pathArray = Object.keys(pathMap);

  // Extract and return metadata from file names
  const transformedPaths = pathArray.map((path) => ({ path, ...GAME_FILEPATH_REGEX.exec(path)?.groups }));
  return scoreboardFileSchema.parse(transformedPaths);
}

/**
 * Loads a scoreboard from the specified path.
 */
export async function loadScoreboard(path: string) {
  // Import CSV file
  const string = (await import(/* @vite-ignore */formatModulePath(path), { with: { type: 'csv' } })).default;
  const data = csvParse(String(string));

  // Parse data from file (includes a hacky fix for a dumb bug)
  const teamString = `${String.fromCharCode(65279)}Team`;
  return scoreboardSchema.parse(data.map((scores: Record<string, string>) => Object.fromEntries(Object.entries(scores).map((s) => (s[0] === teamString ? ['Team', s[1]] : s)))));
}

/**
 * Loads all scoreboards and combines them to create map of teams
 * grouped by the year they played.
 */
export function getTeamsPerYear() {
  const gameScoreboardFiles = getScoreboardFilePaths();
  const years = gameScoreboardFiles.map(({ date }) => date.slice(0, 4));
  const uniqueYears = [...new Set(years)];
  const teamsPerYear = uniqueYears.map((year) => {
    const games = gameScoreboardFiles.filter((game) => game.date.slice(0, 4) === year);
    const teams = games.flatMap((t) => [t.homeTeam, t.visitingTeam]);
    const uniqueTeams = [...new Set(teams)];
    return [year, uniqueTeams] as const;
  });
  return Object.fromEntries(teamsPerYear);
}

/**
 * Calculates all team statistics for a year.
 */
export async function getTeamStats({ team, year }: { team: string; year: string }) {
  const scoreboardFiles = getScoreboardFilePaths().filter(({ date }) => date.slice(0, 4) === year);
  const scoreboards = await Promise.all(scoreboardFiles.map(({ path }) => loadScoreboard(path)));
  const teamScores = scoreboards.flatMap((teamScores) => teamScores.find((ts) => ts.Team === team)).filter((scores) => scores);
  const teamRunsAndHits = teamScores.map((scorecard) => ({ runs: parseInt(scorecard!.R), hits: parseInt(scorecard!.H) }));
  return teamRunsAndHits.reduce((prev, cur) => ({ hits: prev.hits + cur.hits, runs: prev.runs + cur.runs }), { hits: 0, runs: 0 });
}
