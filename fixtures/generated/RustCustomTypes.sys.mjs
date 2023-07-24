// This file was autogenerated by the `uniffi-bindgen-gecko-js` crate.
// Trust me, you don't want to mess with it!

import { UniFFITypeError } from "resource://gre/modules/UniFFI.sys.mjs";



// Objects intended to be used in the unit tests
export var UnitTestObjs = {};

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

    toString() {
        return `UniFFIError: ${this.message}`
    }
}

class UniFFIInternalError extends UniFFIError {}

// Base class for FFI converters
class FfiConverter {
    // throw `UniFFITypeError` if a value to be converted has an invalid type
    static checkType(value) {
        if (value === undefined ) {
            throw new UniFFITypeError(`undefined`);
        }
        if (value === null ) {
            throw new UniFFITypeError(`null`);
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
UnitTestObjs.uniffiObjectPtr = uniffiObjectPtr;

// Export the FFIConverter object to make external types work.
export class FfiConverterI64 extends FfiConverter {
    static checkType(value) {
        super.checkType(value);
        if (!Number.isSafeInteger(value)) {
            throw new UniFFITypeError(`${value} exceeds the safe integer bounds`);
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
        dataStream.writeInt64(value)
    }
    static read(dataStream) {
        return dataStream.readInt64()
    }
}

// Export the FFIConverter object to make external types work.
export class FfiConverterString extends FfiConverter {
    static checkType(value) {
        super.checkType(value);
        if (typeof value !== "string") {
            throw new UniFFITypeError(`${value} is not a string`);
        }
    }

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

export class CustomTypesDemo {
    constructor(url,handle) {
        try {
            FfiConverterTypeUrl.checkType(url)
        } catch (e) {
            if (e instanceof UniFFITypeError) {
                e.addItemDescriptionPart("url");
            }
            throw e;
        }
        try {
            FfiConverterTypeHandle.checkType(handle)
        } catch (e) {
            if (e instanceof UniFFITypeError) {
                e.addItemDescriptionPart("handle");
            }
            throw e;
        }
        this.url = url;
        this.handle = handle;
    }
    equals(other) {
        return (
            this.url == other.url &&
            this.handle == other.handle
        )
    }
}

// Export the FFIConverter object to make external types work.
export class FfiConverterTypeCustomTypesDemo extends FfiConverterArrayBuffer {
    static read(dataStream) {
        return new CustomTypesDemo(
            FfiConverterTypeUrl.read(dataStream), 
            FfiConverterTypeHandle.read(dataStream)
        );
    }
    static write(dataStream, value) {
        FfiConverterTypeUrl.write(dataStream, value.url);
        FfiConverterTypeHandle.write(dataStream, value.handle);
    }

    static computeSize(value) {
        let totalSize = 0;
        totalSize += FfiConverterTypeUrl.computeSize(value.url);
        totalSize += FfiConverterTypeHandle.computeSize(value.handle);
        return totalSize
    }

    static checkType(value) {
        super.checkType(value);
        try {
            FfiConverterTypeUrl.checkType(value.url);
        } catch (e) {
            if (e instanceof UniFFITypeError) {
                e.addItemDescriptionPart(".url");
            }
            throw e;
        }
        try {
            FfiConverterTypeHandle.checkType(value.handle);
        } catch (e) {
            if (e instanceof UniFFITypeError) {
                e.addItemDescriptionPart(".handle");
            }
            throw e;
        }
    }
}

// Export the FFIConverter object to make external types work.
export class FfiConverterOptionalTypeCustomTypesDemo extends FfiConverterArrayBuffer {
    static checkType(value) {
        if (value !== undefined && value !== null) {
            FfiConverterTypeCustomTypesDemo.checkType(value)
        }
    }

    static read(dataStream) {
        const code = dataStream.readUint8(0);
        switch (code) {
            case 0:
                return null
            case 1:
                return FfiConverterTypeCustomTypesDemo.read(dataStream)
            default:
                throw UniFFIError(`Unexpected code: ${code}`);
        }
    }

    static write(dataStream, value) {
        if (value === null || value === undefined) {
            dataStream.writeUint8(0);
            return;
        }
        dataStream.writeUint8(1);
        FfiConverterTypeCustomTypesDemo.write(dataStream, value)
    }

    static computeSize(value) {
        if (value === null || value === undefined) {
            return 1;
        }
        return 1 + FfiConverterTypeCustomTypesDemo.computeSize(value)
    }
}

// Export the FFIConverter object to make external types work.
export class FfiConverterTypeHandle extends FfiConverter {
    static lift(buf) {
        return FfiConverterI64.lift(buf);    
    }
    
    static lower(buf) {
        return FfiConverterI64.lower(buf);
    }
    
    static write(dataStream, value) {
        FfiConverterI64.write(dataStream, value);
    } 
    
    static read(buf) {
        return FfiConverterI64.read(buf);
    }
    
    static computeSize(value) {
        return FfiConverterI64.computeSize(value);
    }
}
// TODO: We should also allow JS to customize the type eventually.

// Export the FFIConverter object to make external types work.
export class FfiConverterTypeUrl extends FfiConverter {
    static lift(buf) {
        return FfiConverterString.lift(buf);    
    }
    
    static lower(buf) {
        return FfiConverterString.lower(buf);
    }
    
    static write(dataStream, value) {
        FfiConverterString.write(dataStream, value);
    } 
    
    static read(buf) {
        return FfiConverterString.read(buf);
    }
    
    static computeSize(value) {
        return FfiConverterString.computeSize(value);
    }
}
// TODO: We should also allow JS to customize the type eventually.





export function getCustomTypesDemo(demo) {

        const liftResult = (result) => FfiConverterTypeCustomTypesDemo.lift(result);
        const liftError = null;
        const functionCall = () => {
            try {
                FfiConverterOptionalTypeCustomTypesDemo.checkType(demo)
            } catch (e) {
                if (e instanceof UniFFITypeError) {
                    e.addItemDescriptionPart("demo");
                }
                throw e;
            }
            return UniFFIScaffolding.callAsync(
                109, // custom_types:uniffi_custom_types_fn_func_get_custom_types_demo
                FfiConverterOptionalTypeCustomTypesDemo.lower(demo),
            )
        }
        try {
            return functionCall().then((result) => handleRustResult(result, liftResult, liftError));
        }  catch (error) {
            return Promise.reject(error)
        }
}