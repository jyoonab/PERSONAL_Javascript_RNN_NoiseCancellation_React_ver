const base = document.currentScript.src.match(/(.*\/)?/)[0], // fetch domain e.g. https://localhost:8443
    compilation = WebAssembly.compileStreaming(fetch(base + "rnnoise-processor.wasm")); // fetch full url e.g. https://localhost:8443/rnnoise-processor.wasm

let module, instance, heapFloat32;

class RNNoiseNode extends AudioWorkletNode
{
    static async register(context)
    {
        module = await compilation;
        await context.audioWorklet.addModule(base + "rnnoise-processor.js");
    }
    constructor(context)
    {
        // AudioworkletNode Options
        super(context, "rnnoise",
        {
            channelCountMode: "explicit",
            channelCount: 1,
            channelInterpretation: "speakers",
            numberOfInputs: 1,
            numberOfOutputs: 1,
            outputChannelCount: [1],
            processorOptions: // AudioWorkletProcessor Option
            {
                module: module
            }
        });
    }
}
