import putObject from './aws';
import { videos, surveys } from './steps';
import { getItem } from './local-storage';

export default async () => {
  const data = {
    video: {},
    survey: {},
  };

  videos.forEach((path) => {
    const item = getItem(path);
    if (!item) {
      throw new Error(`Step ${path} is incomplete.`);
    }
    const key = path.charAt(path.length - 1);
    data.video[key] = JSON.parse(item);
  });

  surveys.forEach((path) => {
    const item = getItem(path);
    if (!item) {
      throw new Error(`Step ${path} is incomplete.`);
    }
    const key = path.charAt(path.length - 1);
    data.survey[key] = JSON.parse(item);
  });

  // log the data just in case
  console.log(data);

  const json = JSON.stringify(data);
  const putResult = await putObject(json);
  return putResult;
};
