import fs from 'fs'
import load from './src/main'

    ; (async function () {
        console.log("Reading WASM file to memory")
        const wasm = fs.readFileSync('./src/d3des.wasm');

        console.log("Loading WASM module")
        const tool = await load(wasm)

        const inputs = [
            "the",
            "quick",
            "brown",
            "fox",
            "jumped",
            "over",
            "the",
            "lazy",
            "dog",
            "password",
            "Secure!",
        ]

        let result = true

        for (let input of inputs) {
            console.log("Testing input: " + input)
            let enc = tool.encrypt(input)
            let dec = tool.decrypt(enc)
            if (input == dec) {
                console.log("  Pass")
            } else {
                console.log([...input],  [...dec]);
                console.log(`  Failed! Got ${dec} but expected ${input}`)
                result = false
            }
        }
    })();
