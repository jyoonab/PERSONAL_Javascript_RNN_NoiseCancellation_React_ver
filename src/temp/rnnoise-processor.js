let instance, heapFloat32;

registerProcessor("rnnoise", class extends AudioWorkletProcessor
{
    constructor(options)
    {
        super({ // AudioWorkletProcessor Options
            ...options,
            numberOfInputs: 1,
            numberOfOutputs: 1,
            outputChannelCount: [1]
        });
        if (!instance) // Initialize an instance and save new instance on "heapFloat32"
            heapFloat32 = new Float32Array((instance = new WebAssembly.Instance(options.processorOptions.module).exports).memory.buffer);
        console.log(instance);
        this.state = instance.newState();
        this.alive = true;
    }
    process(input, outputs, parameters)
    {
        if (this.alive && input[0].length != 0)
        {
            heapFloat32.set(input[0][0], instance.getInput(this.state) / 4);
            const o = outputs[0][0], ptr4 = instance.pipe(this.state, o.length) / 4;
            if (ptr4)
                o.set(heapFloat32.subarray(ptr4, ptr4 + o.length));
            return true;
        }
    }
});
