import { leagueSchema } from '@scripts/schemas';
import { csvParse } from 'd3-dsv';

// @ts-expect-error CSVs are not recognized as valid imports
import leaguesString from '@stats/leagues.csv?url&raw';

/**
 * Loads information from the league table.
 */
export async function getLeagues() {
  return leagueSchema.parse( csvParse(leaguesString) );
}