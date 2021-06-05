let instance, heapFloat32;

class NoiseGenerator extends AudioWorkletProcessor {
    constructor(options) {
        console.log("constructor");
        super({
          ...options
        });
        if (!instance) // Initialize an instance and save new instance on "heapFloat32"
            heapFloat32 = new Float32Array((instance = new WebAssembly.Instance(options.processorOptions.module).exports).memory.buffer);
        console.log(instance);
        this.state = instance.newState();
        this.alive = true;
        //heapFloat32 = new Float32Array();

    }
    /*static get parameterDescriptors() {
      return [{name: 'amplitude', defaultValue: 0.25, minValue: 0, maxValue: 1}];
    }

    onmessage(event) {
      const { data } = event;
      this.isPlaying = data;
    }*/

    process(inputs, outputs, parameters) {
      /*Rnnoise*/
      if (this.alive && inputs[0].length != 0)
      {
          heapFloat32.set(inputs[0][0], instance.getInput(this.state) / 4);
          const o = outputs[0][0], ptr4 = instance.pipe(this.state, o.length) / 4;
          if (ptr4)
              o.set(heapFloat32.subarray(ptr4, ptr4 + o.length));

          return true;
      }

      /*Play Back*/
      /*const output = outputs[0];
      const input = inputs[0];
      const amplitude = parameters.amplitude;
      //const isAmplitudeConstant = amplitude.length === 1;

      for (let channel = 0; channel < output.length; ++channel) {
        const outputChannel = output[channel];
        const inputChannel = input[channel];
        for (let i = 0; i < outputChannel.length; ++i) {
          outputChannel[i] = inputChannel[i];
        }
      }*/

      /*Noise*/
      /*const output = outputs[0];
      const amplitude = parameters.amplitude;
      const isAmplitudeConstant = amplitude.length === 1;

      for (let channel = 0; channel < output.length; ++channel) {
        const outputChannel = output[channel];
        for (let i = 0; i < outputChannel.length; ++i) {
          // This loop can branch out based on AudioParam array length, but
          // here we took a simple approach for the demonstration purpose.
          outputChannel[i] = 2 * (Math.random() - 0.5) *
              (isAmplitudeConstant ? amplitude[0] : amplitude[i]);
        }
      }*/

      //return this.alive;
    }
  }

  registerProcessor('noise-generator', NoiseGenerator);
