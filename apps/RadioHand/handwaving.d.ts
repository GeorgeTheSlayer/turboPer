//declare function require(path: string): any;

declare class HandWaving {
  constructor(
    windowSize: number,
    hopSize: number,
    computeFFT: boolean,
    nClasses: number
  );
  argmax(arr: number[]): number;
  extractFeatures(data: Idataset, gesture: string, maxPoints: number): features;
  makeNet(): void;
  loadNet(data: any): void;
  trainNet(trainingData: any, nIterations: number);
  predict(features: features): string;
  // ...
}

declare type features = {
  x: number[];
  y: number;
};

declare type Idataset = {
  data: Array<number[]>;
  gesture: string;
  fingerprint: string;
};

export = HandWaving;
// export = features
// export = Idataset
