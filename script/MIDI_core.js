var MIDIAccess = null; // global MIDIAccess object
var inputNotes = new Array();

function onMIDISuccess(midiAccess) {
	console.log("MIDI ready!");
	MIDIAccess = midiAccess; // store in the global (in real usage, would probably keep in an object instance)
	if (typeof onMidiSuccess == 'function') {
		listInputsAndOutputs(MIDIAccess)
	}
	startLoggingMIDIInput(MIDIAccess, null)
}

function onMIDIFailure(msg) {
	console.log("Failed to get MIDI access - " + msg);
}

//MIDI success or not and output the deviceName
function listInputsAndOutputs(midiAccess) {
	let intpuDevList = [];
	for (let entry of midiAccess.inputs) {
		let input = entry[1];
		let deviceName = input.manufacturer + ' ' + input.name;
		// console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
		//     "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
		//     "' version:'" + input.version + "'" );
		intpuDevList.push(deviceName);
	}
	// for (var entry of midiAccess.outputs) {
	//   var output = entry[1];
	//   console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
	//       "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
	//       "' version:'" + output.version + "'" );
	// }
	onMidiSuccess(intpuDevList);
}

//
function onMIDIMessage(event) {
	var str = "MIDI message received at timestamp " + event.timestamp + "[" + event.data.length + " bytes]: ";
	for (var i = 0; i < event.data.length; i++) {
		str += "0x" + event.data[i].toString(16) + " ";
	}
	// console.log(str);
	if (typeof onMidiInput == 'function') { // midi input to generate sound
		onMidiInput(event.data[0], event.data[1], event.data[2])
	}
	if (typeof onGameInput == 'function'&&gameStart==1) { // game input
		onGameInput(event.data[0], event.data[1], event.data[2])
	}
}

function startLoggingMIDIInput(midiAccess, indexOfPort) {
	midiAccess.inputs.forEach(function(entry) {
		entry.onmidimessage = onMIDIMessage;
	});
}

if (navigator.requestMIDIAccess) {
	navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
}
