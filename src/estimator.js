import {
  normaliseDuration,
  infectedEstimation,
  percentEstimate
} from './computation';

const covid19ImpactEstimator = (data) => {
  const {
    region, periodType, timeToElapse, reportedCases, totalHospitalBeds
  } = data;

  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;

  const impact = {};
  const severeImpact = {};
  // Initialize normalise duration
  const normaliseTime = normaliseDuration(timeToElapse, periodType);
  impact.currentlyInfected = reportedCases * 10;
  severeImpact.currentlyInfected = reportedCases * 50;

  // Set properties of Impact and SevereImpact
  impact.infectionsByRequestedTime = infectedEstimation(
    impact.currentlyInfected,
    normaliseTime
  );

  severeImpact.infectionsByRequestedTime = infectedEstimation(
    severeImpact.currentlyInfected,
    normaliseTime
  );

  impact.severeCasesByRequestedTime = percentEstimate(
    0.15,
    impact.infectionsByRequestedTime
  );
  severeImpact.severeCasesByRequestedTime = percentEstimate(
    0.15,
    impact.infectionsByRequestedTime
  );

  // Percentage value of Total Hospital Bed

  impact.hospitalBedsByRequestedTime = impact.severeCasesByRequestedTime
  - percentEstimate(0.35, totalHospitalBeds);

  severeImpact.hospitalBedsByRequestedTime = severeImpact.severeCasesByRequestedTime
  - percentEstimate(0.35, totalHospitalBeds);

  impact.casesForICUByRequestedTime = percentEstimate(
    0.05,
    impact.infectionsByRequestedTime
  );

  severeImpact.casesForICUByRequestedTime = percentEstimate(
    0.05,
    severeImpact.infectionsByRequestedTime
  );

  impact.casesForVentilatorsByRequestedTime = percentEstimate(
    0.02,
    impact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = percentEstimate(
    0.02,
    severeImpact.infectionsByRequestedTime
  );

  const dollarsInFlight = {};

  const averageIncome = avgDailyIncomeInUSD / 100;

  const impactIncome = (impact.infectionsByRequestedTime
  * averageIncome * avgDailyIncomePopulation) / normaliseTime;
  dollarsInFlight.impact = impactIncome.toFixed(2);

  const severeImpactIncome = (severeImpact.infectionsByRequestedTime * averageIncome
    * avgDailyIncomeInUSD) / normaliseTime;
  dollarsInFlight.severeImpact = severeImpactIncome.toFixed(2);

  return {
    data,
    impact,
    severeImpact,
    dollarsInFlight
  };
};

export default covid19ImpactEstimator;
