import { playerSchema } from '@scripts/schemas';
import { csvParse } from 'd3-dsv';

// @ts-expect-error CSVs are not recognized as valid imports
import playersString from '@stats/players.csv?url&raw';

/**
 * Loads information from the player table.
 */
export async function getPlayers() {
  return playerSchema.parse( csvParse(playersString) );
}