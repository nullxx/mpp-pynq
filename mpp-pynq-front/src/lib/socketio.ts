import { Socket } from "socket.io-client";
import { SocketEvents, SocketData, SocketResponse, UIUpdateCallbackFn } from "./core/types";

const RESPONSE_SUFFIX = '_done';
const ERROR_SUFFIX = '_error';

function generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
export const uiUpdatesSubscriptions = new Set<UIUpdateCallbackFn>();
export function notifyUpdateToSubscribers() {
    uiUpdatesSubscriptions.forEach((callback) => callback());
}

const callbacks = new Map<string, (response: any) => void>();
const callbacksError = new Map<string, (response: any) => void>();

let updateUIInited = false;
// i want to listen all events but only one listener for each event.

// const listeners = new Map<string, { id: string; cb: (data: any) => void; cbErr: (data: any) => void }>();

export function emitWithReturn<T extends SocketEvents>(socket: Socket, event: T, data: SocketData[T]): Promise<SocketResponse[T]> {
    if (!updateUIInited) {
        updateUIInited = true;
        socket.on('update_ui', notifyUpdateToSubscribers);
    }
    return new Promise((resolve, reject) => {
        // const id = generateId();
        // listeners.set(event, {
        //     id,
        //     cb: resolve,
        //     cbErr: reject
        // });

        // if (!callbacks.has(event)) {
        //     const callback = (response: any) => {
        //         const listener = listeners.get(event);
        //         if (listener && listener.id === response.id) {
        //             console.log(event, data, response);
        //             listener.cb(response);
        //         }
        //     }

        //     const callbackError = (response: any) => {
        //         const listener = listeners.get(event);
        //         if (listener && listener.id === response.id) {
        //             listener.cbErr(response);
        //         }
        //     }
        //     callbacks.set(event, callback);
        //     callbacksError.set(event, callbackError);
        //     socket.on(event + RESPONSE_SUFFIX, callback);
        //     socket.on(event + ERROR_SUFFIX, callbackError);
        // }

        // socket.emit(event, { ...data, id });

        const id = generateId();

        const listener = (data: any) => {
            if (data.id === id) {
                if (data.error) {
                    reject(data.error);
                } else {
                    socket.off(event + RESPONSE_SUFFIX, listener);
                    resolve(data);
                }
            }
        }

        socket.on(event + RESPONSE_SUFFIX, listener);
        socket.emit(event, { ...data, id });
    });
}

export function removeAllListeners(socket: Socket) {
    callbacks.forEach((callback, event) => {
        socket.off(event + RESPONSE_SUFFIX, callback);
    });

    callbacksError.forEach((callback, event) => {
        socket.off(event + ERROR_SUFFIX, callback);
    });

    if (updateUIInited) {
        socket.off('update_ui', notifyUpdateToSubscribers);
    }

    callbacks.clear();
    callbacksError.clear();
}