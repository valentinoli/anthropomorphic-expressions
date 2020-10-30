import steps from './steps';

const stepsKeys = Object.keys(steps);

export default (step) => {
  const index = stepsKeys.indexOf(step);
  if (index !== -1 && stepsKeys.length > index + 1) {
    return stepsKeys[index + 1];
  }
  return null;
};
