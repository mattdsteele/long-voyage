import { Temporal } from "@js-temporal/polyfill";
import { getEta, stops } from "./stops";

export default function LongVoyageTable({ day1Pace, day2Pace, overnightPace, stopTime }) {
  let etaStrings: string[];
  const recalculate = () => {
    etaStrings = stops.map((stop) => {
      const [location, availability, distance, threshold] = stop;
      const eta = getEta(distance, {day1: day1Pace, day2: day2Pace, overnight: overnightPace});
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
