<!--
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-03-30 22:46:13
 * @LastEditors: xiuquanxu
 * @LastEditTime: 2020-04-05 00:37:37
 -->
# pcm-recorder-player
AudioContext、Pcm-Recorder、Pcm-Player、Resample


## RUN  

step1:  

run server

```
cd server
npm install
node index.js // socket can use
```  

step2:  

open recorder

```
open 127.0.0.1:8085/recorder/index.html  
```

step3:  

open player  

```
open 127.0.0.1:8085/player/index.html  
```

step4:  

click player/index.html start button  


click recorder/index.html start button  

broswer collection audio pcm by recorder module  

broswer play audio pcm by player module

## player  

play pcm data by audiocontext, samplerate 44100, channel 1.  

TODO: API

## recorder  

recorder pcm data by audiocontext, samplerate 44100, channel 1.   

TODO: API

