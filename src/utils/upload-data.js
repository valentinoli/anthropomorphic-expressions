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
    data.video[path] = item;
  });

  surveys.forEach((path) => {
    const item = getItem(path);
    if (!item) {
      throw new Error(`Step ${path} is incomplete.`);
    }
    data.survey[path] = item;
  });

  console.log(data);

  const json = JSON.stringify(data);
  const putResult = await putObject(json);
  return putResult;
};
