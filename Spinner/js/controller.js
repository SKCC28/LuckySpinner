let success = false
let allowed = true
  
function showSpinner() {
  $('#loader').hide()
  $('#spinner').show()
}

function stopSpin() {
  theWheel.animation.type = 'spinToStop'
  theWheel.animation.duration = 1
  theWheel.animation.spins = 8
  startSpin()
}

async function start(port) {
  const path = require('path')
  const { Arduino, Button, modes } = require(path.resolve('Spinner/js/arduino'))
  const arduino = new Arduino(port)
  await arduino.connect()
  showSpinner()

  const spinButton = new Button(10, arduino, modes.INPUT_PULLUP)
  spinButton.on('down', () => {
    if (!allowed) return
    theWheel.animation.type = 'spinOngoing'
    theWheel.animation.duration = 1000
    theWheel.animation.spins = 4000
    success = startSpin()
    if (!success) {
      allowed = false
      bootbox.hideAll()
      setTimeout(() => { allowed = true }, 300)
    } else {
      $("#spin_button").text("Release to stop");
    }
  })
  spinButton.on('up', () => {
    if (!success) return
    wheelSpinning = false
    stopSpin()
    $("#spin_button").text("Stopping...");
    success = false
  })

  const reloadButton = new Button(8, arduino, modes.INPUT_PULLUP)
  reloadButton.on('press', () => {
    location.reload()
  })
}

module.exports = {
  start: start,
  alternateSpin: stopSpin
}