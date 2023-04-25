import HandWaving from "./handwaving";
export { HandWaving };




// const dsp = require("dsp.js");
// const convnetjs = require("convnetjs");
// //import { FFT } from "radiodsp";

// const sampleRate = 60;

// export interface Data {
//     data: Array<number[]>;
//     gesture: string;
//     fingerprint: string;
// }

// export default class HandWaving {
//     private windowSize: number;
//     private hopSize: number;
//     private computeFFT: boolean;
//     private fft: any;
//     private nUnits: number;
//     private nClasses: number;
//     private net: any;


//     constructor(windowSize = 128, hopSize = 64, computeFFT = true, nClasses = 10) {
//         this.windowSize = windowSize;
//         this.hopSize = hopSize;
//         this.computeFFT = computeFFT;
//         if (this.computeFFT) {
//             this.fft = new dsp.FFT(this.windowSize, sampleRate);
//             this.nUnits = 1.5 * this.windowSize;
//         }
//         else {
//             this.nUnits = 3 * this.windowSize;
//         }
//         this.nClasses = nClasses;
//         this.makeNet();
//     }

//     argmax(arr: number[]) {
//         let maxVal = 0;
//         let maxIdx = null;
//         // for (var i in arr) {
//         //     if (arr[i] > maxVal) {
//         //         maxIdx = i;
//         //         maxVal = arr[i]
//         //     }
//         // }
//         arr.forEach((val, idx) => {
//             if (val > maxVal) {
//                 maxIdx = idx;
//                 maxVal = val;
//             }
//         });
//         return maxIdx;
//     }

//     extractFeatures(dataFull: Data, gesture: number, maxPoints: number) {
//         let result = [];
//         let start = this.windowSize;
//         let data = dataFull.data;
//         let end = data.length - this.hopSize;

//         for (let i = 0; i < maxPoints; i += this.hopSize) {
//             let x: number[] = [], y: number[] = [], z: number[] = [];
//             let point: number[] = [];

//             for (var j = i; j < i + this.windowSize; j++) {
//                 let accel = data[j]!;
//                 x.push(accel[0]!); y.push(accel[1]!); z.push(accel[2]!);
//             }
//             if (this.computeFFT) {
//                 this.fft.forward(x);
//                 x = Array.prototype.slice.call(this.fft.spectrum);
//                 this.fft.forward(y);
//                 y = Array.prototype.slice.call(this.fft.spectrum);
//                 this.fft.forward(z);
//                 z = Array.prototype.slice.call(this.fft.spectrum);
//             }
//             point = point.concat(x);
//             point = point.concat(y);
//             point = point.concat(z);
//             result.push({ x: point, y: gesture });
//         }
//         return result
//     }

//     makeNet() {
//         let layer_defs = [];
//         this.net = new convnetjs.Net();
//         layer_defs.push({ type: 'input', out_sx: 1, out_sy: 1, out_depth: this.nUnits });
//         layer_defs.push({ type: 'fc', num_neurons: this.nUnits, activation: 'sigmoid' });
//         layer_defs.push({ type: 'softmax', num_classes: this.nClasses });
//         this.net.makeLayers(layer_defs);
//     }

//     loadNet(data: JSON) {
//         this.net = new convnetjs.Net();
//         this.net.fromJSON(data);
//     }

//     trainNet(trainingData: any, nIterations = 100) {
//         let perm = convnetjs.randperm(trainingData.length);
//         let trainer = new convnetjs.SGDTrainer(this.net, { momentum: 0.9, learning_rate: 0.01, batch_size: 50, l2_decay: 0.01 });
//         for (let k = 0; k < nIterations; k++) {
//             let loss = 0.0;
//             for (let i in trainingData) {
//                 let x = new convnetjs.Vol(trainingData[perm[i]]["x"]);
//                 let y = trainingData[perm[i]]["y"];
//                 let out = trainer.train(x, y);
//                 loss = loss + out.loss;
//             }
//             loss = loss / trainingData.length;
//             console.log(k + " " + loss);
//             perm = convnetjs.randperm(trainingData.length);
//         }
//         return this.net;
//     }

//     predict(dataPoint: any) {
//         let x = new convnetjs.Vol(dataPoint.x);
//         let result = this.net.forward(x, false);
//         return this.argmax(result.w);
//     }
// }


// export function add(a: number, b: number) {
//     return a + b;
// }

