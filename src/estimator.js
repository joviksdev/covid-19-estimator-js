import computeNumberOfDays from './computation';

const covid19ImpactEstimator = inputData => {
  const {
    region,
    periodType,
    timeToElapse,
    reportedCases,
    population,
    totalHospitalBeds
  } = inputData;

  const data = {};
  const impact = {};
  const severeImpact = {};

  // Create properties to impcat and severeImpact and assign value to them

  impact.currentlyInfected = reportedCases * 10;
  severeImpact.currentlyInfected = reportedCases * 50;

  impact.infectionsByRequestedTime = computeNumberOfDays(
    impact.currentlyInfected,
    timeToElapse
  );

  severeImpact.infectionsByRequestedTime = computeNumberOfDays(
    severeImpact.currentlyInfected,
    timeToElapse
  );

  const output = {
    data,
    impact,
    severeImpact
  };

  return output;
};

export default covid19ImpactEstimator;
