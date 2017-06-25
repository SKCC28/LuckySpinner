/*var numSegments = 4;
 var segments = [
 {'fillStyle' : '#747474', 'text' : 'Pen/Eraser'},
 {'fillStyle' : '#43A5F6', 'text' : 'True Money'},
 {'fillStyle' : '#FF4180', 'text' : 'Thank You'},
 {'fillStyle' : '#FED352', 'text' : 'Flash Drive'}
 ];
 var theWheel = new Winwheel({
 'canvasId'    : 'myCanvas',
 'numSegments' : numSegments,
 'fillStyle'   : '#FED352',
 'lineWidth'   : 2,
 'segments' : segments
 });*/
var myRNG = new Math.seedrandom(new Date().getTime());

var spinningCount = 50;
var running = false;

// Create new wheel object specifying the parameters at creation time.
var theWheel = new Winwheel({
    'canvasId': 'myCanvas',
    'strokeStyle': '#DDDDDD',
    'lineWidth': 1,
    'numSegments': 4,     // Specify number of segments.
    'outerRadius': 212,   // Set outer radius so wheel fits inside the background.
    'textFontSize': 28,    // Set font size as desired.
    'segments':        // Define segments including colour and text.
        [
            {'fillStyle': '#F5403A', 'text': 'Flash drive'},
            {'fillStyle': '#F3A021', 'text': 'Notebook'},
            {'fillStyle': '#2196F3', 'text': 'Pen'},
            {'fillStyle': '#BBC007', 'text': 'Thank you'}
        ],
    'animation':           // Specify the animation to use.
    {
        'type': 'spinToStop',
        'duration': 1,     // Duration in seconds.
        'spins': 8,     // Number of complete spins.
        'callbackFinished': 'alertPrize()'
    }
});

$("body").keyup(function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 27) {
        bootbox.hideAll();
    }
    else if (key == 68) {
        if (!(wheelSpinning && running)) resetWheel();
    }
});
window.onkeyup = function (e) {
};

function randomRange(start, end) {
    return start + Math.random() * (end - start);
}


// Probability function
function getStopAngle() {
    var selection = myRNG() * 1000;
    var item = 0;
    //console.log("Random range: " + selection);
    if (spinningCount < 50) spinningCount++;
    if (selection >= 0 && selection <= 100 && spinningCount >= 50) {
        item = 0;
        spinningCount = 0;
    }
    else if (selection > 100 && selection <= 300 && spinningCount >= 50) {
        item = 1;
        spinningCount = 0;
    }
    else if (selection > 300 && selection <= 650) {
        item = 2;
    }
    else {
        item = 3;
    }
    return randomRange(item * 90, (item + 1) * 90);
    //return item;
}

function testProbability(times) {
    var map = [0, 0, 0];
    for (var i = 0; i < times; i++) {
        map[getStopAngle()]++;
    }
    console.log("Probability result from " + times + " loops");
    console.log(map);
}

theWheel.animation.stopAngle = getStopAngle();

// Vars used by the code in this page to do power controls.
var wheelPower = 0;
var wheelSpinning = false;
// -------------------------------------------------------
// Function to handle the onClick on the power buttons.
// -------------------------------------------------------
function powerSelected(powerLevel) {
    // Ensure that power can't be changed while wheel is spinning.
    if (wheelSpinning == false) {
        // Reset all to grey incase this is not the first time the user has selected the power.

        // Now light up all cells below-and-including the one selected by changing the class.

        // Set wheelPower var used when spin button is clicked.
        wheelPower = powerLevel;

        // Light up the spin button by changing it's source image and adding a clickable class to it.
        document.getElementById('spin_button').src = "spin_on.png";
        document.getElementById('spin_button').className = "clickable";
    }
}


// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
function startSpin() {
    if (wheelSpinning && running) return false;
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning == false) {
        // Based on the power level selected adjust the number of spins for the wheel, the more times is has
        // to rotate with the duration of the animation the quicker the wheel spins.
        if (wheelPower == 1) {
            theWheel.animation.spins = 3;
        }
        else if (wheelPower == 2) {
            theWheel.animation.spins = 8;
        }
        else if (wheelPower == 3) {
            theWheel.animation.spins = 15;
        }

        // Disable the spin button so can't click again while wheel is spinning.
        document.getElementById('spin_button').innerHTML = "Stopping....";
        document.getElementById('spin_button').className = "spin-button";
        // Begin the spin animation by calling startAnimation on the wheel object.
        theWheel.startAnimation();
        // Set to true so that power can't be changed and spin button re-enabled during
        // the current animation. The user will have to reset before spinning again.
        wheelSpinning = true;
        running = true;
        return true;
    } else {
        resetWheel();
        return false;
    }
}

// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel() {
    theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    theWheel.draw();                // Call draw to render changes to the wheel.

    wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
    $("#spin_button").text("Press to spin");
    theWheel.animation.stopAngle = getStopAngle();
}

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
// -------------------------------------------------------
function alertPrize() {
    running = false;
    // Get the segment indicated by the pointer on the wheel background which is at 0 degrees.
    var winningSegment = theWheel.getIndicatedSegment();
    $("#spin_button").text("Done!");
    var color = winningSegment.fillStyle;
    var msg;
    if (winningSegment.text == "Thank you") {
        msg = "Thank you for spinning.";
    }
    else {
        msg = "You have won <span style='color: " + color + "'> " + winningSegment.text + "</span>";
    }
    bootbox.dialog({
        message: msg,
        title: "Prize result!",
        className: 'alert-color',
        buttons: {
            main: {
                label: "Close",
                className: "btn-successy"
            }
        }
    });
}
