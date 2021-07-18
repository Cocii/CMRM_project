var board = new Array();
var current_array = new Array();
var tryTimes = 10;
var timerun = 0.00;
var score = 0;
var gameStart = 0;//0 means not start
var chords3 = {
	"": [0, 4, 7],
	"m": [0, 3, 7],
	"aug": [0, 4, 8],
	"dim": [0, 3, 6]
};
var chords7 = {
	"7": [0, 4, 7, 10],
	"M7": [0, 4, 7, 11],
	"m7": [0, 3, 7, 10],
	"mM7": [0, 3, 7, 11],
	"dim7": [0, 3, 6, 9],
	"aug7": [0, 4, 8, 11]
};
var index_chords3 = ["", "m", "aug", "dim"];
var index_chords7 = ["7", "M7", "m7", "mM7", "dim7", "aug7"];
var index_notes = {
	"40": "C",
	"41": "C#",
	"42": "D",
	"43": "D#",
	"44": "E",
	"45": "F",
	"46": "F#",
	"47": "G",
	"48": "G#",
	"49": "A",
	"50": "A#",
	"51": "B"
};
// $(function() {
// 	init();
// });

function init() {
	timeBegin();
	tryTimes = 10;
	score = 0;
	gameStart=1;
	createRandChords();

}