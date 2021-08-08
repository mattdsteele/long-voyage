// Import stylesheets
import { useState } from 'preact/hooks';
import LongVoyageTable from "./LongVoyageTable";
import PaceSlider from "./PaceSlider";

export default function LongVoyage() {
  const [pace, setPace] = useState(10);
  const updatePace = p => setPace(p);

  return (
    <>
      <LongVoyageTable pace={pace} />
      <PaceSlider label={"Day 1 pace"} initialPace={13} onPace={updatePace} />
      <PaceSlider label={"Overnight pace"} initialPace={10} onPace={updatePace} />
      <PaceSlider label={"Day 2 pace"} initialPace={12} onPace={updatePace} />
    </>
  );
}
