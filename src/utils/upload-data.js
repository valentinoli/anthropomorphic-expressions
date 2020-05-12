import putObject from './aws';
import { getItem, setItem, getRandomSequence } from './local-storage';

const stepError = (step) => new Error(`Step ${step} incomplete. Random sequence: ${getRandomSequence()}`);

export default async () => {
  const data = {
    video: {},
    survey: {},
  };

  const numbers = [1, 2, 3];

  numbers.forEach((num) => {
    const key = `video_${num}`;
    const item = getItem(key);
    if (!item) {
      throw stepError(key);
    }
    data.video[num] = JSON.parse(item);
  });

  numbers.forEach((num) => {
    const key = `survey_${num}`;
    const item = getItem(key);
    if (!item) {
      throw stepError(key);
    }
    data.survey[num] = JSON.parse(item);
  });

  const key = 'general';
  const generalInfo = getItem(key);
  if (!generalInfo) {
    throw stepError(key);
  }

  data.general = JSON.parse(generalInfo);

  const json = JSON.stringify(data);

  // Save data in local storage just in case
  setItem('data', json);

  // Upload to AWS S3
  const putResult = await putObject(json);
  return putResult;
};
