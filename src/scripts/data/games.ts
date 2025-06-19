import { gameFileSchema, gameSchema } from '@scripts/schemas';
import type { z } from 'zod/v4';
import { csvParse } from 'd3-dsv';
import { getTeamById } from './teams';

/**
 * Pattern that all game files must match.
 *
 * Used to extract metadata from file name.
 */
const GAME_FILEPATH_REGEX = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})-(?<awayTeamAcronym>\w{3})-(?<homeTeamAcronym>\w{3})\.csv$/;

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
export async function loadGame(metaData: z.infer<typeof gameFileSchema>[number]) {
  // Import CSV file
  const gamePathMap = import.meta.glob('@stats/games/*.csv', { query: '?url&raw' });
  const importPath = Object.keys(gamePathMap).find(gamePath => gamePath.includes(metaData.path));
  if (!importPath) throw new Error(`Game file not found: ${metaData.path}`);
  const string = (await gamePathMap[importPath]() as { default: string }).default;

  // Parse CSV
  const data = csvParse(string);
  const atBats = gameSchema.parse(data);

  // Add metadata
  const firstAtBat = atBats.at(0);
  if (!firstAtBat) throw new Error(`No at bats found from file ${metaData.path}`);
  const homeTeam = await getTeamById(firstAtBat.pitching_team);
  if (!homeTeam) throw new Error(`Home team not found: ${firstAtBat.pitching_team} from file ${metaData.path}`);
  const visitingTeam = await getTeamById(firstAtBat.batting_team);
  if (!visitingTeam) throw new Error(`Visiting team not found: ${firstAtBat.batting_team} from file ${metaData.path}`);
  return {
    atBats,
    homeTeam,
    visitingTeam,
    ...metaData,
  };
}

/**
 * Loads all scoreboards.
 */
export async function getGames() {
  const gameFilePaths = getGameFilePaths();
  return Promise.all(gameFilePaths.map(loadGame));
}