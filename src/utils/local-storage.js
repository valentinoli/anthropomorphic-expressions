const setItem = (key, item) => window.localStorage.setItem(key, item);
const getItem = (key) => window.localStorage.getItem(key);

const setLatestCompletedStep = (path) => setItem('latestCompletedStep', path);
const getLatestCompletedStep = () => getItem('latestCompletedStep');

const setSubmitted = () => setItem('submitted', true);
const getSubmitted = () => getItem('submitted');

const setRandomSequence = (sequence) => setItem('randomSequence', JSON.stringify(sequence));
const getRandomSequence = () => JSON.parse(getItem('randomSequence'));

const clearStorage = () => window.localStorage.clear();

export {
  setItem,
  getItem,
  setLatestCompletedStep,
  getLatestCompletedStep,
  setSubmitted,
  getSubmitted,
  setRandomSequence,
  getRandomSequence,
  clearStorage,
};
