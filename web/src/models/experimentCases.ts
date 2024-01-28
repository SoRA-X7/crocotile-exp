export interface LinearCase {
  type: 'linear';
  width: number;
  dots: number;
  target: number;
  mode: number;
}

export const linearCases: LinearCase[] = [
  { type: 'linear', width: 800, dots: 10, target: 7, mode: 0 },
  { type: 'linear', width: 200, dots: 2, target: 2, mode: 0 },
  { type: 'linear', width: 300, dots: 3, target: 2, mode: 0 },
  { type: 'linear', width: 400, dots: 15, target: 5, mode: 0 },
  { type: 'linear', width: 600, dots: 20, target: 13, mode: 0 },
  { type: 'linear', width: 400, dots: 10, target: 4, mode: 0 },
  { type: 'linear', width: 600, dots: 20, target: 18, mode: 0 },
  { type: 'linear', width: 600, dots: 20, target: 16, mode: 0 },
  { type: 'linear', width: 600, dots: 20, target: 3, mode: 0 },
  { type: 'linear', width: 400, dots: 10, target: 8, mode: 0 },
  { type: 'linear', width: 800, dots: 10, target: 7, mode: 1 },
  { type: 'linear', width: 200, dots: 2, target: 2, mode: 1 },
  { type: 'linear', width: 300, dots: 3, target: 2, mode: 1 },
  { type: 'linear', width: 400, dots: 15, target: 5, mode: 1 },
  { type: 'linear', width: 600, dots: 20, target: 13, mode: 1 },
  { type: 'linear', width: 400, dots: 10, target: 4, mode: 1 },
  { type: 'linear', width: 600, dots: 20, target: 18, mode: 1 },
  { type: 'linear', width: 600, dots: 20, target: 16, mode: 1 },
  { type: 'linear', width: 600, dots: 20, target: 3, mode: 1 },
  { type: 'linear', width: 400, dots: 10, target: 8, mode: 1 }
];

function shuffle<T>(array: T[]): T[] {
  array = [...array];
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // 0 から i のランダムなインデックス
    [array[i], array[j]] = [array[j], array[i]]; // 要素を入れ替えます
  }
  return array;
}

export function randomizedCases() {
  return shuffle(linearCases);
}

export type ExperimentCase = LinearCase;

export interface ExperimentResult {
  case: ExperimentCase;
  time: number;
  overruns: number;
  undergoes: number;
}
