/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-03-30 22:47:53
 * @LastEditors: xiuquanxu
 * @LastEditTime: 2020-04-02 22:01:08
 */
function PcmPlayer(config) {
  this.config = config;
  this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  this.scriptNode = null;
  this.buffer = {
    data: new Uint8Array(44100 * 20), // 20s
    start: 0,
    end: 0,
  }
}

PcmPlayer.prototype.init = function() {
  this.scriptNode = this.audioContext.createScriptProcessor(this.config.codec.bufferSize, 1, 1);
  this.scriptNode.onaudioprocess = function(e) {
    
  }
}

PcmPlayer.prototype.play = function() {
  
}

PcmPlayer.prototype.read = function(len) {
  const res = this.buffer.data.slice(this.buffer.start, this.buffer.start + len);
  this.buffer.start += len;
  return res;
}

PcmPlayer.prototype.write = function(buffer) {
  // 循环队列
  // const end = this.buffer.end;
  // const maxSize = this.buffer.data.length;
  // if ((end + buffer.length) > maxSize) {
  //  const need = maxSize - end;
  //  this.buffer.data.set(buffer.slice(0, need), end); 
   
  // }
  this.buffer.data.set(buffer, this.buffer.len);
  this.buffer.end += buffer.length;
}

PcmPlayer.prototype.bufferLength = function() {
  const end = this.buffer.end;
  const start = this.buffer.start;
  const maxSize = this.buffer.length;
  if (end >= start) {
    return end - start;
  }
  return maxSize - (start - end);
}