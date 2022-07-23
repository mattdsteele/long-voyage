// Import stylesheets
import { useState } from 'preact/hooks';
import LongVoyageTable from "./LongVoyageTable";
import PaceSlider from "./PaceSlider";
import StopSlider from './StopSlider';

export default function LongVoyage() {
  const [day1Pace, setDay1Pace] = useState(12);
  const [overnightPace, setOvernightPace] = useState(11);
  const [day2Pace, setDay2Pace] = useState(10);
  const [stopTime, setStopTime] = useState(10);
  const [showHazards, setShowHazards] = useState(false);
  const onHazardVisibility = () => {
    setShowHazards(!showHazards);
  }
  return (
    <>
      <LongVoyageTable
        day1Pace={day1Pace}
        day2Pace={day2Pace}
        overnightPace={overnightPace}
        stopTime={stopTime}
        showHazards={showHazards}
      />
      <PaceSlider
        label={"Day 1 pace"}
        initialPace={day1Pace}
        onPace={setDay1Pace}
      />
      <PaceSlider
        label={"Overnight pace"}
        initialPace={overnightPace}
        onPace={setOvernightPace}
      />
      <PaceSlider
        label={"Day 2 pace"}
        initialPace={day2Pace}
        onPace={setDay2Pace}
      />
      <StopSlider
        label={"Minutes/Stop"}
        initialStopTime={stopTime}
        onStopTimeUpdate={setStopTime}
      />
      <div>
      <input
        type="checkbox"
        name="Hazards"
        id="Hazards"
        checked={showHazards}
        onClick={onHazardVisibility}
      />
      <label for="Hazards">Hazards: {showHazards ? 'true' : 'false'}</label>

      </div>
    </>
  );
}
