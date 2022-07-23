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

export const tomorrow = startTime.add({ days: 1 });
const nightTime = startTime.with({ hour: 20, minute: 47});
const morningTime = tomorrow.with({ hour: 6, minute: 11});

export const stops: [string, Offering[], number, Temporal.ZonedDateTime?][] = [
  ["Slatted Bridge", ["B"], 34.5],
  ["Syracuse", ["W", "C"], 51, startTime.with({ hour: 22 })],
  ["Van by the River", ["W"], 81.1],
  ["Pawnee City", ["W"], 109.4],
  ["Marysville", ["W", "C"], 153],
  ["Beatrice", ["W", "C", "R"], 198],
  ["Wilbur", ["W", "C"], 223.9],
  ["Crete", ["W", "C", "R"], 237.2],
  ["Malcom", ["W", "C"], 266, tomorrow.with({ hour: 19 })],
  ["GW Checkpoint", ["W", "R"], 277.7, tomorrow.with({ hour: 19 })],
  ["Finish", ["R"], 302.2, tomorrow.with({ hour: 23 })],
];

export type Paces = {
  day1: number,
  overnight: number,
  day2: number,
  stop?: number
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
