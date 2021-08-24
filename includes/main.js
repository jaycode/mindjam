var musejs = require('muse-js');
var $ = require('jquery');
require('./bootstrap/js/bootstrap.min.js');

var channelNames = musejs.channelNames;
var MuseClient = musejs.MuseClient;

var clients = [];

const graphTitles = Array.from(document.querySelectorAll('.electrode-item h3'));
const canvases = Array.from(document.querySelectorAll('.electrode-item canvas'));
const canvasCtx = canvases.map((canvas) => canvas.getContext('2d'));

function plot(reading) {
    const canvas = canvases[reading.electrode];
    const context = canvasCtx[reading.electrode];
    if (!context) {
        return;
    }
    const width = canvas.width / 12.0;
    const height = canvas.height / 2.0;
    context.fillStyle = 'green';
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < reading.samples.length; i++) {
        const sample = reading.samples[i] / 15.;
        if (sample > 0) {
            context.fillRect(i * 25, height - sample, width, sample);
        } else {
            context.fillRect(i * 25, height, width, -sample);
        }
    }
}

async function connect(containerItem, containerId) {
  clients[containerId] = new MuseClient();
  let client = clients[containerId];
  client.connectionStatus.subscribe((status) => {
    console.log(status ? 'Connected!' : 'Disconnected');
  });

  try {
    client.enableAux = true;
    await client.connect();
    await client.start();
    client.eegReadings.subscribe((reading) => {
      plot(reading);
    });
    client.telemetryData.subscribe((reading) => {
      document.getElementById('batteryLevel').innerText = reading.batteryLevel.toFixed(2) + '%';
    });
    client.accelerometerData.subscribe((accel) => {
      document.getElementById('accelerometer-x').innerText = accel.samples[2].x;
      document.getElementById('accelerometer-y').innerText = accel.samples[2].y;
      document.getElementById('accelerometer-z').innerText = accel.samples[2].z;
    });
    await client.deviceInfo().then((deviceInfo) => {
      document.getElementById('hardware-version').innerText = deviceInfo.hw;
      document.getElementById('firmware-version').innerText = deviceInfo.fw;
      // debugger;
      $(containerItem).children('.id-headsetName').text(client.deviceName);
    });
  }
  catch (err) {
    console.error('Connection failed', err);
  }
};

function disconnect(containerItem, containerId) {
  clients[containerId].disconnect();
  $(containerItem).children('.id-headsetName').text('Not connected');
}

$('#museList .id-buttonConnect').click(function(e) {
  let containerItem = $(e.target).parents('.id-muse')[0];
  let id = $(containerItem).index();
  connect(containerItem, id);
});

$('#museList .id-buttonDisconnect').click(function(e) {
  let containerItem = $(e.target).parents('.id-muse')[0];
  let id = $(containerItem).index();
  disconnect(containerItem, id);
});
