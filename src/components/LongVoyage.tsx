// Import stylesheets
import { useState } from 'preact/hooks';
import LongVoyageTable from "./LongVoyageTable";
import PaceSlider from "./PaceSlider";
import StopSlider from './StopSlider';

export default function LongVoyage() {
  const [day1Pace, setDay1Pace] = useState(13);
  const [overnightPace, setOvernightPace] = useState(10.5);
  const [day2Pace, setDay2Pace] = useState(12);
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
        onStop={setStopTime}
      />
      <div style={{
        // display: "flex",
        // No hazards this year
        display: "none",
        position: "absolute",
        top: "12px",
        right: "24px"
      }}>
        <label for="Hazards" style={{paddingRight: "4px"}}>Hazards</label>
        <input
          type="checkbox"
          name="Hazards"
          id="Hazards"
          checked={showHazards}
          onClick={onHazardVisibility}
        />
      </div>
    </>
  );
}
