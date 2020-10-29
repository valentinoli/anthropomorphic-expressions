const setItem = (key, item) => window.localStorage.setItem(key, item);
const getItem = (key) => window.localStorage.getItem(key);

const setLatestCompletedStep = (path) => setItem('latestCompletedStep', path);
const getLatestCompletedStep = () => getItem('latestCompletedStep');

const setSubmitted = () => setItem('submitted', true);
const getSubmitted = () => getItem('submitted');

const clearStorage = () => window.localStorage.clear();

export {
  setItem,
  getItem,
  setLatestCompletedStep,
  getLatestCompletedStep,
  setSubmitted,
  getSubmitted,
  clearStorage,
};
