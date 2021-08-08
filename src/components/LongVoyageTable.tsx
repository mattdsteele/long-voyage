import { Temporal } from "@js-temporal/polyfill";

export default function LongVoyageTable({ pace }) {
  const startTime = Temporal.ZonedDateTime.from({
    year: 2021,
    month: 8,
    day: 20,
    hour: 17,
    minute: 0,
    timeZone: Temporal.TimeZone.from("America/Chicago"),
  });
  const tomorrow = startTime.add({ days: 1 });

  type Offering = "C" | "W" | "R" | "B";
  const stops: [string, Offering[], number, Temporal.ZonedDateTime?][] = [
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

  let etaStrings: string[];
  const recalculate = () => {
    etaStrings = stops.map((stop) => {
      const [location, availability, distance, threshold] = stop;
      const hoursDelta = (distance / pace).toPrecision(5);
      const eta = startTime.add(`PT${hoursDelta}H`);
      let classList = "";
      if (threshold) {
        const before = Temporal.ZonedDateTime.compare(threshold, eta);
        classList = before === -1 ? "past-threshold" : "";
      }
      const f = new Intl.DateTimeFormat("en-us", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const mappings = {
        W: "🥤",
        C: "⛽",
        R: "🍽️",
        B: "⚠️",
      };
      const etahhmm = f.format(eta.toInstant().epochMilliseconds);
      return (
        <tr class={classList}>
          <td>{distance}</td>
          <td>{location}</td>
          <td>{availability.map((a) => mappings[a]).join(" ")}</td>
          <td>{etahhmm}</td>
        </tr>
      );
    });
  };

  recalculate();
  return (
    <table>
      <thead>
        <tr>
          <th>Mile</th>
          <th>Location</th>
          <th>Offering</th>
          <th>ETA</th>
        </tr>
      </thead>
      <tbody>{etaStrings}</tbody>
    </table>
  );
}
