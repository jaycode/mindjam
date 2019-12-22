var musejs = require('muse-js');
var $ = require('jquery');
require('./bootstrap/js/bootstrap.min.js');

var channelNames = musejs.channelNames;
var MuseClient = musejs.MuseClient;

var clients = [];

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
      // plot(reading);
    });
    client.telemetryData.subscribe((reading) => {
      // document.getElementById('temperature').innerText = reading.temperature.toString() + '℃';
      // document.getElementById('batteryLevel').innerText = reading.batteryLevel.toFixed(2) + '%';
    });
    client.accelerometerData.subscribe((accel) => {
      // const normalize = (v) => (v / 16384.).toFixed(2) + 'g';
      // document.getElementById('accelerometer-x').innerText = normalize(accel.samples[2].x);
      // document.getElementById('accelerometer-y').innerText = normalize(accel.samples[2].y);
      // document.getElementById('accelerometer-z').innerText = normalize(accel.samples[2].z);
    });
    await client.deviceInfo().then((deviceInfo) => {
      // document.getElementById('hardware-version').innerText = deviceInfo.hw;
      // document.getElementById('firmware-version').innerText = deviceInfo.fw;
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