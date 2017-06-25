const { EventEmitter } = require('events')
const modes = require('./modes')

class Button extends EventEmitter {
  constructor(pin, arduino) {
    super()
    this.pin = pin
    this.arduino = arduino
    this.previous = 0

    this.arduino.pinMode(pin, modes.INPUT)
    this.arduino.on('change', (pin, value) => {
      if (pin != this.pin) return
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