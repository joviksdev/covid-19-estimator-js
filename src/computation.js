const computeNumberOfDays = (value, days) => {
  // currentlyInfected as value is doubles every 3 days

  // Number of set in a day (fators)
  const factor = Math.round(days / 3);

  return value * Math.pow(2, factor);
};

export default computeNumberOfDays;
