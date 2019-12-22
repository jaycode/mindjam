var musejs = require('muse-js');
var $ = require('jquery');

var channelNames = musejs.channelNames;
var MuseClient = musejs.MuseClient;

window.connect = async (containerItem) => {
  const graphTitles = Array.from(document.querySelectorAll('.electrode-item h3'));
  const canvases = Array.from(document.querySelectorAll('.electrode-item canvas'));
  const canvasCtx = canvases.map((canvas) => canvas.getContext('2d'));
  graphTitles.forEach((item, index) => {
    item.textContent = channelNames[index];
  });
  
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
      }
      else {
        context.fillRect(i * 25, height, width, -sample);
      }
    }
  }
  
  const client = new MuseClient();
  client.connectionStatus.subscribe((status) => {
    console.log(status ? 'Connected!' : 'Disconnected');
    debugger;
  });

  try {
    client.enableAux = true;
    await client.connect();
    await client.start();
    $(containerItem).children('id-headsetName').text(client.deviceName);
    // client.eegReadings.subscribe((reading) => {
    //   plot(reading);
    // });
    // client.telemetryData.subscribe((reading) => {
    //   document.getElementById('temperature').innerText = reading.temperature.toString() + '℃';
    //   document.getElementById('batteryLevel').innerText = reading.batteryLevel.toFixed(2) + '%';
    // });
    // client.accelerometerData.subscribe((accel) => {
    //   const normalize = (v) => (v / 16384.).toFixed(2) + 'g';
    //   document.getElementById('accelerometer-x').innerText = normalize(accel.samples[2].x);
    //   document.getElementById('accelerometer-y').innerText = normalize(accel.samples[2].y);
    //   document.getElementById('accelerometer-z').innerText = normalize(accel.samples[2].z);
    // });
    // await client.deviceInfo().then((deviceInfo) => {
    //   document.getElementById('hardware-version').innerText = deviceInfo.hw;
    //   document.getElementById('firmware-version').innerText = deviceInfo.fw;
    // });
  }
  catch (err) {
    console.error('Connection failed', err);
  }
};

$('#museList .id-buttonConnect').click(function(e) {
  let containerItem = $(e.target).parents('.id-muse')[0]
  connect(containerItem);
});