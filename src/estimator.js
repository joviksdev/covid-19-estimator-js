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
  } = inputData;

  const impact = {};
  const severeImpact = {};

  // Initialize normalise duration

  const normaliseTimeElapse = normaliseDuration(timeToElapse, periodType);

  impact.currentlyInfected = reportedCases * 10;
  severeImpact.currentlyInfected = reportedCases * 50;

  impact.infectionsByRequestedTime = infectedEstimation(
    impact.currentlyInfected,
    normaliseTimeElapse
  );

  severeImpact.infectionsByRequestedTime = infectedEstimation(
    severeImpact.currentlyInfected,
    normaliseTimeElapse
  );

  impact.severeCasesByRequestedTime = percentEstimate(
    0.15,
    impact.infectionsByRequestedTime
  );

  severeImpact.severeCasesByRequestedTime = percentEstimate(
    0.15,
    impact.infectionsByRequestedTime
  );

  impact.hospitalBedsByRequestedTime =
    percentEstimate(0.35, totalHospitalBeds) -
    impact.severeCasesByRequestedTime;

  severeImpact.hospitalBedsByRequestedTime =
    percentEstimate(0.35, totalHospitalBeds) -
    impact.severeCasesByRequestedTime;

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

  dollarsInFlight.impact =
    impact.infectionsByRequestedTime *
    avgDailyIncomePopulation *
    avgDailyIncomeInUSD *
    normaliseTimeElapse;

  dollarsInFlight.severeImpact =
    severeImpact.infectionsByRequestedTime *
    avgDailyIncomePopulation *
    avgDailyIncomeInUSD *
    normaliseTimeElapse;

  const output = {
    data,
    impact,
    severeImpact
  };

  return { ...output, dollarsInFlight };
};

export default covid19ImpactEstimator;
