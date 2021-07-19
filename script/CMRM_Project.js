// JavaScript Document
var notes = {
	C3: 130.81,
	"C#3": 138.59,
	D3: 146.83,
	"D#3": 155.56,
	E3: 164.81,
	F3: 174.61,
	"F#3": 185.0,
	G3: 196.0,
	"G#3": 207.65,
	A3: 220.0,
	"A#3": 233.08,
	B3: 246.94,
	C4: 261.63,
	"C#4": 277.18,
	D4: 293.66,
	"D#4": 311.13,
	E4: 329.63,
	F4: 349.23,
	"F#4": 369.99,
	G4: 392.0,
	"G#4": 415.3,
	A4: 440.0,
	"A#4": 466.16,
	B4: 493.88,
	C5: 523.25,
	"C#5": 554.37,
	D5: 587.33,
	"D#5": 622.25,
	E5: 659.25,
	F5: 698.46,
	"F#5": 739.99,
	G5: 783.99,
	"G#5": 830.61,
	A5: 880.0,
	"A#5": 932.33,
	B5: 987.77
};

var keyNotes = {
	"90": "C",
	"83": "C#",
	"88": "D",
	"68": "D#",
	"67": "E",
	"86": "F",
	"71": "F#",
	"66": "G",
	"72": "G#",
	"78": "A",
	"74": "A#",
	"77": "B"
};

var activeNotes = {
	C: null,
	"C#": null,
	D: null,
	"D#": null,
	E: null,
	F: null,
	"F#": null,
	G: null,
	"G#": null,
	A: null,
	"A#": null,
	B: null
};

var isDown = false,
	isUp = false;

function getOctave() {
	return isDown ? "3" : isUp ? "5" : "4";
}

//Octave Higher or lower
function toggleOctave(octave) {
	if (octave === "up") {
		isDown = false;
		isUp = !isUp;
	} else if (octave === "down") {
		isUp = false;
		isDown = !isDown;
	}
}

function changeVolume(direction) {
	if (direction === "up") {
		volume.value = parseInt(volume.value) + 10;
	} else {
		volume.value = parseInt(volume.value) - 10;
	}

	gain.gain.value = volume.value / 100;
}

var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

//Initialize wave
var distortion = audioCtx.createWaveShaper();
distortion.curve = makeDistortionCurve(0);
// distortion.oversample = "8x";

// add limits of fft
var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

var gain = audioCtx.createGain();
gain.gain.value = 1;

// variables
var WIDTH,
	HEIGHT,
	canvas,
	canvasCtx,
	wavetype = "sine",
	octaveKeys,
	volume;

// https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createWaveShaper
function makeDistortionCurve(amount) {
	var k = typeof amount === "number" ? amount : 50,
		n_samples = 44100,
		curve = new Float32Array(n_samples),
		deg = Math.PI / 180,
		i = 0,
		x;
	for (; i < n_samples; ++i) {
		x = (i * 2) / n_samples - 1;
		curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
	}
	return curve;
}


// make and remove the key pressed
var pressIndex = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function addPressed(key) {
	var i = 0,
		ii;
	var keys = document.getElementsByClassName("key");

	for (ii = keys.length; i < ii; i++) {
		if (keys[i].getAttribute("data-keycode") == key) {
			if (pressIndex[i] == 0)
				keys[i].classList.add("pressed");
			pressIndex[i]++;
		}
	}
}

function removePressed(key) {
	var i = 0,
		ii;
	var keys = document.getElementsByClassName("key");

	for (ii = keys.length; i < ii; i++) {
		if (keys[i].getAttribute("data-keycode") == key) {
			pressIndex[i]--;
			if (pressIndex[i] == 0)
				keys[i].classList.remove("pressed");
		}
	}
}


// ctreate an Oscillator, and make sound
function newOsc(note) {
	var osc = audioCtx.createOscillator();
	osc.type = wavetype;
	osc.frequency.value = note;

	osc.connect(distortion);
	distortion.connect(gain);
	gain.connect(analyser);
	analyser.connect(audioCtx.destination);
	gain.connect(audioCtx.destination);
	osc.start();

	return osc;
}

//stop play
function stopOsc(osc) {
	osc.disconnect();
	osc.stop(0);

	return null;
}

function playNote(e) {
	//In order to compatible with IE
	var key = e.which;

	var keyNote = keyNotes[key];

	var note = notes[keyNote + getOctave()];
	// console.log("Number:",e);
	// console.log("keyNote(Before):",keyNote);
	// console.log("keyNote+Octave(Before):",keyNote + getOctave());
	if (key == 13 && gameStart == 0) //enter(13) or space(32)
	{
		clearText();
		init();
	}
	if (gameStart == 1) {
		for (var ii in index_notes) {
			if (keyNote == index_notes[ii]) {
				onGameInput(144, parseInt(ii)+8, 90);
			}
		}
	}
	var octave;

	if (keyNote && note && !activeNotes[keyNote]) {
		e.preventDefault();
		activeNotes[keyNote] = newOsc(note); //make sound in newOcs(note)
		addPressed(key);
	} else if (key === 190 || key === 188) {
		octave = key === 188 ? "down" : "up";
		toggleOctave(octave);
		for (var i = 0, ii = octaveKeys.length; i < ii; i++) {
			if (octaveKeys[i].getAttribute("data-octave") === octave) {
				octaveKeys[i].classList.toggle("pressed");
			} else {
				octaveKeys[i].classList.remove("pressed");
			}
		}
	} else if (key === 189) {
		changeVolume("down");
	} else if (key === 187) {
		changeVolume("up");
	}

	// console.log("keyNote(After):",keyNote);
	// console.log("keyNote+Octave(After):",keyNote + getOctave());//
}

function stopNote(e) {
	var key = e.which || e.keyCode;
	// console.log(key);
	var keyNote = keyNotes[key];

	var note = notes[keyNote + getOctave()];

	var octave;

	if (keyNote && note && activeNotes[keyNote]) {
		e.preventDefault();
		activeNotes[keyNote] = stopOsc(activeNotes[keyNote]); //stop sound in stopOcs(note)
		removePressed(key);
	}
}

function visualize() {
	WIDTH = canvas.width;
	HEIGHT = canvas.height;

	analyser.fftSize = 2048;
	var bufferLength = analyser.frequencyBinCount; // half the FFT value
	var dataArray = new Uint8Array(bufferLength); // create an array to store the data

	canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

	function draw() {
		drawVisual = requestAnimationFrame(draw);

		analyser.getByteTimeDomainData(dataArray);

		canvasCtx.fillStyle = "#1f1f1f";
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

		canvasCtx.lineWidth = 2;
		canvasCtx.strokeStyle = "#00ffcc";

		canvasCtx.beginPath();

		var sliceWidth = (WIDTH * 1.0) / bufferLength;
		var x = 0;

		for (var i = 0; i < bufferLength; i++) {
			var v = dataArray[i] / 128.0;
			var y = (v * HEIGHT) / 2;

			if (i === 0) {
				canvasCtx.moveTo(x, y);
			} else {
				canvasCtx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		canvasCtx.lineTo(canvas.width, canvas.height / 2);
		canvasCtx.stroke();
	}

	draw();
}

window.onkeydown = playNote;
window.onkeyup = stopNote;




/**
 * Access of MIDI
 * Information of keys group 
 */
const groupInfo = [{
		index: 1,
		minKey: 1,
		maxKey: 3
	},
	{
		index: 2,
		minKey: 4,
		maxKey: 15
	},
	{
		index: 3,
		minKey: 16,
		maxKey: 27
	},
	{
		index: 4,
		minKey: 28,
		maxKey: 39
	},
	{
		index: 5,
		minKey: 40,
		maxKey: 51
	},
	{
		index: 6,
		minKey: 52,
		maxKey: 63
	},
	{
		index: 7,
		minKey: 64,
		maxKey: 75
	},
	{
		index: 8,
		minKey: 76,
		maxKey: 87
	},
	{
		index: 9,
		minKey: 88,
		maxKey: 88
	},
];


function getKeyInGroupIndex(index, group) {
	let x = 0;
	for (let i = group.minKey; i <= group.maxKey; i++) {
		if (i == index) {
			return x;
		}
		x++;
	}
}


function getKeyboardGroup(index) {
	for (let i = 0; i < groupInfo.length; i++) {
		let group = groupInfo[i]
		if (index <= group.maxKey && index >= group.minKey) {
			return {
				key: index,
				groupIndex: group.index,
				keyInGroupIndex: getKeyInGroupIndex(index, group),
				minKey: group.minKey,
				maxKey: group.maxKey
			}
		}
	}
}

function getKeyName(keyNumber, group) {
	keyPosition = keyNumber - group.minKey;
	// console.log("keyPosition",keyPosition);
	// console.log("keyNumber",keyNumber);
	// console.log("group.minkey",group.minKey);
	if (keyPosition == 0) {
		return "90"; //C
	}
	if (keyPosition == 1) {
		return "83"; //C#
	}
	if (keyPosition == 2) {
		return "88"; //D
	}
	if (keyPosition == 3) {
		return "68"; //D#
	}
	if (keyPosition == 4) {
		return "67"; //E
	}
	if (keyPosition == 5) {
		return "86"; //F
	}
	if (keyPosition == 6) {
		return "71"; //F#
	}
	if (keyPosition == 7) {
		return "66"; //G
	}
	if (keyPosition == 8) {
		return "72"; //G#
	}
	if (keyPosition == 9) {
		return "78"; //A
	}
	if (keyPosition == 10) {
		return "74"; //A#
	}
	if (keyPosition == 11) {
		return "77"; //B
	}
}





// initialize keyboard

function buildKeyboard() {
	var keyboard = document.getElementsByClassName("keyboard")[0];
	var keysWrapper = keyboard.getElementsByClassName("keys")[0];

	var keys = ["90", "83", "88", "68", "67", "86", "71", "66", "72", "78", "74", "77"];

	var letters = ["Z", "S", "X", "D", "C", "V", "G", "B", "H", "N", "J", "M"];

	for (var i = 0, ii = keys.length; i < ii; i++) {
		var key = document.createElement("div");

		key.setAttribute("data-keycode", keys[i]);
		key.className = "key";
		key.innerHTML = letters[i];

		keysWrapper.appendChild(key);

		key.addEventListener("mousedown", function(e) {
			var fakeEvent = {
				which: this.getAttribute("data-keycode"),
				preventDefault: function() {}
			};

			playNote(fakeEvent);
		});

		key.addEventListener("mouseup", function(e) {
			var fakeEvent = {
				which: this.getAttribute("data-keycode"),
				preventDefault: function() {}
			};

			stopNote(fakeEvent);
		});

		key.addEventListener("mouseleave", function(e) {
			var fakeEvent = {
				which: this.getAttribute("data-keycode"),
				preventDefault: function() {}
			};

			stopNote(fakeEvent);
		});
	}

	// change selector of cavas waveform
	canvas = document.getElementsByClassName("waveform")[0];
	canvasCtx = canvas.getContext("2d");

	var types = document.getElementsByClassName("indv-type");
	var selector = document.getElementsByClassName("selector")[0];

	for (var i = 0, ii = types.length; i < ii; i++) {
		types[i].addEventListener("click", function(e) {
			var position = this.getAttribute("data-position");
			wavetype = this.getAttribute("data-wavetype");
			selector.className = "selector " + position;
		});
	}

	volume = document.getElementsByClassName("slider")[0];

	volume.addEventListener("change", function(e) {
		gain.gain.value = this.value / 100;
	});

	// Octave Modifier
	var octaveSwitch = document.getElementsByClassName("octave-switch")[0];
	octaveKeys = octaveSwitch.getElementsByClassName("octave-key");
	octaveKeys[0].addEventListener("mousedown", function(e) {
		var octave = this.getAttribute("data-octave");
		octaveKeys[1].classList.remove("pressed");
		this.classList.toggle("pressed");
		toggleOctave(octave);
	});
	octaveKeys[1].addEventListener("mousedown", function(e) {
		var octave = this.getAttribute("data-octave");
		octaveKeys[0].classList.remove("pressed");
		this.classList.toggle("pressed");
		toggleOctave(octave);
	});

	// octaveKeys[i].addEventListener("mouseup", function(e) {
	// 	var octave = this.getAttribute("data-octave");
	// 	this.classList.remove("pressed");
	// 	toggleOctave(octave);
	// });

	keyboard.classList.remove("hidden");
}

window.onload = function() {
	buildKeyboard();
	visualize();
};
