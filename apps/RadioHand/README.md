# Radiohand

A port of Handwaving

A Javascript library for detection of accelerometer gestures in smartphones. Detection is based on the magnitude spectrum of the accelerometer signals, which is fed into a neural network classifier. The library was developed for participatory music performance. For more information on the library and the context of the project, see:

G. Roma, A. Xambó and J.Freeman (2018). User-independent Accelerometer Gesture Recognition for Participatory Mobile Music. Journal of the Audio Engineering Society (JAES) .66 (6), pp. 430-438.

## Usage

The library can be used with the pre-trained network or to train a new one to detect new gesture dictionaries. A default dictionary of gestures is available in two datasets: "original" and "multiuser" (the latter was generated from more users and more consistently sampled across users, so it should generalize better).

Gestures reflect 7 classes of oscillatory movements: left / right , up / down, tilt, circles, forward / backwards, concave and convex. The expressjs web application in the webapp directory can be used to collect training data. Training is typically done offline by running the script train.js on nodejs. An example of detection is provided in example.js (needs to be browserified).

## Abstract

This paper discusses the use of AI and web browsers for live musical performance. The purpose of this project was to allow developers to more easily include these tools into their workflow using modern day web tools. This project used [Web Audio API](https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-onstatechange), [Device Orientation](https://developer.mozilla.org/en-US/docs/Web/API/Window/deviceorientation_event), [NPM](https://www.npmjs.com/) and [Typescript](https://www.typescriptlang.org/) with [ESModules](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/). The demonstration site was made with [TurboRepo](https://turbo.build/), [TailwindCSS](https://tailwindcss.com/) and [SvelteKit](https://kit.svelte.dev/). By doing so, the project is more accessible to the public.
