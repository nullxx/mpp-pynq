import { io } from 'socket.io-client';

import type { MppCore, UIUpdateCallbackFn } from "./types";
import { removeAllListeners, uiUpdatesSubscriptions } from '../socketio';
import { getMppCoreWrapped } from './wrapped';
import toast from 'react-hot-toast';
import { getStoredValue } from '../storage';
import { SettingDefaultValue, SettingType } from '../../pages/CPUTable/components/Settings';

export let mppCore: MppCore | null;

let initializingLastMsg = "";

type InitializingMessageChangeCallback = (msg: string) => void;
const initializingMessageChangeListeners = new Set<InitializingMessageChangeCallback>();

const url = getStoredValue(SettingType.API_CONFIG_URL, SettingDefaultValue.API_CONFIG_URL);
if (!url) throw new Error("API URL not defined");

export const socket = io(url, {
  autoConnect: false
});


export function onInitializingMessageChange(callback: InitializingMessageChangeCallback) {
  initializingMessageChangeListeners.add(callback);
  callback(initializingLastMsg);

  return () => initializingMessageChangeListeners.delete(callback);
}

function setInitializingMessage(msg: string) {
  initializingLastMsg = msg;
  initializingMessageChangeListeners.forEach(cb => cb(msg));
}

export async function loadInstance(): Promise<void> {
  mppCore = getMppCoreWrapped(socket);
}

export async function connectBackend(resolve: () => void) {
  let resolved = false;

  if (mppCore) {
    console.warn("MppCore already loaded");
    return;
  }

  const pendingToasts: string[] = [];

  const onConnect = async () => {
    console.info("Connected to backend");
    setInitializingMessage("Connected to API backend");

    if (document.querySelector('.App')!.classList.contains('reconnecting-disabled')) {
      document.querySelector('.App')!.classList.toggle('reconnecting-disabled');
    }
    if (pendingToasts.length > 0) {
      pendingToasts.forEach(toast.dismiss);
      toast.success("Reconnected to API");
    }

    if (!resolved) {
      await loadInstance();
    }

    const clientCount = await execute("get_client_count"); // 1 is the current client
    if (clientCount > 1) {
      const prep = clientCount === 2 ? "is" : "are";
      const prefixPlural = clientCount === 2 ? "another" : "other";
      const s = clientCount === 2 ? "" : "s";
      setInitializingMessage(`There ${prep} ${prefixPlural} ${clientCount === 2 ? '' : clientCount-1} client${s} connected to the API. Loading read-only mode!`);
      toast(`There ${prep} ${prefixPlural} ${clientCount === 2 ? '' : clientCount-1} client${s} connected to the API. Loading read-only mode!`, {
        duration: 5000,
        icon: "🔒",
        style: {
          backgroundColor: "#f0ad4e",
          color: "#fff"
        }
      }
      );

      resolved = true;
      resolve();
      setTimeout(() => {
        const elements = document.querySelectorAll("button, input, select");
        elements.forEach((element) => {
          element.setAttribute("disabled", "true");
        });

        setTimeout(() => {
          toast("Read only mode is enabled", {
            duration: Infinity,
            icon: "🔒",
            style: {
              backgroundColor: "#f0ad4e",
              color: "#fff"
            }
          });
        }, 4000);
      }, 1000);
      return;
    }

    setInitializingMessage("Reseting PL...");
    await execute("reset_pl");

    setInitializingMessage("Downloading bitstream...");
    await execute("download_bitstream");

    setInitializingMessage("Reseting...");
    await execute("reset");

    setInitializingMessage("Ready 😉");

    resolved = true;
    resolve();
  }

  const onDisconnect = () => {
    console.info("Disconnected from backend");
    document.querySelector('.App')!.classList.toggle('reconnecting-disabled');
    pendingToasts.push(toast.loading("Disconnected from API"));
    setInitializingMessage("Disconnected from API");
  }

  let errCount = 0;
  let lastErr = "";
  const onError = (error: any) => {
    console.error("Error on connection", error);
    setInitializingMessage(`Error on connection: ${error.message} ${errCount > 0 ? `(${errCount})` : ""}`);

    if (lastErr === error.message) {
      errCount++;
    } else {
      errCount = 0;
    }
    lastErr = error.message;
  }

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);
  socket.on("connect_error", onError);
  socket.on("connect_timeout", onError);
  socket.on("error", onError);

  socket.connect();
  setInitializingMessage("Connecting to API backend...");
}

export async function disconnectBackend() {
  if (!mppCore) {
    console.warn("MppCore not loaded");
    setInitializingMessage("MppCore not loaded");
    return;
  }

  await execute("shutdown");

  removeAllListeners(socket);

  socket.disconnect();
  mppCore = null;
}

export function getCore() {
  if (!mppCore) throw new Error("MppCore not loaded");
  return mppCore;
}

export async function execute<T = any>(method: keyof MppCore, ...args: unknown[]) {
  if (!mppCore) throw new Error("MppCore not loaded");
  const response = await (mppCore[method as keyof MppCore] as Function)(...args);
  return response as T;
}

export function subscribeToUIUpdates(callback: UIUpdateCallbackFn) {
  uiUpdatesSubscriptions.add(callback);
}

export function unsubscribeToUIUpdates(callback: UIUpdateCallbackFn) {
  uiUpdatesSubscriptions.delete(callback);
}