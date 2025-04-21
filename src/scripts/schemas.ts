import { z } from 'zod';

export const abbreviationSchema = z.array(
  z.object({
    abbreviation: z.string().describe('Abbreviation of statistic'),
    title: z.string().describe('Full title of statistic'),
    description: z.string().describe('Description of statistic'),
  }),
);

export const gameSchema = z.array(
  z.object({
    at_bat: z.coerce.number().describe('The at-bat number (sequential, starting at 0)'),
    batting_team: z.coerce.number().describe('GUID of batting team'),
    batter: z.coerce.number().describe('GUID of batter'),
    pitching_team: z.coerce.number().describe('GUID of pitching team'),
    pitcher: z.coerce.number().describe('GUID of pitcher'),
    attempt: z.coerce.number().nullable(),
    rbi: z.coerce.number().describe('How many runs were scored during this at-bat?'),
    single: z.coerce.boolean().describe('Was this a single?'),
    double: z.coerce.boolean().describe('Was this a double?'),
    triple: z.coerce.boolean().describe('Was this a triple?'),
    quadruple: z.coerce.boolean().describe('Was this a quadruple?'),
    home_run: z.coerce.boolean().describe('Was this a home run?'),
    steal1: z.coerce.boolean(),
    steal2: z.coerce.boolean(),
    steal3: z.coerce.boolean(),
    steal4: z.coerce.boolean(),
    steal5: z.coerce.boolean(),
    adv1: z.coerce.boolean(),
    adv2: z.coerce.boolean(),
    adv3: z.coerce.boolean(),
    adv4: z.coerce.boolean(),
    adv5: z.coerce.boolean(),
    zone: z.coerce.boolean().describe('Did the batter get zoned?'),
    strikeout: z.coerce.boolean().describe('Was this a strikeout?'),
    flyout: z.coerce.boolean().describe('Was this a flyout?'),
    tag: z.coerce.boolean(),
    peg: z.coerce.boolean(),
    fielder: z.coerce.number().nullable().describe('GUID of fielder'),
    assist: z.coerce.number().nullable().describe('GUID of assist'),
    assist_1: z.string(),
    assist_2: z.string(),
    assist_3: z.string(),
    assist_4: z.string(),
    assist_5: z.string(),
    assist_6: z.string(),
    error: z.coerce.boolean(),
    error_1: z.string(),
    error_2: z.string(),
    error_3: z.string(),
    error_4: z.string(),
  }).describe('A single at bat'),
);

export const gameFileSchema = z.array(
  z.object({
    date: z.string().describe('Date of game in format YYYY-MM-DD'),
    visitingTeam: z.coerce.number().describe('GUID of visiting team'),
    homeTeam: z.coerce.number().describe('GUID of home team'),
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
    id: z.coerce.number().describe('GUID'),
    acronym: z.string().describe('Three letter acronym of team'),
    name: z.string().describe('Name of team'),
    debut_season: z.coerce.number().describe('Year team debuted'),
    final_season: z.coerce.number().nullable().describe('Year team retired'),
    successor: z.coerce.number().nullable().describe('GUID of successor team'),
  }),
);
