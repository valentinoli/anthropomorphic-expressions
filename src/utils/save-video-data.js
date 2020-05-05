
export default async (/* { results, timestamps } */) => {
  const i = await ((x) => new Promise((resolve) => resolve(x)))(10);
  console.log(i);
};
