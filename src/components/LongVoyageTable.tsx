import { Temporal } from "@js-temporal/polyfill";
import { getEta, stops } from "./stops";

export default function LongVoyageTable({ day1Pace, day2Pace, overnightPace, stopTime, showHazards }) {
  let etaStrings: string[];
  const recalculate = () => {
    const etasWithStops = getEta(stops, {day1: day1Pace, day2: day2Pace, overnight: overnightPace, stop: stopTime});
    etaStrings = etasWithStops.filter(stop => {
      const {offerings} = stop;
      if (showHazards) {
        return true;
      }
      return !offerings.includes('B');
    }).map((stop) => {
      const {name, offerings, distance, cutoff, eta} = stop;
      let classList = "";
      if (cutoff) {
        const before = Temporal.ZonedDateTime.compare(cutoff, eta);
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
          <td>{name}</td>
          <td>{offerings.map((a) => mappings[a]).join(" ")}</td>
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
