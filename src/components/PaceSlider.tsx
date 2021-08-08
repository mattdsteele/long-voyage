import { useState } from 'preact/hooks';

export default function PaceSlider({ onPace, initialPace = 10, label }) {
  const [pace, setPace] = useState(initialPace);
  const onPaceUpdate = (event) => {
    setPace(event.target.value);
    if (onPace) {
      onPace(event.target.value);
    }
  }

  return (
    <div style={{display: 'flex'}}>
    <label for={label} style={{width: '150px'}}>{label}:</label>
    <input
    style={{flexGrow: 1}}
        type="range"
        min="9"
        max="15"
        value={pace}
        onInput={onPaceUpdate}
        id={label}
        name={label}
        step="0.1"
      />
    <span class="current-pace">{pace}</span>
    </div>
  );
}
