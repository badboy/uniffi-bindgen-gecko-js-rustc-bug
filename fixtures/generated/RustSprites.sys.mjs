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

    // Reads a Sprite pointer from the data stream
    // UniFFI Pointers are **always** 8 bytes long. That is enforced
    // by the C++ and Rust Scaffolding code.
    readPointerSprite() {
        const pointerId = 5; // sprites:Sprite
        const res = UniFFIScaffolding.readPointer(pointerId, this.dataView.buffer, this.pos);
        this.pos += 8;
        return res;
    }

    // Writes a Sprite pointer into the data stream
    // UniFFI Pointers are **always** 8 bytes long. That is enforced
    // by the C++ and Rust Scaffolding code.
    writePointerSprite(value) {
        const pointerId = 5; // sprites:Sprite
        UniFFIScaffolding.writePointer(pointerId, value, this.dataView.buffer, this.pos);
        this.pos += 8;
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
export class FfiConverterF64 extends FfiConverter {
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
        dataStream.writeFloat64(value)
    }
    static read(dataStream) {
        return dataStream.readFloat64()
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

export class Sprite {
    // Use `init` to instantiate this class.
    // DO NOT USE THIS CONSTRUCTOR DIRECTLY
    constructor(opts) {
        if (!Object.prototype.hasOwnProperty.call(opts, constructUniffiObject)) {
            throw new UniFFIError("Attempting to construct an object using the JavaScript constructor directly" +
            "Please use a UDL defined constructor, or the init function for the primary constructor")
        }
        if (!opts[constructUniffiObject] instanceof UniFFIPointer) {
            throw new UniFFIError("Attempting to create a UniFFI object with a pointer that is not an instance of UniFFIPointer")
        }
        this[uniffiObjectPtr] = opts[constructUniffiObject];
    }
    /**
     * An async constructor for Sprite.
     * 
     * @returns {Promise<Sprite>}: A promise that resolves
     *      to a newly constructed Sprite
     */
    static init(initialPosition) {
        const liftResult = (result) => FfiConverterTypeSprite.lift(result);
        const liftError = null;
        const functionCall = () => {
            try {
                FfiConverterOptionalTypePoint.checkType(initialPosition)
            } catch (e) {
                if (e instanceof UniFFITypeError) {
                    e.addItemDescriptionPart("initialPosition");
                }
                throw e;
            }
            return UniFFIScaffolding.callAsync(
                86, // sprites:uniffi_sprites_fn_constructor_sprite_new
                FfiConverterOptionalTypePoint.lower(initialPosition),
            )
        }
        try {
            return functionCall().then((result) => handleRustResult(result, liftResult, liftError));
        }  catch (error) {
            return Promise.reject(error)
        }}
    /**
     * An async constructor for Sprite.
     * 
     * @returns {Promise<Sprite>}: A promise that resolves
     *      to a newly constructed Sprite
     */
    static newRelativeTo(reference,direction) {
        const liftResult = (result) => FfiConverterTypeSprite.lift(result);
        const liftError = null;
        const functionCall = () => {
            try {
                FfiConverterTypePoint.checkType(reference)
            } catch (e) {
                if (e instanceof UniFFITypeError) {
                    e.addItemDescriptionPart("reference");
                }
                throw e;
            }
            try {
                FfiConverterTypeVector.checkType(direction)
            } catch (e) {
                if (e instanceof UniFFITypeError) {
                    e.addItemDescriptionPart("direction");
                }
                throw e;
            }
            return UniFFIScaffolding.callAsync(
                87, // sprites:uniffi_sprites_fn_constructor_sprite_new_relative_to
                FfiConverterTypePoint.lower(reference),
                FfiConverterTypeVector.lower(direction),
            )
        }
        try {
            return functionCall().then((result) => handleRustResult(result, liftResult, liftError));
        }  catch (error) {
            return Promise.reject(error)
        }}

    getPosition() {
        const liftResult = (result) => FfiConverterTypePoint.lift(result);
        const liftError = null;
        const functionCall = () => {
            return UniFFIScaffolding.callAsync(
                88, // sprites:uniffi_sprites_fn_method_sprite_get_position
                FfiConverterTypeSprite.lower(this),
            )
        }
        try {
            return functionCall().then((result) => handleRustResult(result, liftResult, liftError));
        }  catch (error) {
            return Promise.reject(error)
        }
    }

    moveTo(position) {
        const liftResult = (result) => undefined;
        const liftError = null;
        const functionCall = () => {
            try {
                FfiConverterTypePoint.checkType(position)
            } catch (e) {
                if (e instanceof UniFFITypeError) {
                    e.addItemDescriptionPart("position");
                }
                throw e;
            }
            return UniFFIScaffolding.callAsync(
                89, // sprites:uniffi_sprites_fn_method_sprite_move_to
                FfiConverterTypeSprite.lower(this),
                FfiConverterTypePoint.lower(position),
            )
        }
        try {
            return functionCall().then((result) => handleRustResult(result, liftResult, liftError));
        }  catch (error) {
            return Promise.reject(error)
        }
    }

    moveBy(direction) {
        const liftResult = (result) => undefined;
        const liftError = null;
        const functionCall = () => {
            try {
                FfiConverterTypeVector.checkType(direction)
            } catch (e) {
                if (e instanceof UniFFITypeError) {
                    e.addItemDescriptionPart("direction");
                }
                throw e;
            }
            return UniFFIScaffolding.callAsync(
                90, // sprites:uniffi_sprites_fn_method_sprite_move_by
                FfiConverterTypeSprite.lower(this),
                FfiConverterTypeVector.lower(direction),
            )
        }
        try {
            return functionCall().then((result) => handleRustResult(result, liftResult, liftError));
        }  catch (error) {
            return Promise.reject(error)
        }
    }

}

// Export the FFIConverter object to make external types work.
export class FfiConverterTypeSprite extends FfiConverter {
    static lift(value) {
        const opts = {};
        opts[constructUniffiObject] = value;
        return new Sprite(opts);
    }

    static lower(value) {
        return value[uniffiObjectPtr];
    }

    static read(dataStream) {
        return this.lift(dataStream.readPointerSprite());
    }

    static write(dataStream, value) {
        dataStream.writePointerSprite(value[uniffiObjectPtr]);
    }

    static computeSize(value) {
        return 8;
    }
}

export class Point {
    constructor(x,y) {
        try {
            FfiConverterF64.checkType(x)
        } catch (e) {
            if (e instanceof UniFFITypeError) {
                e.addItemDescriptionPart("x");
            }
            throw e;
        }
        try {
            FfiConverterF64.checkType(y)
        } catch (e) {
            if (e instanceof UniFFITypeError) {
                e.addItemDescriptionPart("y");
            }
            throw e;
        }
        this.x = x;
        this.y = y;
    }
    equals(other) {
        return (
            this.x == other.x &&
            this.y == other.y
        )
    }
}

// Export the FFIConverter object to make external types work.
export class FfiConverterTypePoint extends FfiConverterArrayBuffer {
    static read(dataStream) {
        return new Point(
            FfiConverterF64.read(dataStream), 
            FfiConverterF64.read(dataStream)
        );
    }
    static write(dataStream, value) {
        FfiConverterF64.write(dataStream, value.x);
        FfiConverterF64.write(dataStream, value.y);
    }

    static computeSize(value) {
        let totalSize = 0;
        totalSize += FfiConverterF64.computeSize(value.x);
        totalSize += FfiConverterF64.computeSize(value.y);
        return totalSize
    }

    static checkType(value) {
        super.checkType(value);
        try {
            FfiConverterF64.checkType(value.x);
        } catch (e) {
            if (e instanceof UniFFITypeError) {
                e.addItemDescriptionPart(".x");
            }
            throw e;
        }
        try {
            FfiConverterF64.checkType(value.y);
        } catch (e) {
            if (e instanceof UniFFITypeError) {
                e.addItemDescriptionPart(".y");
            }
            throw e;
        }
    }
}

export class Vector {
    constructor(dx,dy) {
        try {
            FfiConverterF64.checkType(dx)
        } catch (e) {
            if (e instanceof UniFFITypeError) {
                e.addItemDescriptionPart("dx");
            }
            throw e;
        }
        try {
            FfiConverterF64.checkType(dy)
        } catch (e) {
            if (e instanceof UniFFITypeError) {
                e.addItemDescriptionPart("dy");
            }
            throw e;
        }
        this.dx = dx;
        this.dy = dy;
    }
    equals(other) {
        return (
            this.dx == other.dx &&
            this.dy == other.dy
        )
    }
}

// Export the FFIConverter object to make external types work.
export class FfiConverterTypeVector extends FfiConverterArrayBuffer {
    static read(dataStream) {
        return new Vector(
            FfiConverterF64.read(dataStream), 
            FfiConverterF64.read(dataStream)
        );
    }
    static write(dataStream, value) {
        FfiConverterF64.write(dataStream, value.dx);
        FfiConverterF64.write(dataStream, value.dy);
    }

    static computeSize(value) {
        let totalSize = 0;
        totalSize += FfiConverterF64.computeSize(value.dx);
        totalSize += FfiConverterF64.computeSize(value.dy);
        return totalSize
    }

    static checkType(value) {
        super.checkType(value);
        try {
            FfiConverterF64.checkType(value.dx);
        } catch (e) {
            if (e instanceof UniFFITypeError) {
                e.addItemDescriptionPart(".dx");
            }
            throw e;
        }
        try {
            FfiConverterF64.checkType(value.dy);
        } catch (e) {
            if (e instanceof UniFFITypeError) {
                e.addItemDescriptionPart(".dy");
            }
            throw e;
        }
    }
}

// Export the FFIConverter object to make external types work.
export class FfiConverterOptionalTypePoint extends FfiConverterArrayBuffer {
    static checkType(value) {
        if (value !== undefined && value !== null) {
            FfiConverterTypePoint.checkType(value)
        }
    }

    static read(dataStream) {
        const code = dataStream.readUint8(0);
        switch (code) {
            case 0:
                return null
            case 1:
                return FfiConverterTypePoint.read(dataStream)
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
        FfiConverterTypePoint.write(dataStream, value)
    }

    static computeSize(value) {
        if (value === null || value === undefined) {
            return 1;
        }
        return 1 + FfiConverterTypePoint.computeSize(value)
    }
}





export function translate(position,direction) {

        const liftResult = (result) => FfiConverterTypePoint.lift(result);
        const liftError = null;
        const functionCall = () => {
            try {
                FfiConverterTypePoint.checkType(position)
            } catch (e) {
                if (e instanceof UniFFITypeError) {
                    e.addItemDescriptionPart("position");
                }
                throw e;
            }
            try {
                FfiConverterTypeVector.checkType(direction)
            } catch (e) {
                if (e instanceof UniFFITypeError) {
                    e.addItemDescriptionPart("direction");
                }
                throw e;
            }
            return UniFFIScaffolding.callAsync(
                91, // sprites:uniffi_sprites_fn_func_translate
                FfiConverterTypePoint.lower(position),
                FfiConverterTypeVector.lower(direction),
            )
        }
        try {
            return functionCall().then((result) => handleRustResult(result, liftResult, liftError));
        }  catch (error) {
            return Promise.reject(error)
        }
}
