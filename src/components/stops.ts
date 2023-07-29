import { Temporal } from "@js-temporal/polyfill";

// C-store, Water, Restaurant, Bridge
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
  ["Weeping Water", ["W", "C"], 46.7, startTime.with({ hour: 22 })],
  ["Pacific Junction", ["W", "C"], 79.9],
  ["Glenwood", ["W", "C"], 84.2],
  ["Treynor (Van by the River)", ["W"], 109, paceTomorrow.with({ hour: 4 })],
  ["Missouri Valley", ["W", "C", "R"], 151.6],
  ["Blair", ["W", "C"], 166.5],
  ["Arlington", ["W", "C"], 188.2],
  ["Valley", ["W", "C"], 202.4],
  ["Valpariso", ["W", "C"], 245.7, paceTomorrow.with({ hour: 21 })],
  ["GW Checkpoint", ["W"], 261, paceTomorrow.with({ hour: 19 })],
  ["Finish", ["R"], 303.4, paceTomorrow.with({ hour: 23 })],
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
  const tomorrow = startTime.add({ days: 1 }).with({ hour: 0, minute: 0 });
  const farFuture = tomorrow.add({ years: 10 })

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
