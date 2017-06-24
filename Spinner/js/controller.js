async function start() {
  const path = require('path')
  const { Arduino, Button } = require(path.resolve('Spinner/js/arduino'))
  const arduino = new Arduino('COM6')
  await arduino.connect()

  const spinButton = new Button(10, arduino)
  spinButton.on('press', () => {
    startSpin()
  })

  const resetButton = new Button(8, arduino)
  resetButton.on('press', () => {
    bootbox.hideAll()
    resetWheel()
  })
}

start()