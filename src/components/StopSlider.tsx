import { useState } from 'preact/hooks';

export default function StopSlider({ onStop, initialStopTime = 10, label }) {
  const [stopTime, setStopTime] = useState(initialStopTime);
  const onStopTimeUpdate = (event) => {
    setStopTime(event.target.value);
    if (onStop) {
      onStop(event.target.value);
    }
  }

  return (
    <div style={{display: 'flex', minHeight: '28px', alignItems: 'center'}}>
    <label for={label} style={{width: '150px'}}>{label}:</label>
    <input
    style={{flexGrow: 1}}
        type="range"
        min="5"
        max="30"
        value={stopTime}
        onInput={onStopTimeUpdate}
        id={label}
        name={label}
        step="1"
      />
    <span class="current-pace" style={{flexBasis: '4ch', textAlign: 'right'}}>{stopTime}</span>
    </div>
  );
}
