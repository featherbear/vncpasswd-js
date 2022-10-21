const fs = require('fs');
const wasmBuffer = fs.readFileSync('a.out.wasm');
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
    const { deskey, des, memory } = wasmModule.instance.exports;

    let arr = new Uint8Array(memory.buffer)
    arr.set([23, 82, 107, 6, 35, 78, 88, 7])

    deskey(memory, 1);
    console.log(wasmModule.instance.exports.test())

    arr.set([0xd7, 0xa5, 0x14, 0xd8, 0xc5, 0x56, 0xaa, 0xde])
    des(memory, memory);

    let dec = new TextDecoder()
    console.log(dec.decode(memory.buffer.slice(0, 8)));
    // let input = new Uint8Array([0xd7, 0xa5, 0x14, 0xd8, 0xc5, 0x56, 0xaa, 0xde])
    // let output = new Uint8Array(16)


    // console.log(input, output);

    // console.log('ok');
});
