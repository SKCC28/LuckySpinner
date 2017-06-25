const path = require('path')
const { start, alternateSpin } = require(path.resolve('Spinner/js/controller'))
const SerialPort = require('serialport')

const rescanButton = "<a class=\"btn btn-success\" onclick=\"scan()\">Rescan</a>"

function scan() {
  SerialPort.list((err, ports) => {
    if (ports.length > 1) {
      let html = "<h1>Select device</h1><ul class=\"list-group\">"
      html += ports.map(port => port.comName).reduce((result, port) => {
        return result += "<li class=\"list-group-item\" onclick=\"connect('" + port + "')\">" + port + "</li>"
      }, "")
      html += "</ul>"
      $('#loader').html(html + rescanButton)
    } else if (ports.length == 1) {
      connect(ports[0].comName)
    } else {
      $('#loader').html('<h1>No device connected.</h1>' + rescanButton)
    }
  })
}

function connect(port) {
  $('#loader').html("<h1>Connecting to " + port + "...</h1>")
  start(port)
}

scan()