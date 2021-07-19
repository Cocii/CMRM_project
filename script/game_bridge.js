var onGameInput = function(type, key, volencity) {
	if (timerun >= 60 || mistakeTimes == 0) {
		gameOver();
	}
	var keyOnPiano = key - 8;
	console.log("Key: ",keyOnPiano);
	var mistake = 1;
	// console.log("Type: ", type, ",Key: ", keyOnPiano, ",Volencity: ", volencity,".");
	//press 
	if (type == 144) {
		console.log("tryTimes:", tryTimes, " keyOnPiano:", keyOnPiano);
		for (var i = 0; i < current_array.length; i++) {
			if ((keyOnPiano - current_array[i]) % 12 == 0) {
				var deletearray = current_array[i];
				current_array.splice(i, 1);
				mistake = 0;
				console.log("delete: ", deletearray, "current_array: ", current_array);
			}
		}
		if (mistake == 1) {
			if (score != 0) {
				score--;
				$("#score_span").text(score);
			}
			tryTimes--;
			mistakeTimes--;
		}
	}
	
	if (current_array.length == 0 || tryTimes == 0) {
		if (current_array.length == 0) {
			score += 10;
			$("#score_span").text(score);
		}
		finishChord();
	}
}

function finishChord() {
	current_array.splice(0, current_array.length); // clean current_array
	createRandChords();
	tryTimes = 10;
}

function createRandChords() {
	var rand_notes = 40 + parseInt(Math.floor(Math.random() * 12)); //40-51
	console.log("rand_notes: ", rand_notes, " ", index_notes[rand_notes]);
	var rand_chords = parseInt(Math.floor(Math.random() * 10)); //0-9
	var chord_kind;
	var before_array;
	var chord_str;
	// random chords number order
	if (rand_chords <= 3) {
		before_array = chords3[index_chords3[rand_chords]];
		console.log("before_array:", before_array);
		chord_kind = index_chords3[rand_chords];
	} else {
		before_array = chords7[index_chords7[rand_chords - 4]];
		console.log("before_array:", before_array);
		chord_kind = index_chords7[rand_chords - 4];
	}
	for (var i = 0; i < before_array.length; i++) {
		current_array[i] = rand_notes + before_array[i];
	}
	chord_str = index_notes[rand_notes] + chord_kind;
	console.log("current_array: ", current_array);
	$("#notes_span").text(chord_str);
}

function clearText() {
	$("#notes_span").text("");
}

function writeText() {
	$("#notes_span").text("Press \"ENTER\" to start");
}

function timeBegin() {
	timebegin = new Date().getTime();
	console.log("timeBegin:", timebegin);
	timeRun();
}

function timeRun() {
	var timeinter = new Date().getTime() - timebegin;
	timerun = (timeinter * 0.001).toFixed(2);
	$("#time_span").text(timerun.toString().substr(0, 5));
	t = setTimeout("timeRun()", 1);
}

function gameOver() {
	gameStart = 0;
	clearTimeout(t);
	timerun = 0;
	mistakeTimes = 60;
	tryTimes = 10;
	$("#gameOverOrNot").append("<div id='gameover' class='gameover'><p>Final result:</p><span>" + score.toString() +
		" scores</span><a href='javascript:restartgame();' id='restartgamebutton'>Restart</a></div>");
	var gameover = $("#gameover");
	gameover.css("width", "90vw");
	gameover.css("height", "49vw");
	gameover.css("background-color", "rgba(0,0,0,0.5)");
	$("#time_span").text(0.00);
	$("#notes_span").text("Press \"ENTER\" to start");
}

function restartgame() {
	$("#gameover").remove();
	$("#time_box").html("<span id='time_span'>0.00</span>" + "seconds");
	$("#notes_span").text("");
	writeText();
	// re initialize
	// clearText();
	// init();
}
