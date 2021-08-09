// Import stylesheets
import { useState } from 'preact/hooks';
import LongVoyageTable from "./LongVoyageTable";
import PaceSlider from "./PaceSlider";

export default function LongVoyage() {
  const [day1Pace, setDay1Pace] = useState(12);
  const [overnightPace, setOvernightPace] = useState(11);
  const [day2Pace, setDay2Pace] = useState(10);
  return (
    <>
      <LongVoyageTable day1Pace={day1Pace} day2Pace={day2Pace} overnightPace={overnightPace} />
      <PaceSlider label={"Day 1 pace"} initialPace={day1Pace} onPace={setDay1Pace} />
      <PaceSlider label={"Overnight pace"} initialPace={overnightPace} onPace={setOvernightPace} />
      <PaceSlider label={"Day 2 pace"} initialPace={day2Pace} onPace={setDay2Pace} />
    </>
  );
}
