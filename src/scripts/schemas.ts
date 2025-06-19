import { z } from 'zod/v4';

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
    id: z.string().transform(s => !s.length ? null : Number(s.trim() || NaN)).describe('GUID of league'),
    acronym: z.string().describe('Acronym of league'),
    name: z.string().describe('Full name of league'),
  }),
);

export const gameSchema = z.array(
  z.object({
    at_bat: z.string().transform(s => !s.length ? null : Number(s.trim() || NaN)).describe('The at-bat number (sequential, starting at 0)'),
    batting_team: z.string().regex(TEAM_ID_REGEX, 'Team composite key must be in format <team_id>-YYYY').describe('Composite key of batting team'),
    batter: z.string().transform(s => !s.length ? null : Number(s.trim() || NaN)).describe('GUID of batter'),
    pitching_team: z.string().regex(TEAM_ID_REGEX, 'Team composite key must be in format <team_id>-YYYY').describe('Composite key of pitching team'),
    pitcher: z.string().transform(s => !s.length ? null : Number(s.trim() || NaN)).describe('GUID of pitcher'),
    attempt: z.string().transform(s => !s.length ? null : Number(s.trim() || NaN)).nullable(),
    rbi: z.string().transform(s => !s.length ? null : Number(s.trim() || NaN)).describe('How many runs did the hitter bat in?'),
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
    fielder: z.string().transform(s => !s.length ? null : Number(s.trim() || NaN)).describe('GUID of fielder'),
    assist: z.string().transform(s => !s.length ? null : Number(s.trim() || NaN)).describe('GUID of player who made the assist'),
    assist_1: z.string().optional().transform(s => !s?.length ? null : Number(s.trim() || NaN)),
    assist_2: z.string().optional().transform(s => !s?.length ? null : Number(s.trim() || NaN)),
    assist_3: z.string().optional().transform(s => !s?.length ? null : Number(s.trim() || NaN)),
    assist_4: z.string().optional().transform(s => !s?.length ? null : Number(s.trim() || NaN)),
    assist_5: z.string().optional().transform(s => !s?.length ? null : Number(s.trim() || NaN)),
    assist_6: z.string().optional().transform(s => !s?.length ? null : Number(s.trim() || NaN)),
    error: z.string().transform(s => !s.length ? null : Number(s.trim() || NaN)).describe('GUID of player who made the error'),
    error_1: z.string().optional().transform(s => !s?.length ? null : Number(s.trim() || NaN)),
    error_2: z.string().optional().transform(s => !s?.length ? null : Number(s.trim() || NaN)),
    error_3: z.string().optional().transform(s => !s?.length ? null : Number(s.trim() || NaN)),
    error_4: z.string().optional().transform(s => !s?.length ? null : Number(s.trim() || NaN)),
  }).describe('A single at bat'),
);

export const gameFileSchema = z.array(
  z.object({
    awayTeamAcronym: z.string().describe('Acronym of away team'),
    day: z.string().describe('Day of game'),
    homeTeamAcronym: z.string().describe('Acronym of home team'),
    month: z.string().describe('Month of game'),
    path: z.string().describe('Path to game data file'),
    year: z.string().describe('Year of game'),
  }),
);

export const playerSchema = z.array(
  z.object({
    id: z.string().transform(s => !s.length ? null : Number(s.trim() || NaN)).describe('GUID'),
    last_name: z.string().describe('Last name of player'),
    first_name: z.string().describe('First name of player'),
    debut: z.coerce.date().describe('Date player debuted'),
  }),
);

export const teamSchema = z.array(
  z.object({
    league_id: z.string().transform(s => !s.length ? null : Number(s.trim() || NaN)).describe('GUID of league'),
    club_id: z.string().transform(s => !s.length ? null : Number(s.trim() || NaN)).describe('GUID of club'),
    acronym: z.string().describe('Three letter acronym of team'),
    name: z.string().describe('Name of team'),
    season: z.string().describe('Year this team played (season) in format YYYY'),
  }).describe('A team is a single season of a club'),
);
