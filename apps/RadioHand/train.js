const fs = require("fs");
const glob = require("glob");
const HandWaving = require("./handwaving");

const gestures = [
    "left_right",
    "up_down",
    "tilt",
    "circles",
    "forward_backwards",
    "concave",
    "convex"];


//const dataPath = "./datasets/original/";
//const maxPoints = 800;

// use multi-user dataset
// TODO: add stratified training code 
const dataPath = "./datasets/multiuser/";
const maxPoints = 500;


let handWaving = new HandWaving(128, 64, true, gestures.length);

function extractFoldDataset(foldNum, nFolds, dataset) {
    for (let c in gestures) {
        let dir = dataPath + gestures[c];
        let files = fs.readdirSync(dir);
        console.log(dir);
        for (let i = 0; i < nFolds; i++) {
            console.log(dir + "/" + files[i]);
            let data = fs.readFileSync(dir + "/" + files[i]);
            let recording = JSON.parse(data);
            let features = handWaving.extractFeatures(recording["data"], parseInt(c), maxPoints);
            if (i == foldNum)
                dataset.test = dataset.test.concat(features);
            else
                dataset.train = dataset.train.concat(features);
        }
    }
    return dataset;
}

function predict(dataset, confusion) {
    let nCorrect = 0;
    let classCorrect = new Array(gestures.length).fill(0);

    for (let i in dataset.test) {
        let testPoint = dataset.test[i];
        let y = testPoint.y;
        let prediction = handWaving.predict(testPoint);
        confusion[y][prediction]++;
        if (prediction == y) {
            nCorrect++;
            classCorrect[y]++;
        }
    }
    let accuracy = nCorrect / dataset.test.length;
    console.log("Accuracy ", accuracy, nCorrect, dataset.test.length);
    return accuracy;
};

let accuracies = [];
let nFolds = 10;

let confusion = [];
for (let i in gestures) {
    confusion[i] = [];
    for (let j in gestures) {
        confusion[i][j] = 0;
    }
}

for (let i = 0; i < nFolds; i++) {
    dataset = { train: [], test: [] };
    dataset = extractFoldDataset(i, nFolds, dataset);
    handWaving.trainNet(dataset.train, 100);
    accuracies.push(predict(dataset, confusion));
}
let average = accuracies.reduce(function (a, b) { return a + b }) / nFolds;
let diffs = accuracies.map(function (value) { return Math.abs(value - average); });
let std = diffs.reduce(function (a, b) { return a + b }) / nFolds;

console.log("-----------------");
console.log(accuracies);
console.log("Mean accuracy", average);
console.log("Standard deviation", std);
console.log(confusion);
console.log("-----------------");

fs.writeFile('nnet.json', JSON.stringify(handWaving.net.toJSON()));
