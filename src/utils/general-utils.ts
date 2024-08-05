// Given a num N, return [0, 1, 2, ..., N - 1]
export const createArrayFromNum = (num: number): number[] => {
  const res = [];
  for (let i = 0; i < num; i++) {
    res.push(i);
  }
  return res;
};
