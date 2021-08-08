import { useState } from 'preact/hooks';

export default function PaceSlider({ onPace }) {
  const [pace, setPace] = useState(10);
  const onPaceUpdate = (event) => {
    setPace(event.target.value);
    if (onPace) {
      onPace(event.target.value);
    }
  }

  return (
    <>
    <label for="pace">Average pace (mph):</label>
    <input
        type="range"
        min="9"
        max="15"
        value={pace}
        onInput={onPaceUpdate}
        id="pace"
        name="pace"
        step="0.1"
      />
    <span class="current-pace">{pace}</span>
    </>
  );
}
