import { z } from "astro/zod";

const TEAM_ID_REGEX = /^\d+-\d{4}$/;

export const abbreviationSchema = z.array(
  z.object({
    abbreviation: z.string().describe('Abbreviation of statistic'),
    title: z.string().describe('Full title of statistic'),
    description: z.string().describe('Description of statistic'),
  }),
);

export const leagueSchema = z.array(
  z.object({
    id: z.coerce.number().describe('GUID of league'),
    acronym: z.string().describe('Acronym of league'),
    name: z.string().describe('Full name of league'),
  }),
);

export const gameSchema = z.array(
  z.object({
    at_bat: z.coerce.number().describe('The at-bat number (sequential, starting at 0)'),
    batting_team: z.string().regex(TEAM_ID_REGEX, 'Team composite key must be in format <team_id>-YYYY').describe('Composite key of batting team'),
    batter: z.coerce.number().describe('GUID of batter'),
    pitching_team: z.string().regex(TEAM_ID_REGEX, 'Team composite key must be in format <team_id>-YYYY').describe('Composite key of pitching team'),
    pitcher: z.coerce.number().describe('GUID of pitcher'),
    attempt: z.coerce.number().nullable(),
    rbi: z.coerce.number().describe('How many runs did the hitter bat in?'),
    single: z.coerce.boolean().describe('Was this a single?'),
    double: z.coerce.boolean().describe('Was this a double?'),
    triple: z.coerce.boolean().describe('Was this a triple?'),
    quadruple: z.coerce.boolean().describe('Was this a quadruple?'),
    home_run: z.coerce.boolean().describe('Was this a home run?'),
    steal1: z.coerce.boolean().describe('Did the batter steal first?'),
    steal2: z.coerce.boolean().describe('Did the batter steal second?'),
    steal3: z.coerce.boolean().describe('Did the batter steal third?'),
    steal4: z.coerce.boolean().describe('Did the batter steal fourth?'),
    steal5: z.coerce.boolean().describe('Did the batter steal fifth?'),
    //the next five specifically ask if the batter advanced *without* stealing/hitting his way there.
    adv1: z.coerce.boolean().describe('Did the batter advance to first?'),
    adv2: z.coerce.boolean().describe('Did the batter advance to second?'),
    adv3: z.coerce.boolean().describe('Did the batter advance to third?'),
    adv4: z.coerce.boolean().describe('Did the batter advance to fourth?'),
    adv5: z.coerce.boolean().describe('Did the batter advance to fifth?'),
    strikeout: z.coerce.boolean().describe('Did the batter strike out?'),
    flyout: z.coerce.boolean().describe('Did the batter fly out?'),
    tag: z.coerce.boolean().describe('Was the batter tagged out?'),
    peg: z.coerce.boolean().describe("Was the batter pegged out?"),
    fielder: z.coerce.number().nullable().describe('GUID of fielder who made the out'),
    assist: z.coerce.number().nullable().describe('GUID of fielder who made the assist'),
    //assist_1 through assist_6 and error_3 through error_4 are not necessary.  I do not know the extent of the code which references those fields, so I shall have to leave this part up to you
    //also wondering if ".nullable" means that it will detect " " seperately from "0".  if it does not, or if the existence of an ID#0 would cause issues, we can assign the player with ID#0 to another number
    fielder: z.string().transform(s => !s.length ? null : Number(s)).describe('GUID of fielder'),
    assist: z.string().transform(s => !s.length ? null : Number(s)).describe('GUID of player who made the assist'),
    assist_1: z.string().transform(s => !s.length ? null : Number(s)),
    assist_2: z.string().transform(s => !s.length ? null : Number(s)),
    assist_3: z.string().transform(s => !s.length ? null : Number(s)),
    assist_4: z.string().transform(s => !s.length ? null : Number(s)),
    assist_5: z.string().transform(s => !s.length ? null : Number(s)),
    assist_6: z.string().transform(s => !s.length ? null : Number(s)),
    error: z.string().transform(s => !s.length ? null : Number(s)).describe('GUID of player who made the error'),
    error_1: z.string().transform(s => !s.length ? null : Number(s)),
    error_2: z.string().transform(s => !s.length ? null : Number(s)),
    error_3: z.string().transform(s => !s.length ? null : Number(s)),
    error_4: z.string().transform(s => !s.length ? null : Number(s)),
  }).describe('A single at bat'),
);

export const gameFileSchema = z.array(
  z.object({
    date: z.string().describe('Date of game in format YYYYMMDD'),
    homeTeamAcronym: z.string().describe('Acronym of home team'),
    path: z.string().describe('Path to game data file'),
  }),
);

export const playerSchema = z.array(
  z.object({
    id: z.coerce.number().describe('GUID'),
    last_name: z.string().describe('Last name of player'),
    first_name: z.string().describe('First name of player'),
    debut: z.coerce.date().describe('Date player debuted'),
  }),
);

export const teamSchema = z.array(
  z.object({
    league_id: z.coerce.number().describe('GUID of league'),
    club_id: z.coerce.number().describe('GUID of club'),
    acronym: z.string().describe('Three letter acronym of team'),
    name: z.string().describe('Name of team'),
    season: z.string().describe('Year this team played (season) in format YYYY'),
  }).describe('A team is a single season of a club'),
);
