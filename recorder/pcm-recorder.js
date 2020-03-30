/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-03-30 22:47:07
 * @LastEditors: xiuquanxu
 * @LastEditTime: 2020-03-30 23:38:20
 */

/**
 * @param {*} config 
 * config: {
 *    sampleBites: 16,
 *    sampleRate:  (new (window.AudioContext
    || window.webkitAudioContext)()).sampleRate,
       numberChannels: 1,
       fftSize: 512, // 改值只能是128整数倍
       down: true,
 *  }
 */
function PcmRecorder(config) {
  if (!config) {
    config = {
      sampleBites: 16,
      sampleRate: (new (window.AudioContext
        || window.webkitAudioContext)()).sampleRate,
      numberChannels: 1,
      fftSize: 512,
      down: true,
      debug: true,
    }
  }
  this.config = config;
  this.recorder = null;
  this.analyser = null;
  this.audioInput = null; // 
  this.context = null; // AudioContext对象
  this.recorder = null; // 音频输入对象

  this.pcmBuffer = [];
  this.pcmBufferSize = 0;
  this.visualVolume = 0;
  this.init();
}

PcmRecorder.prototype.getVolume = function() {
  return this.visualVolume;
}

PcmRecorder.prototype.start = function() {
  var _this = this;
  navigator.mediaDevices.getUserMedia({
    audio: true,
  }).then((stream) => {
    _this.audioInput = _this.context.createMediaStreamSource(stream);
  }, (error) => {
    console.error(error);
  }).then(() => {
    _this.audioInput.connect(_this.analyser);
    _this.analyser.connect(_this.recorder);
    _this.recorder.connect(_this.context.destination);
  });
}

PcmRecorder.prototype.stop = function() {
  if (this.audioInput) this.audioInput.disconnect();
  if (this.recorder) this.recorder.disconnect();
}

PcmRecorder.prototype.down = function() {
  const uintPcm = new Uint8Array(this.pcmBufferSize * 2);
  let pcmLen = 0;
  for (let i = 0, len = this.pcmBuffer.length; i < len; i += 1) {
    uintPcm.set(new Uint8Array(this.pcmBuffer[i].buffer), pcmLen);
    pcmLen += (this.pcmBuffer[i].byteLength);
  }
  const pcmBlobData = new Blob([uintPcm]);
  try {
    const oa = document.createElement('a');
    oa.href = window.URL.createObjectURL(pcmBlobData);
    oa.download = 'test-pcm-web.pcm';
    oa.click();
  } catch (e) {
    console.error(e);
  }
}

PcmRecorder.prototype.init = function() {
  this.context = new (window.AudioContext || window.webkitAudioContext)();
  this.analyser = this.context.createAnalyser(); // 录音分析节点
  // this.analyser.fftSize = this.context.sampleRate / 100;
  this.analyser.fftSize = this.config.fftSize;
  // pcmNode
  const createScript = this.context.createScriptProcessor || this.context.createJavaScriptNode;
  // recorder Analyser
  this.recorder = createScript.apply(this.context,
    [this.config.fftSize, this.config.numberChannels, this.config.numberChannels]);

  // 音频采集
  this.recorder.onaudioprocess = this.onaudioprocess.bind(this)
}

PcmRecorder.prototype.onaudioprocess = function(e) {
  if (this.config.numberChannels === 1) {
    const data = e.inputBuffer.getChannelData(0);
    // 单通道
    this.handlePcm(new Float32Array(data));
  }
}

PcmRecorder.prototype.handlePcm = function(bytes) {
  if (bytes[0] === 0 && bytes[1] === 0) return;
  const sampleBites = this.config.sampleBites;
  const dataLength = bytes.length * (sampleBites / 8);
  const buffer = new ArrayBuffer(dataLength);
  const data = new DataView(buffer);
  let offset = 0;
  let i = 0;
  let len = 0;
  for (i = 0, len = bytes.length; i < len; i += 1, offset += 2) {
    const s = Math.max(-1, Math.min(1, [bytes[i]]));
    data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  const bufferLeng = this.analyser.frequencyBinCount;
  const uData = new Uint8Array(bufferLeng);
  this.analyser.getByteTimeDomainData(uData);
  this.visualVolume = 0.1 + (Math.abs(uData[0] - 128) / 128);

  if (this.config.down) {
    this.pcmBufferSize += data.byteLength;
    this.pcmBuffer.push(data);
  }
  if (this.config.debug) {
    console.log('get pcm data success, pcm buffer size:', data.byteLength);
  }
}