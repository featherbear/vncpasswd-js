const fs = require('fs');
const wasmBuffer = fs.readFileSync('./d3des.wasm');

const s_fixedkey = [23, 82, 107, 6, 35, 78, 88, 7]

WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
    let enc = new TextEncoder()
    let dec = new TextDecoder()

    const { deskey, des, memory } = wasmModule.instance.exports;

    let arr = new Uint8Array(memory.buffer)


    const work = (data, mode) => {
        arr.set(s_fixedkey)
        deskey(memory, mode);

        arr.set(data)
        des(memory, memory);
    }
    const encrypt = (password) => work(password, 0)
    const decrypt = (bytes) => work(bytes, 1)


    decrypt([0xd7, 0xa5, 0x14, 0xd8, 0xc5, 0x56, 0xaa, 0xde])

    // encrypt(enc.encode("Securea!"))
    console.log(dec.decode(memory.buffer.slice(0, 8)));
    // let input = new Uint8Array([0xd7, 0xa5, 0x14, 0xd8, 0xc5, 0x56, 0xaa, 0xde])
    // let output = new Uint8Array(16)
});