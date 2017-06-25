function showConnecting() {
  bootbox.dialog({
    message: 'Connecting...',
    title: 'Lucky Spinner',
    className: 'alert-color',
    buttons: {
        
    }
  })
}

async function start() {
  const path = require('path')
  const { Arduino, Button } = require(path.resolve('Spinner/js/arduino'))
  const arduino = new Arduino('COM6')
  showConnecting()
  await arduino.connect()
  bootbox.hideAll()

  let success = false
  let allowed = true

  const spinButton = new Button(10, arduino)
  spinButton.on('down', () => {
    if (!allowed) return
    theWheel.animation.type = 'spinOngoing'
    theWheel.animation.duration = 1000
    theWheel.animation.spins = 4000
    success = startSpin()
    if (!success) {
      allowed = false
      bootbox.hideAll()
      setTimeout(() => { allowed = true }, 100)
    } else {
      $("#spin_button").text("Release to stop");
    }
  })
  spinButton.on('up', () => {
    if (!success) return
    theWheel.animation.type = 'spinToStop'
    theWheel.animation.duration = 1
    theWheel.animation.spins = 8
    wheelSpinning = false
    startSpin()
    success = false
  })

  const resetButton = new Button(8, arduino)
  resetButton.on('press', () => {
    bootbox.hideAll()
    resetWheel()
  })
}

start()