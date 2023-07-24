// This file was autogenerated by the `uniffi-bindgen-gecko-js` crate.
// Trust me, you don't want to mess with it!



"use strict";

var EXPORTED_SYMBOLS = [];

// Write/Read data to/from an ArrayBuffer
class ArrayBufferDataStream {
    constructor(arrayBuffer) {
        this.dataView = new DataView(arrayBuffer);
        this.pos = 0;
    }

    readUint8() {
        let rv = this.dataView.getUint8(this.pos);
        this.pos += 1;
        return rv;
    }

    writeUint8(value) {
        this.dataView.setUint8(this.pos, value);
        this.pos += 1;
    }

    readUint16() {
        let rv = this.dataView.getUint16(this.pos);
        this.pos += 2;
        return rv;
    }

    writeUint16(value) {
        this.dataView.setUint16(this.pos, value);
        this.pos += 2;
    }

    readUint32() {
        let rv = this.dataView.getUint32(this.pos);
        this.pos += 4;
        return rv;
    }

    writeUint32(value) {
        this.dataView.setUint32(this.pos, value);
        this.pos += 4;
    }

    readUint64() {
        let rv = this.dataView.getBigUint64(this.pos);
        this.pos += 8;
        return Number(rv);
    }

    writeUint64(value) {
        this.dataView.setBigUint64(this.pos, BigInt(value));
        this.pos += 8;
    }


    readInt8() {
        let rv = this.dataView.getInt8(this.pos);
        this.pos += 1;
        return rv;
    }

    writeInt8(value) {
        this.dataView.setInt8(this.pos, value);
        this.pos += 1;
    }

    readInt16() {
        let rv = this.dataView.getInt16(this.pos);
        this.pos += 2;
        return rv;
    }

    writeInt16(value) {
        this.dataView.setInt16(this.pos, value);
        this.pos += 2;
    }

    readInt32() {
        let rv = this.dataView.getInt32(this.pos);
        this.pos += 4;
        return rv;
    }

    writeInt32(value) {
        this.dataView.setInt32(this.pos, value);
        this.pos += 4;
    }

    readInt64() {
        let rv = this.dataView.getBigInt64(this.pos);
        this.pos += 8;
        return Number(rv);
    }

    writeInt64(value) {
        this.dataView.setBigInt64(this.pos, BigInt(value));
        this.pos += 8;
    }


    readFloat32() {
        let rv = this.dataView.getFloat32(this.pos);
        this.pos += 4;
        return rv;
    }

    writeFloat32(value) {
        this.dataView.setFloat32(this.pos, value);
        this.pos += 4;
    }

    readFloat64() {
        let rv = this.dataView.getFloat64(this.pos);
        this.pos += 8;
        return rv;
    }

    writeFloat64(value) {
        this.dataView.setFloat64(this.pos, value);
        this.pos += 8;
    }


    writeString(value) {
      const encoder = new TextEncoder();
      // Note: in order to efficiently write this data, we first write the
      // string data, reserving 4 bytes for the size.
      const dest = new Uint8Array(this.dataView.buffer, this.pos + 4);
      const encodeResult = encoder.encodeInto(value, dest);
      if (encodeResult.read != value.length) {
        throw new UniFFIError(
            "writeString: out of space when writing to ArrayBuffer.  Did the computeSize() method returned the wrong result?"
        );
      }
      const size = encodeResult.written;
      // Next, go back and write the size before the string data
      this.dataView.setUint32(this.pos, size);
      // Finally, advance our position past both the size and string data
      this.pos += size + 4;
    }

    readString() {
      const decoder = new TextDecoder();
      const size = this.readUint32();
      const source = new Uint8Array(this.dataView.buffer, this.pos, size)
      const value = decoder.decode(source);
      this.pos += size;
      return value;
    }
}

function handleRustResult(result, liftCallback, liftErrCallback) {
    switch (result.code) {
        case "success":
            return liftCallback(result.data);

        case "error":
            throw liftErrCallback(result.data);

        case "internal-error":
            let message = result.internalErrorMessage;
            if (message) {
                throw new UniFFIInternalError(message);
            } else {
                throw new UniFFIInternalError("Unknown error");
            }

        default:
            throw new UniFFIError(`Unexpected status code: ${result.code}`);
    }
}

class UniFFIError {
    constructor(message) {
        this.message = message;
    }
}

class UniFFIInternalError extends UniFFIError {}

// Base class for FFI converters
class FfiConverter {
    static checkType(name, value) {
        if (value === undefined ) {
            throw TypeError(`${name} is undefined`);
        }
        if (value === null ) {
            throw TypeError(`${name} is null`);
        }
    }
}

// Base class for FFI converters that lift/lower by reading/writing to an ArrayBuffer
class FfiConverterArrayBuffer extends FfiConverter {
    static lift(buf) {
        return this.read(new ArrayBufferDataStream(buf));
    }

    static lower(value) {
        const buf = new ArrayBuffer(this.computeSize(value));
        const dataStream = new ArrayBufferDataStream(buf);
        this.write(dataStream, value);
        return buf;
    }
}

// Symbols that are used to ensure that Object constructors
// can only be used with a proper UniFFI pointer
const uniffiObjectPtr = Symbol("uniffiObjectPtr");
const constructUniffiObject = Symbol("constructUniffiObject");

class FfiConverterU64 extends FfiConverter {
    static checkType(name, value) {
        super.checkType(name, value);
        if (!Number.isSafeInteger(value)) {
            throw TypeError(`${name} exceeds the safe integer bounds (${value})`);
        }
        if (value < 0) {
            throw TypeError(`${name} exceeds the U64 bounds (${value})`);
        }
    }
    static computeSize() {
        return 8;
    }
    static lift(value) {
        return value;
    }
    static lower(value) {
        return value;
    }
    static write(dataStream, value) {
        dataStream.writeUint64(value)
    }
    static read(dataStream) {
        return dataStream.readUint64()
    }
}class FfiConverterBool extends FfiConverter {
    static computeSize() {
        return 1;
    }
    static lift(value) {
        return value == 1;
    }
    static lower(value) {
        if (value) {
            return 1;
        } else {
            return 0;
        }
    }
    static write(dataStream, value) {
        dataStream.writeUint8(this.lower(value))
    }
    static read(dataStream) {
        return this.lift(dataStream.readUint8())
    }
}

class FfiConverterString extends FfiConverter {
    static lift(buf) {
        const decoder = new TextDecoder();
        const utf8Arr = new Uint8Array(buf);
        return decoder.decode(utf8Arr);
    }
    static lower(value) {
        const encoder = new TextEncoder();
        return encoder.encode(value).buffer;
    }

    static write(dataStream, value) {
        dataStream.writeString(value);
    }

    static read(dataStream) {
        return dataStream.readString();
    }

    static computeSize(value) {
        const encoder = new TextEncoder();
        return 4 + encoder.encode(value).length
    }
}


class ArithmeticError extends Error {}
EXPORTED_SYMBOLS.push("ArithmeticError");


class IntegerOverflow extends ArithmeticError {
    
    constructor(message, ...params) {
        super(...params);
        this.message = message;
    }
}
EXPORTED_SYMBOLS.push("IntegerOverflow");

class FfiConverterTypeArithmeticError extends FfiConverterArrayBuffer {
    static read(dataStream) {
        switch (dataStream.readInt32()) {
            case 1:
                return new IntegerOverflow(FfiConverterString.read(dataStream));
            default:
                return new Error("Unknown ArithmeticError variant");
        }
    }
}




function add(a,b) {
    
    const liftResult = (result) => FfiConverterU64.lift(result);
    const liftError = (data) => FfiConverterTypeArithmeticError.lift(data);
    const functionCall = () => {
        FfiConverterU64.checkType("a", a);
        FfiConverterU64.checkType("b", b);
        return UniFFIScaffolding.callAsync(
            2, // arithmetic:arithmetic_77d6_add
            FfiConverterU64.lower(a),
            FfiConverterU64.lower(b),
        )
    }
    try {
        return functionCall().then((result) => handleRustResult(result, liftResult, liftError));
    }  catch (error) {
        return Promise.reject(error)
    }
}

EXPORTED_SYMBOLS.push("add");
function sub(a,b) {
    
    const liftResult = (result) => FfiConverterU64.lift(result);
    const liftError = (data) => FfiConverterTypeArithmeticError.lift(data);
    const functionCall = () => {
        FfiConverterU64.checkType("a", a);
        FfiConverterU64.checkType("b", b);
        return UniFFIScaffolding.callAsync(
            3, // arithmetic:arithmetic_77d6_sub
            FfiConverterU64.lower(a),
            FfiConverterU64.lower(b),
        )
    }
    try {
        return functionCall().then((result) => handleRustResult(result, liftResult, liftError));
    }  catch (error) {
        return Promise.reject(error)
    }
}

EXPORTED_SYMBOLS.push("sub");
function div(dividend,divisor) {
    
    const liftResult = (result) => FfiConverterU64.lift(result);
    const liftError = null;
    const functionCall = () => {
        FfiConverterU64.checkType("dividend", dividend);
        FfiConverterU64.checkType("divisor", divisor);
        return UniFFIScaffolding.callAsync(
            4, // arithmetic:arithmetic_77d6_div
            FfiConverterU64.lower(dividend),
            FfiConverterU64.lower(divisor),
        )
    }
    try {
        return functionCall().then((result) => handleRustResult(result, liftResult, liftError));
    }  catch (error) {
        return Promise.reject(error)
    }
}

EXPORTED_SYMBOLS.push("div");
function equal(a,b) {
    
    const liftResult = (result) => FfiConverterBool.lift(result);
    const liftError = null;
    const functionCall = () => {
        FfiConverterU64.checkType("a", a);
        FfiConverterU64.checkType("b", b);
        return UniFFIScaffolding.callAsync(
            5, // arithmetic:arithmetic_77d6_equal
            FfiConverterU64.lower(a),
            FfiConverterU64.lower(b),
        )
    }
    try {
        return functionCall().then((result) => handleRustResult(result, liftResult, liftError));
    }  catch (error) {
        return Promise.reject(error)
    }
}

EXPORTED_SYMBOLS.push("equal");
