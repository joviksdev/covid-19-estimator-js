import {
  normaliseDuration,
  infectedEstimation,
  percentEstimate
} from './computation';

const covid19ImpactEstimator = (data) => {
  const {
    region,
    periodType,
    timeToElapse,
    reportedCases,
    population,
    totalHospitalBeds
  } = data;

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

  const percentOfValue = percentEstimate(0.35, totalHospitalBeds);

  impact.hospitalBedsByRequestedTime = percentOfValue - impact.severeCasesByRequestedTime;

  severeImpact.hospitalBedsByRequestedTime = percentOfValue - severeImpact.severeCasesByRequestedTime;

  impact.casesForICUByRequestedTime = percentEstimate(
    0.05,
    impact.infectionsByRequestedTime
  );
  severeImpact.casesForICUByRequestedTime = percentEstimate(
    0.05,
    impact.infectionsByRequestedTime
  );
  impact.casesForVentilatorsByRequestedTime = percentEstimate(
    0.02,
    impact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = percentEstimate(
    0.02,
    impact.infectionsByRequestedTime
  );

  const dollarsInFlight = {};
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;

  dollarsInFlight.impact = impact.infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD * normaliseTime;

  dollarsInFlight.severeImpact = severeImpact.infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD * normaliseTime;

  console.log('welcome');

   return { data, impact, severeImpact, dollarsInFlight };
};

export default covid19ImpactEstimator;
