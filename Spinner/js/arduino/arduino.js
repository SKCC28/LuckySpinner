const SerialPort = require('serialport')
const { EventEmitter } = require('events')

const modes = require('./modes')

class Arduino extends EventEmitter {
  constructor(port, options) {
    super()
    this.pending = null
    this.port = port
    this.pinData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.baudRate = options ? options.baudRate ? options.baudRate : 9600 : 9600
    this.serial = new SerialPort(this.port, {
      baudRate: this.baudRate,
      autoOpen: false,
      parser: SerialPort.parsers.byteLength(2)
    })
    this.serial.on('data', data => {
      const pinData = (data.readInt8(0) << 8) + data.readInt8(1)
      if (this.pending != null) {
        this.pending()
        this.pending = null
      }
      for (let i = 0; i < 14; i++) {
        let data = (pinData & (1 << i)) != 0 ? modes.HIGH : modes.LOW
        if (data != this.pinData[i]) {
          this.pinData[i] = data
          this.emit('change', i, data)
        }
      }
    })
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.pending = resolve
      this.serial.open(err => {
        if (err) {
          this.pending = null
          reject(err)
        }
      })
    })
  }

  pinMode(pin, mode) {
    return new Promise((resolve, reject) => {
      this.writeData(pin | (mode << 4) | (1 << 5)).then(() => {
        this.pending = resolve
      })
    })
  }

  async digitalWrite(pin, data) {
    await this.writeData(pin | (data << 4))
  }

  digitalRead(pin) {
    return this.pinData[pin]
  }

  async writeData(toWrite) {
    const buf = new Buffer(1)
    buf[0] = toWrite
    this.serial.write(buf)
    await this.drain()
  }

  drain() {
    return new Promise((resolve, reject) => {
      this.serial.drain(resolve)
    })
  }
}

module.exports = Arduino