import React, { Component } from 'react';
//import { RNNoiseNode } from './rnnoise-runtime';

let compilation = WebAssembly.compileStreaming(fetch("worklet/rnnoise-processor.wasm"));

class Test extends Component {
  constructor(args) {
    super();
    this.state = {
      processor: null,
      node: null,
      moduleLoaded: false,
      stream: null,
    }
  }
  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    this.setState({stream: stream});

    this.audio.srcObject = await this.startWhiteNoise(this.state.stream);
    //this.audio.srcObject = this.state.stream;
  }

  async startWhiteNoise(inputStream) {
    let aModule = await compilation;
    //await this.actx.audioWorklet.addModule(`worklet/rnnoise-processor.js`);
    try {
      this.actx = new AudioContext({ sampleRate: 48000 });
      //this.actx = new (window.AudioContext || window.webkitAudioContext)();
      await this.actx.audioWorklet.addModule(`worklet/rnnoise-processor.js`);

      const noiseGeneratorNode = new AudioWorkletNode(this.actx, 'noise-generator', {
        channelCountMode: "explicit",
        channelCount: 1,
        channelInterpretation: "speakers",
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [1],
        processorOptions:
        {
          module: aModule
        }
      });
      const source = this.actx.createMediaStreamSource(inputStream);
      const destination = this.actx.createMediaStreamDestination();

      source.connect(noiseGeneratorNode);
      noiseGeneratorNode.connect(destination);

      return destination.stream;
    } catch(e) {
      console.log(e);
      return inputStream;
    }
  }

  // inserts processor
  /*insertProcessor(processor) {
    this.setState({ processor: {module: processor.name, cb: processor.cb}, moduleLoaded: false }, () => {
      if(!this.actx) {
        try {
          console.log('New context instantiated')
          this.actx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {
            console.log(`Sorry, but your browser doesn't support the Web Audio API!`);
        }
      }
      this.loadModule()
    });
  }

  async loadModule() {
    const { state, actx } = this;
    try {
      await actx.audioWorklet.addModule(`worklet/${state.processor.module}.js`);
      this.setState({moduleLoaded: true})
      console.log(`loaded module ${state.processor.module}`);
      this.toggleNode();
    } catch(e) {
      this.setState({moduleLoaded: false})
      console.log(`Failed to load module ${state.processor.module}`, e);
    }
  }

  toggleNode(){
    const { state } = this;
    console.log(`playing ${state.processor.module}`)
    const node = state.processor.cb(this);
    this.setState({ node });
    node.port.postMessage(true);
  }*/

  render() {
    return(
      <div>
        <p>Hello World</p>
        <audio ref={audio => {this.audio = audio}} controls volume="true" autoPlay />
      </div>
    );
  }
}

export default Test;
