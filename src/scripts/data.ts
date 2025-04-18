/**
 * @file Contains helper functions that load and transform data
 * from the `src/data/` directory.
 */

import { abbreviationSchema, gameFileSchema, gameSchema, playerSchema, teamSchema } from './schemas';
import abbreviationsJson from '@data/abbreviations.json';
import playersJson from '@data/players.json';
import teamsJson from '@data/teams.json';

/**
 * Pattern that all game files must match.
 *
 * Used to extract metadata from file name.
 */
const GAME_FILEPATH_REGEX = /(?<date>\d\d\d\d-\d\d-\d\d)-(?<visitingTeam>\d+)-(?<homeTeam>\d+)\.json/;

/**
 * Loads information from the abbreviations table.
 */
export async function getAbbreviations() {

  return abbreviationSchema.parse(abbreviationsJson);
}

/**
 * Loads information from the player table.
 */
export async function getPlayers() {
  return playerSchema.parse(playersJson);
}

/**
 * Loads information from the team table.
 */
export async function getTeams() {
  return teamSchema.parse(teamsJson);
}

/**
 * Returns the file paths and metadata of all "scoreboard" files.
 */
export function getGameFilePaths() {
  // Get relevant files from stats directory
  const pathMap = import.meta.glob('../data/games/*.json');
  const pathArray = Object.keys(pathMap);

  // Extract and return metadata from file names
  const transformedPaths = pathArray.map((path) => ({ path, ...GAME_FILEPATH_REGEX.exec(path)?.groups }));
  return gameFileSchema.parse(transformedPaths);
}

/**
 * Loads a scoreboard from the specified path.
 */
export async function loadGame(path: string) {
  // Import JSON file
  const json = (await import(/* @vite-ignore */path)).default;
  return gameSchema.parse(json);
}