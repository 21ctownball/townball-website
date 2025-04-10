import { z } from 'zod';

export const abbreviationSchema = z.array(
  z.object({
    abbreviation: z.string(),
    title: z.string(),
    description: z.optional(z.string()),
  }),
);

export const scoreboardFileSchema = z.array(
  z.object({
    path: z.string(),
    date: z.string(),
    visitingTeam: z.string(),
    homeTeam: z.string(),
  }),
);

export const scoreboardSchema = z.array(
  z
    .object({
      Team: z.string(),
      R: z.string(),
      H: z.string(),
      SS: z.string(),
    })
    .catchall(z.string()),
);