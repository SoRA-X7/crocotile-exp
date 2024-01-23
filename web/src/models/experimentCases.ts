export interface LinearCase {
  type: 'linear';
  width: number;
  dots: number;
  target: number;
}

export const linearCases: LinearCase[] = [
  { type: 'linear', width: 400, dots: 2, target: 2 },
  { type: 'linear', width: 800, dots: 3, target: 2 },
  { type: 'linear', width: 800, dots: 10, target: 7 },
  { type: 'linear', width: 800, dots: 30, target: 13 },
  { type: 'linear', width: 400, dots: 10, target: 4 }
];

export type ExperimentCase = LinearCase;

export interface ExperimentResult {
  case: ExperimentCase;
  time: number;
  overruns: number;
  undergoes: number;
}
