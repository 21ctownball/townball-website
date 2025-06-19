import { teamSchema } from '@scripts/schemas';
import type { z } from 'zod/v4';
import { csvParse } from 'd3-dsv';

// @ts-expect-error CSVs are not recognized as valid imports
import teamsString from '@stats/teams.csv?url&raw';

/**
 * Loads information from the team table.
 */
export async function getTeams() {
  return teamSchema.parse( csvParse(teamsString) );
}

/**
 * Loads information from the teams table and reduces it to a list of unique clubs.
 */
export async function getClubs() {
  const teams = await getTeams();
  const result: Record<string, typeof teams> = {};
  return teams.reduce((acc, team) => {
    // Skip teams that don't have a club_id
    if (!team.club_id) return acc;

    // Initialize the club if it doesn't exist
    if (!acc[team.club_id]) acc[team.club_id] = [];

    // Add the team to the club
    acc[team.club_id].push(team);

    // Return the accumulator
    return acc;
  }, result);
}

/**
 * Combines the `club_id` and `season` into a single string.
 *
 * This is the composite key used to identify a team.
 */
export const getTeamId = (team: z.infer<typeof teamSchema>[number]) => team.club_id + '-' + team.season;

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