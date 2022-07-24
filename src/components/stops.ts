import { Temporal } from "@js-temporal/polyfill";

export type Offering = "C" | "W" | "R" | "B";
export const startTime = Temporal.ZonedDateTime.from({
  year: 2022,
  month: 8,
  day: 19,
  hour: 17,
  minute: 0,
  timeZone: Temporal.TimeZone.from("America/Chicago"),
});

export const paceTomorrow = startTime.add({ days: 1 });

export type Stop = [string, Offering[], number, Temporal.ZonedDateTime?];
type StopWithEta = {
  name: string,
  offerings: Offering[],
  distance: number,
  cutoff?: Temporal.ZonedDateTime,
  eta: Temporal.ZonedDateTime
}

export const stops: Stop[] = [
  ["Slatted Bridge", ["B"], 34.5],
  ["Slatted Bridge", ["B"], 39.0],
  ["Slatted Bridge", ["B"], 40.0],
  ["Slatted Bridge", ["B"], 47.3],
  ["Syracuse", ["W", "C"], 51, startTime.with({ hour: 22 })],
  ["Slatted Bridge", ["B"], 64],
  ["Van by the River", ["W"], 81.1],
  ["Slatted Bridge", ["B"], 97.7],
  ["Slatted Bridge", ["B"], 101.7],
  ["Pawnee City", ["W"], 109.4],
  ["Slatted Bridge", ["B"], 129.3],
  ["Marysville", ["W", "C"], 153],
  ["Beatrice", ["W", "C", "R"], 198],
  ["Slatted Bridge", ["B"], 208.8],
  ["Slatted Bridge", ["B"], 211.9],
  ["Slatted Bridge", ["B"], 215.7],
  ["Slatted Bridge", ["B"], 219.9],
  ["Wilbur", ["W", "C"], 223.9],
  ["Crete", ["W", "C", "R"], 237.2],
  ["Malcom", ["W", "C"], 266, paceTomorrow.with({ hour: 19 })],
  ["GW Checkpoint", ["W", "R"], 277.7, paceTomorrow.with({ hour: 19 })],
  ["Finish", ["R"], 302.2, paceTomorrow.with({ hour: 23 })],
];

export type Paces = {
  day1: number,
  overnight: number,
  day2: number,
  stop?: number
};

const nightStart = startTime.with({ hour: 20, minute: 47 });
const morningStart = paceTomorrow.with({ hour: 6, minute: 11 });

export const getEta = (
  sentStops = stops,
  pace: Paces,
  beginning = startTime,
  nightTime = nightStart,
  morningTime = morningStart
): StopWithEta[] => {
  let stopsWithEtas: StopWithEta[] = [];

  // Basic calculations
  const tomorrow = startTime.add({ days: 1 }).with({hour: 0, minute: 0});
  const farFuture = tomorrow.add({years: 10})

  // State values
  let paceIndex = 0;
  let paces = [pace.day1, pace.overnight, pace.day2];
  let thresholds = [nightTime, morningTime, farFuture];

  let workingEta = beginning;
  let workingDistance = 0;
  let workingPace = paces[paceIndex];
  let nextThreshold = thresholds[paceIndex];

  for (const stop of sentStops) {
    const [name, offerings, distance, cutoff] = stop;
    
    let valueFound = false;
    while (!valueFound) {
      // how far at the current pace to the next threshold?
      const distanceToNext = distance - workingDistance;
      let durationToNextThreshold = workingEta.until(nextThreshold);
      const hoursDelta = (distanceToNext / workingPace).toPrecision(5);
      const durationAtCurrentPace = Temporal.Duration.from(`PT${hoursDelta}H`);
      const willMakeNextThreshold = Temporal.Duration.compare(
        durationAtCurrentPace,
        durationToNextThreshold
      );

      if (willMakeNextThreshold !== -1) {
        // Ride to the threshold, and set new values
        const hoursUntilNextThreshold =
          durationToNextThreshold.hours + durationToNextThreshold.minutes / 60;
        const distanceUntilNextThreshold =
          workingPace * hoursUntilNextThreshold;

        workingEta = nextThreshold;
        workingDistance += distanceUntilNextThreshold;

        paceIndex++;
        workingPace = paces[paceIndex];
        nextThreshold = thresholds[paceIndex];
      } else {
        let stopEta = workingEta.add(`PT${hoursDelta}H`).round("minute");
        // if (stopToCheck === stop) {
        //   return stopEta;
        // }
        stopsWithEtas.push({ name, distance, offerings, cutoff, eta: stopEta });
        // Add stop time if not a bridge
        if (!offerings.includes("B")) {
          stopEta = stopEta.add({ minutes: pace.stop }).round("minute");
        }

        // Update stop values
        workingEta = stopEta;
        workingDistance = distance;
        valueFound = true;
      }
    }
  }
  return stopsWithEtas;
};
