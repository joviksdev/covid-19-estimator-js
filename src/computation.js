// Normalise the duration in day
const normaliseDuration = (time, periodType) => {
  switch (periodType) {
    case 'months':
      return time * 30;

    case 'weeks':
      return time * 7;

    default:
      return time;
  }
};

const infectedEstimation = (infected, time) => {
  // currentlyInfected as value is doubles every 3 days

  // Number of set in a day (fators)
  const factor = Math.round(time / 3);
  return infected * 2 ** factor;
};

const percentEstimate = (percent, value) => Math.floor(percent * value);

export { normaliseDuration, infectedEstimation, percentEstimate };
