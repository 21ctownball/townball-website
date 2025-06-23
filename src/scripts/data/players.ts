import { getGames } from '@scripts/data/games';
import { playerSchema } from '@scripts/schemas';
import { csvParse } from 'd3-dsv';

// @ts-expect-error CSVs are not recognized as valid imports
import playersString from '@stats/players.csv?url&raw';

type Games = Awaited<ReturnType<typeof getGames>>;

type PlateAppearance = Games[number]['atBats'][number];

/**
 * Loads information from the player table.
 */
export async function getPlayers() {
  return playerSchema.parse( csvParse(playersString) );
}

/**
 * Increment once each time a player's plate appearance has a result.
 *
 * The only time it doesn't is at the end of a game,
 * when someone either was batting when a runner got out,
 * or batted the winning run in.
 */
function getAtBats(plateAppearances: PlateAppearance[]) {
  return plateAppearances.length;
}

/**
 * Increment once per `attempt`.
 */
function getAttempts(plateAppearances: PlateAppearance[]) {
  return plateAppearances.filter(pa => pa.attempt).length;
}

/**
 * Increment once per `single`, `double`, `triple`, `quadruple`, or `home_run`.
 */
function getHits(plateAppearances: PlateAppearance[]) {
  return plateAppearances.filter(pa => pa.single || pa.double || pa.triple || pa.quadruple || pa.home_run).length;
}

/**
 * Increment once per `single`.
 */
function getSingles(plateAppearances: PlateAppearance[]) {
  return plateAppearances.filter(pa => pa.single).length;
}

/**
 * Increment once per `double`.
 */
function getDoubles(plateAppearances: PlateAppearance[]) {
  return plateAppearances.filter(pa => pa.double).length;
}

/**
 * Increment once per `triple`.
 */
function getTriples(plateAppearances: PlateAppearance[]) {
  return plateAppearances.filter(pa => pa.triple).length;
}

/**
 * Increment once per `quadruple`.
 */
function getQuadruples(plateAppearances: PlateAppearance[]) {
  return plateAppearances.filter(pa => pa.quadruple).length;
}

/**
 * Increment once per `home_run`.
 */
function getHomeRuns(plateAppearances: PlateAppearance[]) {
  return plateAppearances.filter(pa => pa.home_run).length;
}

/**
 * Increment once per `steal1`, `steal2`, `steal3`, `steal4`, or `steal5`.
 */
function getStolenStakes(plateAppearances: PlateAppearance[]) {
  return plateAppearances.filter(pa => pa.steal1 || pa.steal2 || pa.steal3 || pa.steal4 || pa.steal5).length;
}

/**
 * Increment once per `steal5`, `adv5`, or `home_run`.
 */
function getRuns(plateAppearances: PlateAppearance[]) {
  return plateAppearances.reduce((acc, pa) => acc + Number(pa.steal5 || pa.adv5 || pa.home_run), 0);
}

/**
 * Increment once per `rbi`.
 */
function getRunsBattedIn(plateAppearances: PlateAppearance[]) {
  return plateAppearances.reduce((acc, pa) => acc + (pa.rbi || 0), 0);
}

/**
 * Increment once per hit, `steal1`, or `adv1`.
 *
 * This is a *hidden* statistic.
 */
function getOnStakes(plateAppearances: PlateAppearance[]) {
  return plateAppearances.filter(pa => pa.single || pa.double || pa.triple || pa.quadruple || pa.home_run || pa.steal1 || pa.adv1).length;
}

/**
 * `onStakes` / `atBats`.
 */
function getOnStakePercentage(plateAppearances: PlateAppearance[]) {
  const onStakes = getOnStakes(plateAppearances);
  const atBats = getAtBats(plateAppearances);
  if (atBats === 0) return 0;
  return (onStakes / atBats) * 100;
}

/**
 * `hits` / `atBats`.
 */
function getBattingAverage(plateAppearances: PlateAppearance[]) {
  const hits = getHits(plateAppearances);
  const atBats = getAtBats(plateAppearances);
  if (atBats === 0) return 0;
  return hits / atBats;
}

/**
 * ((21 * `single` / 55) + `double` + (2 * `triple`) + (3 * `quadruple`) + (4 * `home_run`))
 */
function getWeightedStakes(plateAppearances: PlateAppearance[]) {
  const singles = getSingles(plateAppearances);
  const doubles = getDoubles(plateAppearances);
  const triples = getTriples(plateAppearances);
  const quadruples = getQuadruples(plateAppearances);
  const homeRuns = getHomeRuns(plateAppearances);

  return (21 * singles / 55) + doubles + (2 * triples) + (3 * quadruples) + (4 * homeRuns);
}

/**
 * `weightedStakes` / `attempts`.
 */
function getSluggingPercentage(plateAppearances: PlateAppearance[]) {
  const weightedStakes = getWeightedStakes(plateAppearances);
  const attempts = getAttempts(plateAppearances);
  if (attempts === 0) return 0;
  return (weightedStakes / attempts) * 100;
}

/**
 * Calculates batter stats for a given player based on the provided games.
 */
export function getBatterStats(playerId: number, games: Games) {
  // Filter out games where the player did not bat
	const playerGames = games.filter(game => game.atBats.some(atBat => atBat.batter === playerId));

  // Get all plate appearances for the player
	const plateAppearances = playerGames.flatMap(game => game.atBats).filter(atBat => atBat.batter === playerId);

	const atBats = getAtBats(plateAppearances);
	const attempts = getAttempts(plateAppearances);
	const hits = getHits(plateAppearances);
	const triples = getTriples(plateAppearances);
	const quadruples = getQuadruples(plateAppearances);
	const homeRuns = getHomeRuns(plateAppearances);
	const stolenStakes = getStolenStakes(plateAppearances);
	const runs = getRuns(plateAppearances);
	const runsBattedIn = getRunsBattedIn(plateAppearances);
	const onStakePercentage = getOnStakePercentage(plateAppearances);
	const battingAverage = getBattingAverage(plateAppearances);
	const sluggingPercentage = getSluggingPercentage(plateAppearances);

	return {
		'Games': games.length.toString(),
		'At-bats': atBats.toString(),
		'Attempts': attempts.toString(),
		'Hits': hits.toString(),
		'Triples': triples.toString(),
		'Quadruples': quadruples.toString(),
		'Home Runs': homeRuns.toString(),
		'Stolen Stakes': stolenStakes.toString(),
		'Runs': runs.toString(),
		'Runs Batted In': runsBattedIn.toString(),
		'On-Stake Percentage': `${onStakePercentage.toFixed(1)}%`,
		'Batting Average': battingAverage.toFixed(3).slice(1),
		'Slugging Percentage': `${sluggingPercentage.toFixed(1)}%`,
	};
}

/**
 * One win granted per game.
 *
 * The pitcher who finished the inning (pitched to the final at-bat of the inning)
 * the *same* inning that his team scored the go-ahead run is granted the win.
 */
function getWins(playerId: number, games: Games) {
  if (games.length === 0) return 0;
  const lastAtBats = games.map(game => game.atBats.at(-1));
  const pitchedLastAtBats = lastAtBats.filter(atBat => atBat?.pitcher === playerId);
  return pitchedLastAtBats.length;
}

/**
 * One loss granted per game.
 *
 * The pitcher who *gave up* the go-ahead run is credited with the loss.
 */
function getLosses(playerId: number, games: Games) {
  if (games.length === 0) return 0;
  const lastAtBats = games.map(game => game.atBats.at(-1));
  const pitcherTeam = games[0].atBats.find(atBat => atBat.pitcher === playerId)?.pitching_team;
  if (pitcherTeam === undefined) return 0;
  const opponentPitchedLastAtBats = lastAtBats.filter(atBat => atBat?.pitching_team !== pitcherTeam);
  return opponentPitchedLastAtBats.length;
}

/**
 * We forgot exactly how to calculate saves; for now, give everybody 0 saves
 * since I'm [Chuck] pretty sure nobody has got any in the last three years.
 */
function getSaves() {
  return 0;
}

/**
 * Increment once per `zone`.
 */
function getZones(plateAppearances: PlateAppearance[]) {
  return plateAppearances.filter(atBat => atBat.zone).length;
}

/**
 * Increment once per `strikeout`.
 */
function getStrikeouts(plateAppearances: PlateAppearance[]) {
  return plateAppearances.filter(atBat => atBat.strikeout).length;
}

/**
 * Increment once per `strikeout`, `tag`, `zone`, `flyout`, or `peg`.
 */
function getOuts(atBats: PlateAppearance[]) {
  return atBats.filter(atBat => atBat.strikeout || atBat.tag || atBat.zone || atBat.flyout || atBat.peg).length;
}

/**
 * `runs` / `outs`.
 */
function getRunsPerOut(plateAppearances: PlateAppearance[]) {
  const runs = getRuns(plateAppearances);
  const outs = getOuts(plateAppearances);
  if (outs === 0) return 0;
  return runs / outs;
}

/**
 * `onStakes` / `outs`.
 */
function getOutEfficiency(plateAppearances: PlateAppearance[]) {
  const onStakes = getOnStakes(plateAppearances);
  const outs = getOuts(plateAppearances);
  if (outs === 0) return 0;
  return onStakes / outs;
}

/**
 * Calculates pitcher stats for a given player based on the provided games.
 */
export function getPitcherStats(playerId: number, games: Games) {
  // Filter out games where the player did not pitch
  const pitcherGames = games.filter(game => game.atBats.some(atBat => atBat.pitcher === playerId));

  // Get all plate appearances where the player pitched
  const plateAppearances = pitcherGames.flatMap(game => game.atBats).filter(atBat => atBat.pitcher === playerId);

  const wins = getWins(playerId, pitcherGames);
  const losses = getLosses(playerId, pitcherGames);
  const saves = getSaves();
  const zones = getZones(plateAppearances);
  const strikeouts = getStrikeouts(plateAppearances);
  const runsPerOut = getRunsPerOut(plateAppearances);
  const outEfficiency = getOutEfficiency(plateAppearances);

  return {
    'Games': pitcherGames.length.toString(),
    'Wins': wins.toString(),
    'Losses': losses.toString(),
    'Saves': saves.toString(),
    'Zones': zones.toString(),
    'Strikeouts': strikeouts.toString(),
    'Runs Per Out': runsPerOut.toFixed(2),
    'Out Efficiency': outEfficiency.toFixed(2),
  };
}