import { abbreviationSchema } from '@scripts/schemas';
import { csvParse } from 'd3-dsv';

// @ts-expect-error CSVs are not recognized as valid imports
import abbreviationsString from '@stats/abbreviations.csv?url&raw';

/**
 * Loads information from the abbreviations table.
 */
export async function getAbbreviations() {
  return abbreviationSchema.parse( csvParse(abbreviationsString) );
}