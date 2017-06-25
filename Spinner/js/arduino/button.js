const { EventEmitter } = require('events')
const modes = require('./modes')

class Button extends EventEmitter {
  constructor(pin, arduino, mode) {
    super()
    this.pin = pin
    this.arduino = arduino
    this.previous = 0
    if (mode === undefined) {
      mode = modes.INPUT
    }
    this.mode = mode

    this.arduino.pinMode(pin, this.mode)
    this.arduino.on('change', (pin, value) => {
      if (pin != this.pin) return
      if (this.mode == modes.INPUT_PULLUP) value = !value
      if (this.previous == value) return
      if (value == 0) {
        this.emit('press')
        this.emit('up')
      } else if (value == 1) {
        this.emit('down')
      }
      this.previous = value
    })
  }
}

module.exports = Button