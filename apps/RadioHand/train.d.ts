// declare function require(name: string);
// var fs = require("fs");
// var glob = require("glob");
// var HandWaving = require("./handwaving");

declare function extractFoldDataset(foldNum: number, nFolds: number, dataset: Idataset): Idataset;
declare function predict(dataset: Idataset, confusion: any): number;


declare type Idataset = {
    data: Array<number[]>,
    gesture: string,
    fingerprint: string,
}