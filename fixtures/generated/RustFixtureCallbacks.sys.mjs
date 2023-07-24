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


/**
 * Handler for a single UniFFI CallbackInterface
 *
 * This class stores objects that implement a callback interface in a handle
 * map, allowing them to be referenced by the Rust code using an integer
 * handle.
 *
 * While the callback object is stored in the map, it allows the Rust code to
 * call methods on the object using the callback object handle, a method id,
 * and an ArrayBuffer packed with the method arguments.
 *
 * When the Rust code drops its reference, it sends a call with the methodId=0,
 * which causes callback object to be removed from the map.
 */
class UniFFICallbackHandler {
    #name;
    #interfaceId;
    #handleCounter;
    #handleMap;
    #methodHandlers;
    #allowNewCallbacks

    /**
     * Create a UniFFICallbackHandler
     * @param {string} name - Human-friendly name for this callback interface
     * @param {int} interfaceId - Interface ID for this CallbackInterface.
     * @param {UniFFICallbackMethodHandler[]} methodHandlers -- UniFFICallbackHandler for each method, in the same order as the UDL file
     */
     constructor(name, interfaceId, methodHandlers) {
        this.#name = name;
        this.#interfaceId = interfaceId;
        this.#handleCounter = 0;
        this.#handleMap = new Map();
        this.#methodHandlers = methodHandlers;
        this.#allowNewCallbacks = true;

        UniFFIScaffolding.registerCallbackHandler(this.#interfaceId, this.invokeCallback.bind(this));
        Services.obs.addObserver(this, "xpcom-shutdown");
     }

    /**
     * Store a callback object in the handle map and return the handle
     *
     * @param {obj} callbackObj - Object that implements the callback interface
     * @returns {int} - Handle for this callback object, this is what gets passed back to Rust.
     */
    storeCallbackObj(callbackObj) {
        if (!this.#allowNewCallbacks) {
            throw new UniFFIError(`No new callbacks allowed for ${this.#name}`);
        }
        const handle = this.#handleCounter;
        this.#handleCounter += 1;
        this.#handleMap.set(handle, new UniFFICallbackHandleMapEntry(callbackObj, Components.stack.caller.formattedStack.trim()));
        return handle;
    }

    /**
     * Get a previously stored callback object
     *
     * @param {int} handle - Callback object handle, returned from `storeCallbackObj()`
     * @returns {obj} - Callback object
     */
    getCallbackObj(handle) {
        return this.#handleMap.get(handle).callbackObj;
    }

    /**
     * Set if new callbacks are allowed for this handler
     *
     * This is called with false during shutdown to ensure the callback maps don't
     * prevent JS objects from being GCed.
     */
    setAllowNewCallbacks(allow) {
        this.#allowNewCallbacks = allow
    }

    /**
     * Check that no callbacks are currently registered
     *
     * If there are callbacks registered a UniFFIError will be thrown.  This is
     * called during shutdown to generate an alert if there are leaked callback
     * interfaces.
     */
    assertNoRegisteredCallbacks() {
        if (this.#handleMap.size > 0) {
            const entry = this.#handleMap.values().next().value;
            throw new UniFFIError(`UniFFI interface ${this.#name} has ${this.#handleMap.size} registered callbacks at xpcom-shutdown. This likely indicates a UniFFI callback leak.\nStack trace for the first leaked callback:\n${entry.stackTrace}.`);
        }
    }

    /**
     * Invoke a method on a stored callback object
     * @param {int} handle - Object handle
     * @param {int} methodId - Method identifier.  This the 1-based index of
     *   the method from the UDL file.  0 is the special drop method, which
     *   removes the callback object from the handle map.
     * @param {ArrayBuffer} argsArrayBuffer - Arguments to pass to the method, packed in an ArrayBuffer
     */
    invokeCallback(handle, methodId, argsArrayBuffer) {
        try {
            this.#invokeCallbackInner(handle, methodId, argsArrayBuffer);
        } catch (e) {
            console.error(`internal error invoking callback: ${e}`)
        }
    }

    #invokeCallbackInner(handle, methodId, argsArrayBuffer) {
        const callbackObj = this.getCallbackObj(handle);
        if (callbackObj === undefined) {
            throw new UniFFIError(`${this.#name}: invalid callback handle id: ${handle}`);
        }

        // Special-cased drop method, remove the object from the handle map and
        // return an empty array buffer
        if (methodId == 0) {
            this.#handleMap.delete(handle);
            return;
        }

        // Get the method data, converting from 1-based indexing
        const methodHandler = this.#methodHandlers[methodId - 1];
        if (methodHandler === undefined) {
            throw new UniFFIError(`${this.#name}: invalid method id: ${methodId}`)
        }

        methodHandler.call(callbackObj, argsArrayBuffer);
    }

    /**
     * xpcom-shutdown observer method
     *
     * This handles:
     *  - Deregistering ourselves as the UniFFI callback handler
     *  - Checks for any leftover stored callbacks which indicate memory leaks
     */
    observe(aSubject, aTopic, aData) {
        if (aTopic == "xpcom-shutdown") {
            try {
                this.setAllowNewCallbacks(false);
                this.assertNoRegisteredCallbacks();
                UniFFIScaffolding.deregisterCallbackHandler(this.#interfaceId);
            } catch (ex) {
                console.error(`UniFFI Callback interface error during xpcom-shutdown: ${ex}`);
                Cc["@mozilla.org/xpcom/debug;1"]
                    .getService(Ci.nsIDebug2)
                    .abort(ex.filename, ex.lineNumber);
            }
         }
    }
}

/**
 * Handles calling a single method for a callback interface
 */
class UniFFICallbackMethodHandler {
    #name;
    #argsConverters;

    /**
     * Create a UniFFICallbackMethodHandler

     * @param {string} name -- Name of the method to call on the callback object
     * @param {FfiConverter[]} argsConverters - FfiConverter for each argument type
     */
    constructor(name, argsConverters) {
        this.#name = name;
        this.#argsConverters = argsConverters;
    }

    /**
     * Invoke the method
     *
     * @param {obj} callbackObj -- Object implementing the callback interface for this method
     * @param {ArrayBuffer} argsArrayBuffer -- Arguments for the method, packed in an ArrayBuffer
     */
     call(callbackObj, argsArrayBuffer) {
        const argsStream = new ArrayBufferDataStream(argsArrayBuffer);
        const args = this.#argsConverters.map(converter => converter.read(argsStream));
        callbackObj[this.#name](...args);
    }
}

/**
 * UniFFICallbackHandler.handleMap entry
 *
 * @property callbackObj - Callback object, this must implement the callback interface.
 * @property {string} stackTrace - Stack trace from when the callback object was registered.  This is used to proved extra context when debugging leaked callback objects.
 */
class UniFFICallbackHandleMapEntry {
    constructor(callbackObj, stackTrace) {
        this.callbackObj = callbackObj;
        this.stackTrace = stackTrace
    }
}

// Export the FFIConverter object to make external types work.
export class FfiConverterI32 extends FfiConverter {
    static checkType(value) {
        super.checkType(value);
        if (!Number.isInteger(value)) {
            throw new UniFFITypeError(`${value} is not an integer`);
        }
        if (value < -2147483648 || value > 2147483647) {
            throw new UniFFITypeError(`${value} exceeds the I32 bounds`);
        }
    }
    static computeSize() {
        return 4;
    }
    static lift(value) {
        return value;
    }
    static lower(value) {
        return value;
    }
    static write(dataStream, value) {
        dataStream.writeInt32(value)
    }
    static read(dataStream) {
        return dataStream.readInt32()
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


// Export the FFIConverter object to make external types work.
export class FfiConverterCallbackInterfaceLogger extends FfiConverter {
    static lower(callbackObj) {
        return callbackHandlerLogger.storeCallbackObj(callbackObj)
    }

    static lift(handleId) {
        return callbackHandlerLogger.getCallbackObj(handleId)
    }

    static read(dataStream) {
        return this.lift(dataStream.readInt64())
    }

    static write(dataStream, callbackObj) {
        dataStream.writeInt64(this.lower(callbackObj))
    }

    static computeSize(callbackObj) {
        return 8;
    }
}

// Export the FFIConverter object to make external types work.
export class FfiConverterSequencei32 extends FfiConverterArrayBuffer {
    static read(dataStream) {
        const len = dataStream.readInt32();
        const arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(FfiConverterI32.read(dataStream));
        }
        return arr;
    }

    static write(dataStream, value) {
        dataStream.writeInt32(value.length);
        value.forEach((innerValue) => {
            FfiConverterI32.write(dataStream, innerValue);
        })
    }

    static computeSize(value) {
        // The size of the length
        let size = 4;
        for (const innerValue of value) {
            size += FfiConverterI32.computeSize(innerValue);
        }
        return size;
    }

    static checkType(value) {
        if (!Array.isArray(value)) {
            throw new UniFFITypeError(`${value} is not an array`);
        }
        value.forEach((innerValue, idx) => {
            try {
                FfiConverterI32.checkType(innerValue);
            } catch (e) {
                if (e instanceof UniFFITypeError) {
                    e.addItemDescriptionPart(`[${idx}]`);
                }
                throw e;
            }
        })
    }
}


// Define callback interface handlers, this must come after the type loop since they reference the FfiConverters defined above.

const callbackHandlerLogger = new UniFFICallbackHandler(
    "fixture_callbacks:Logger",
    0,
    [
        new UniFFICallbackMethodHandler(
            "log",
            [
                FfiConverterString,
            ],
        ),
        new UniFFICallbackMethodHandler(
            "finished",
            [
            ],
        ),
    ]
);

// Allow the shutdown-related functionality to be tested in the unit tests
UnitTestObjs.callbackHandlerLogger = callbackHandlerLogger;





export function logEvenNumbers(logger,items) {

        const liftResult = (result) => undefined;
        const liftError = null;
        const functionCall = () => {
            try {
                FfiConverterCallbackInterfaceLogger.checkType(logger)
            } catch (e) {
                if (e instanceof UniFFITypeError) {
                    e.addItemDescriptionPart("logger");
                }
                throw e;
            }
            try {
                FfiConverterSequencei32.checkType(items)
            } catch (e) {
                if (e instanceof UniFFITypeError) {
                    e.addItemDescriptionPart("items");
                }
                throw e;
            }
            return UniFFIScaffolding.callAsync(
                107, // fixture_callbacks:uniffi_fixture_callbacks_fn_func_log_even_numbers
                FfiConverterCallbackInterfaceLogger.lower(logger),
                FfiConverterSequencei32.lower(items),
            )
        }
        try {
            return functionCall().then((result) => handleRustResult(result, liftResult, liftError));
        }  catch (error) {
            return Promise.reject(error)
        }
}

export function logEvenNumbersMainThread(logger,items) {

        const liftResult = (result) => undefined;
        const liftError = null;
        const functionCall = () => {
            try {
                FfiConverterCallbackInterfaceLogger.checkType(logger)
            } catch (e) {
                if (e instanceof UniFFITypeError) {
                    e.addItemDescriptionPart("logger");
                }
                throw e;
            }
            try {
                FfiConverterSequencei32.checkType(items)
            } catch (e) {
                if (e instanceof UniFFITypeError) {
                    e.addItemDescriptionPart("items");
                }
                throw e;
            }
            return UniFFIScaffolding.callSync(
                108, // fixture_callbacks:uniffi_fixture_callbacks_fn_func_log_even_numbers_main_thread
                FfiConverterCallbackInterfaceLogger.lower(logger),
                FfiConverterSequencei32.lower(items),
            )
        }
        return handleRustResult(functionCall(), liftResult, liftError);
}
