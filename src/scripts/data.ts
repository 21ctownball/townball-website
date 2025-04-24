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
import { abbreviationSchema, playerSchema, teamSchema, gameFileSchema, gameSchema, leagueSchema } from './schemas';

// @ts-expect-error CSVs are not recognized as valid imports
import abbreviationsString from '@stats/abbreviations.csv?url&raw';

// @ts-expect-error CSVs are not recognized as valid imports
import leaguesString from '@stats/leagues.csv?url&raw';

// @ts-expect-error CSVs are not recognized as valid imports
import playersString from '@stats/players.csv?url&raw';

// @ts-expect-error CSVs are not recognized as valid imports
import teamsString from '@stats/teams.csv?url&raw';
import type { z } from 'astro/zod';

/**
 * Pattern that all game files must match.
 *
 * Used to extract metadata from file name.
 */
const GAME_FILEPATH_REGEX = /(?<date>\d{8})-(?<homeTeamAcronym>\w{3})\.csv$/;

/**
 * Combines the `club_id` and `season` into a single string.
 *
 * This is the composite key used to identify a team.
 */
export const getTeamId = (team: z.infer<typeof teamSchema>[number]) => team.club_id + '-' + team.season;

/**
 * Loads information from the abbreviations table.
 */
export async function getAbbreviations() {
  return abbreviationSchema.parse( csvParse(abbreviationsString) );
}

/**
 * Loads information from the league table.
 */
export async function getLeagues() {
  return leagueSchema.parse( csvParse(leaguesString) );
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
 * Returns the team with the specified composite ID.
 */
export async function getTeamById(teamId: string) {
  const teams = await getTeams();
  return teams.find(team => getTeamId(team) === teamId);
}

/**
 * Returns the team with the specified acronym and season.
 */
export async function getTeamByAcronymAndSeason(acronym: string, season: string) {
  const teams = await getTeams();
  return teams.find(team => team.acronym === acronym && team.season === season);
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
    homeTeam: homeTeam,
    visitingTeam: visitingTeam,
    date: metaData.date,
  };
}

/**
 * Loads all scoreboards.
 */
export async function getGames() {
  const gameFilePaths = getGameFilePaths();
  return Promise.all(gameFilePaths.map(loadGame));
}
