import putObject from './aws';
import { getItem, setItem } from './local-storage';

export default async () => {
  const data = {
    video: {},
    survey: {},
  };

  const numbers = [1, 2, 3];

  numbers.forEach((num) => {
    const item = getItem(`video_${num}`);
    if (!item) {
      throw new Error('Some step was not completed');
    }
    data.video[num] = JSON.parse(item);
  });

  numbers.forEach((num) => {
    const item = getItem(`survey_${num}`);
    if (!item) {
      throw new Error('Some step was not completed');
    }
    data.survey[num] = JSON.parse(item);
  });

  const json = JSON.stringify(data);

  // Save data in local storage just in case
  setItem('data', json);

  // Upload to AWS S3
  const putResult = await putObject(json);
  return putResult;
};
