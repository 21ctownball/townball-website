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
import { abbreviationSchema, playerSchema, teamSchema, gameFileSchema, gameSchema } from './schemas';

// @ts-expect-error CSVs are not recognized as valid imports
import abbreviationsString from '@stats/abbreviations.csv?url&raw';

// @ts-expect-error CSVs are not recognized as valid imports
import playersString from '@stats/players.csv?url&raw';

// @ts-expect-error CSVs are not recognized as valid imports
import teamsString from '@stats/teams.csv?url&raw';

/**
 * Pattern that all game files must match.
 *
 * Used to extract metadata from file name.
 */
const GAME_FILEPATH_REGEX = /(?<date>\d\d\d\d-\d\d-\d\d)-(?<visitingTeam>\d+)-(?<homeTeam>\d+)\.csv/;

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
 * Loads information from the team table.
 */
export async function getTeams() {
  return teamSchema.parse( csvParse(teamsString) );
}

/**
 * Returns the file paths and metadata of all "scoreboard" files.
 */
export function getGameFilePaths() {
  // Extract and return metadata from file names
  const gamePaths = Object.keys(import.meta.glob('@stats/games/*.csv'));
  const transformedGamePaths = gamePaths.map((path) => ({ path, ...GAME_FILEPATH_REGEX.exec(path)?.groups }));
  return gameFileSchema.parse(transformedGamePaths);
}

/**
 * Loads a scoreboard from the specified path.
 */
export async function loadGame(path: string) {
  // Import CSV file
  const gamePathMap = import.meta.glob('@stats/games/*.csv', { query: '?url&raw' });
  const importPath = Object.keys(gamePathMap).find(gamePath => gamePath.includes(path));
  if (!importPath) throw new Error(`Game file not found: ${path}`);
  const string = (await gamePathMap[importPath]() as { default: string }).default;

  // Parse CSV
  const data = csvParse(string);
  return gameSchema.parse(data);
}

/**
 * Loads all scoreboards.
 */
export async function getGames() {
  const gameFilePaths = getGameFilePaths();
  return Promise.all(gameFilePaths.map(game => loadGame(game.path)));
}
