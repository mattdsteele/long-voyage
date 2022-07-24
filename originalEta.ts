export const getEta = (stop: Stop, pace: Paces, beginning = startTime): Temporal.ZonedDateTime => {
  const [, , distance] = stop;
  // how far can you get by sundown?
  const dayDistance = totalHours * pace.day1;
  if (distance < dayDistance) {
    const hoursDelta = (distance / pace.day1).toPrecision(5);
    const eta = beginning.add(`PT${hoursDelta}H`);
    return eta;
  }

  const remainingDistance = distance - dayDistance;
  const nightDistance = totalNightHours * pace.overnight;
  if (remainingDistance < nightDistance) {
    const hoursDelta = (remainingDistance / pace.overnight).toPrecision(5);
    const eta = nightTime.add(`PT${hoursDelta}H`);
    return eta;
  }

  const finalDistance = remainingDistance - nightDistance;
  const hoursDelta = (finalDistance / pace.day2).toPrecision(5);
  const eta = morningTime.add(`PT${hoursDelta}H`);
  return eta;
};