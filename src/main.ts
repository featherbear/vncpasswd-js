interface ModuleInterface {
    encrypt(password: string): number[]
    decrypt(bytes: number[]): string
}

function load(wasmSource: WebAssembly.Instance): ModuleInterface
function load(wasmSource: BufferSource): Promise<ModuleInterface>
function load(wasmSource: BufferSource | WebAssembly.Instance) {
    if (!(wasmSource instanceof WebAssembly.Instance)) {
        return WebAssembly.instantiate(wasmSource).then(s => load(s.instance))
    }

    const s_fixedkey = [23, 82, 107, 6, 35, 78, 88, 7]

    let enc = new TextEncoder()
    let dec = new TextDecoder()

    const { deskey, des }: { [fnName: string]: Function } = <any>wasmSource.exports;
    const { memory }: { memory: WebAssembly.Memory } = <any>wasmSource.exports
    let arr = new Uint8Array(memory.buffer)

    const work = (data: Uint8Array, mode: number) => {
        arr.set(s_fixedkey)
        deskey(memory, mode);

        arr.fill(0, 0, 8)
        arr.set(data)
        des(memory, memory);
    }

    return {
        encrypt(password: string) {
            work(enc.encode(password), 0)
            return [...new Uint8Array(memory.buffer.slice(0, 8))]
        },
        decrypt(bytes: number[]) {
            work(new Uint8Array(bytes), 1)
            let result = new Uint8Array(memory.buffer.slice(0, 8))
            let zeroPos = result.indexOf(0)
            return dec.decode(result.slice(0, (zeroPos == -1) ? 8 : zeroPos))
        }
    }
}

export default load