<script lang="ts">
	//import { add } from 'radiohand';
	import { onMount } from 'svelte';
	import { HandWaving } from 'radiohand';
	import { Howl, Howler } from 'howler';
	import layers from './nnet.json';
	import '../app.css';

	const gestures = [
		'left_right',
		'up_down',
		'tilt',
		'circles',
		'forward_backwards',
		'concave',
		'convex'
	];

	const textGestures = ['Left Right', 'Up Down', 'Tilt', 'Circles', 'F to B ', 'Concave', 'Convex'];

	const windowSize = 128;
	const sampleRate = 60;
	let sampleBuff = [];
	let currentGesture = 4;
	let isStarted = false;
	let turboMode = false;

	const handWaving = new HandWaving(windowSize, windowSize / 2, true, gestures.length);
	const sounds = [
		new Howl({ src: ['/clap.mp3'] }),
		new Howl({ src: ['/cow.mp3'] }),
		new Howl({ src: ['/rim.mp3'] }),
		new Howl({ src: ['/bongo.mp3'] }),
		new Howl({ src: ['/crash.mp3'] }),
		new Howl({ src: ['/shaker.mp3'] }),
		new Howl({ src: ['/yeah.mp3'] })
	];

	$: {
		console.log(currentGesture);
		let newGest = currentGesture;
		if (turboMode && currentGesture === 3) {
			newGest = Math.floor(Math.random() * 7);
		}

		sounds[newGest].play();
	}

	function loadNN() {
		handWaving.loadNet(layers);
	}

	//Helper Class
	interface accelerometer {
		x: number;
		y: number;
		z: number;
		lastY: number;
		lastX: number;
		lastZ: number;
	}

	let withoutGrav: accelerometer = {
		x: 0,
		y: 0,
		z: 0,
		lastY: 0,
		lastX: 0,
		lastZ: 0
	};

	let withGrav: accelerometer = {
		x: 0,
		y: 0,
		z: 0,
		lastY: 0,
		lastX: 0,
		lastZ: 0
	};

	let isRound = true;
	//Console Log For mobile Devices
	let text = 'Ready to Start';
	function setValues(e: DeviceMotionEvent, accel: accelerometer, grav = false) {
		if (grav) {
			accel.x = e.accelerationIncludingGravity.x;
			accel.y = e.accelerationIncludingGravity.y;
			accel.z = e.accelerationIncludingGravity.z;
		} else {
			accel.x = e.acceleration.x;
			accel.y = e.acceleration.y;
			accel.z = e.acceleration.z;
		}
		if (accel.lastY < accel.y) {
			accel.lastY = accel.y;
		}
		if (accel.lastX < accel.x) {
			accel.lastX = accel.x;
		}
		if (accel.lastZ < accel.z) {
			accel.lastZ = accel.z;
		}
		if (isRound) {
			accel.x = Math.round(accel.x);
			accel.y = Math.round(accel.y);
			accel.z = Math.round(accel.z);
			accel.lastX = Math.round(accel.lastX);
			accel.lastY = Math.round(accel.lastY);
			accel.lastZ = Math.round(accel.lastZ);
		}
	}
	//Where the event is Handled
	function handleMotionEvent(event: DeviceMotionEvent) {
		//Helper Functions
		withGrav.x = event.accelerationIncludingGravity.x;
		withoutGrav.x = event.acceleration.x;
		setValues(event, withoutGrav, false);
		setValues(event, withGrav, true);
		setWaiving(withGrav);
	}

	function setWaiving(accel: accelerometer) {
		sampleBuff.push([accel.x, accel.y, accel.z]);
		if (sampleBuff.length > windowSize) {
			sampleBuff.shift();
			let features = handWaving.extractFeatures(sampleBuff, 1, 1);
			let gestures = handWaving.predict(features[0]);
			currentGesture = parseInt(gestures);
		}
	}

	//Reset Values
	function reset() {
		withoutGrav.lastY = 0;
		withoutGrav.lastX = 0;
		withoutGrav.lastZ = 0;
		withGrav.lastY = 0;
		withGrav.lastX = 0;
		withGrav.lastZ = 0;
	}
	//On Click Init
	//Request Permission is needed for IOS Devices.
	//TODO: Test on Android
	function onClick() {
		loadNN();
		if (typeof DeviceOrientationEvent.requestPermission === 'function') {
			DeviceOrientationEvent.requestPermission()
				.then((response) => {
					if (response == 'granted') {
						window.addEventListener('devicemotion', handleMotionEvent, true);
						text = 'Started';
					}
				})
				.catch(console.error);
		} else {
			window.addEventListener('devicemotion', handleMotionEvent, true);
		}
		isStarted = true;
	}
</script>

<body
	class="grid grid-col-1 justify-center align-middle items-center mt-20 mx-auto h-full font-sans text-7xl"
>
	<h1 class="text-current tracking-tighter font-bold">
		<button
			on:click={() => (turboMode = !turboMode)}
			class={turboMode ? 'text-rose-500' : 'text-black'}
		>
			RadioHand
		</button>
	</h1>
	<!-- <h2>{text}</h2>  -->
	<!--	<div style="display: flex; white-space: nowrap; overflow: hidden;">-->
	<!--		<div>-->
	<!--			<h1>With Gravity</h1>-->
	<!--			<p>X: {withoutGrav.x}</p>-->
	<!--			<p>Highest: {withoutGrav.lastX}</p>-->
	<!--			<p>Y: {withoutGrav.y}</p>-->
	<!--			<p>Highest: {withoutGrav.lastY}</p>-->
	<!--			<p>Z: {withoutGrav.z}</p>-->
	<!--			<p>Highest: {withoutGrav.lastZ}</p>-->
	<!--		</div>-->
	<!--		<div>-->
	<!--			<h1>Without Gravity</h1>-->
	<!--			<p>X: {withGrav.x}</p>-->
	<!--			<p>Highest: {withGrav.lastX}</p>-->
	<!--			<p>Y: {withGrav.y}</p>-->
	<!--			<p>Highest: {withGrav.lastY}</p>-->
	<!--			<p>Z: {withGrav.z}</p>-->
	<!--			<p>Highest: {withGrav.lastZ}</p>-->
	<!--		</div>-->
	<!--	</div>-->
	<div class="border-2 border-black mt-4">
		<div class="w-full h-full">
			{#if isStarted}
				{#if currentGesture === 0}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon icon-tabler icon-tabler-arrows-up-down w-full h-full"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M7 3l0 18" />
						<path d="M10 6l-3 -3l-3 3" />
						<path d="M20 18l-3 3l-3 -3" />
						<path d="M17 21l0 -18" />
					</svg>
				{:else if currentGesture === 1}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon icon-tabler icon-tabler-arrows-right-left w-full h-full"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M21 7l-18 0" />
						<path d="M18 10l3 -3l-3 -3" />
						<path d="M6 20l-3 -3l3 -3" />
						<path d="M3 17l18 0" />
					</svg>
				{:else if currentGesture === 2}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon icon-tabler icon-tabler-hand-move w-full h-full"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5" />
						<path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0v2.5" />
						<path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5" />
						<path
							d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7l-.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47"
						/>
						<path d="M2.541 5.594a13.487 13.487 0 0 1 2.46 -1.427" />
						<path d="M14 3.458c1.32 .354 2.558 .902 3.685 1.612" />
					</svg>
				{:else if currentGesture === 3}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon icon-tabler icon-tabler-rotate-dot w-full h-full"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5" />
						<path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
					</svg>
				{:else if currentGesture === 4}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon icon-tabler icon-tabler-arrows-exchange-2 w-full h-full"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M17 10h-14l4 -4" />
						<path d="M7 14h14l-4 4" />
					</svg>
				{:else if currentGesture === 5}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon icon-tabler icon-tabler-corner-left-down-double w-full h-full"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M18 4h-6a3 3 0 0 0 -3 3v7" />
						<path d="M13 10l-4 4l-4 -4m8 5l-4 4l-4 -4" />
					</svg>
				{:else if currentGesture === 6}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon icon-tabler icon-tabler-share-3 w-full h-full"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path
							d="M13 4v4c-6.575 1.028 -9.02 6.788 -10 12c-.037 .206 5.384 -5.962 10 -6v4l8 -7l-8 -7z"
						/>
					</svg>
				{:else}
					<p>Error</p>
				{/if}
			{:else}
				<button on:click={onClick} class="w-full h-full">Click</button>
			{/if}
		</div>
	</div>
	<h1 class="text-7xl text-current text-center mt-4 tracking-wider text-gray-500 font-light">
		{textGestures[currentGesture]}
	</h1>
</body>
