import { Temporal } from "@js-temporal/polyfill";

export type Offering = "C" | "W" | "R" | "B";
export const startTime = Temporal.ZonedDateTime.from({
  year: 2021,
  month: 8,
  day: 20,
  hour: 17,
  minute: 0,
  timeZone: Temporal.TimeZone.from("America/Chicago"),
});

export const tomorrow = startTime.add({ days: 1 });
const nightTime = startTime.with({ hour: 20, minute: 42});
const morningTime = tomorrow.with({ hour: 6, minute: 11});

export const stops: [string, Offering[], number, Temporal.ZonedDateTime?][] = [
  ["Weeping Water", ["W", "C"], 54, startTime.with({ hour: 22 })],
  ["Slatted Bridge", ["B"], 73.6],
  ["Syracuse", ["W", "C"], 82],
  ["Adams", ["W"], 115.5],
  ["Beatrice", ["W", "C", "R"], 146.6],
  ["Slatted Bridge", ["B"], 158],
  ["Wilber", ["W", "C"], 175],
  ["Crete", ["W", "C", "R"], 188.2],
  ["Milford", ["W", "C"], 215.1],
  ["Seward", ["W", "C", "R"], 233.6],
  ["Valpariso", ["W", "C"], 267.7],
  ["GW Checkpoint", ["W", "R"], 277.7, tomorrow.with({ hour: 17 })],
  ["Finish", ["R"], 303, tomorrow.with({ hour: 23 })],
];

export type Paces = {
  day1: number,
  overnight: number,
  day2: number
};
const dayDelta = startTime.until(nightTime);
const totalHours = dayDelta.total({unit: "hours"})
const nightDelta = nightTime.until(morningTime);
const totalNightHours = nightDelta.total({unit: "hours"});

export const getEta = (distance: number, pace: Paces) => {
  // how far can you get by sundown?
  const dayDistance = totalHours * pace.day1;
  if (distance < dayDistance) {
    const hoursDelta = (distance / pace.day1).toPrecision(5);
    const eta = startTime.add(`PT${hoursDelta}H`);
    return eta;
  }

  const remainingDistance = distance - dayDistance;
  const nightDistance = totalNightHours * pace.overnight;
  if (remainingDistance < nightDistance) {
    const hoursDelta = (remainingDistance / pace.overnight).toPrecision(5);
    const eta = nightTime.add(`PT${hoursDelta}H`);
    return eta;
  }

  const finalDistance = remainingDistance - nightDistance;
  const hoursDelta = (finalDistance / pace.day2).toPrecision(5);
  const eta = morningTime.add(`PT${hoursDelta}H`);
  return eta;
};
