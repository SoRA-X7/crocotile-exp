import { until } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed } from 'vue';
import { ref } from 'vue';

type CrocotileCommand =
  | 'P' // set linear haptic pattern
  | 'N' // revoke pattern
  | 'R'; // revise cursor position

export const useCrocotile = defineStore('crocotile', () => {
  const port = ref<SerialPort | null>(null);
  const online = ref(false);
  const selected = computed(() => port.value !== null);
  const serialLog = ref('');

  const textDecoder = new TextDecoder();

  const textEncoder = new TextEncoder();

  const reader = ref<ReadableStreamDefaultReader<any> | null>(null);
  const toClose = ref(false);

  async function select() {
    try {
      if (online.value) {
        await disconnect();
      }

      const p = await navigator.serial.requestPort();
      p.addEventListener('disconnect', () => {
        console.log('disconnected');
        if (port.value === p) {
          online.value = false;
          port.value = null;
        }
      });

      console.log(p);
      port.value = p;
    } catch (e) {
      if (e instanceof DOMException) {
        console.log('no ports selected');
      }
    }
  }
  async function connect() {
    if (!port.value) return;
    await port.value?.open({ baudRate: 115200 });
    online.value = true;
    logger();
  }
  async function disconnect() {
    if (!port.value || !online.value) return;
    toClose.value = true;
    reader.value?.cancel();
    await until(toClose).toBe(false);
    await port.value?.close();
    online.value = false;
  }

  async function logger() {
    while (online.value && port.value && port.value.readable) {
      if (toClose.value) {
        toClose.value = true;
        return;
      }
      reader.value = port.value.readable.getReader();
      try {
        while (true) {
          const { value, done } = await reader.value.read();
          if (done) {
            // |reader| がキャンセルされました。
            console.log('break');
            break;
          }
          // |value| について何かをする
          const str = textDecoder.decode(value);
          serialLog.value += str;
        }
      } catch (error) {
        // |error| を処理する
        console.warn(error);
      } finally {
        reader.value.releaseLock();
        reader.value = null;
      }
    }
  }

  async function send(command: CrocotileCommand, data = '') {
    if (command.length !== 1) throw new RangeError('command must be a char');
    const writer = port.value?.writable?.getWriter();
    if (!writer) {
      console.error('could not get writer');
      return;
    }
    writer.write(textEncoder.encode(command));
    writer.write(textEncoder.encode(data));
    writer.write(textEncoder.encode('\n'));
    writer.close();
  }

  return {
    // Port Operation
    online,
    selected,
    select,
    connect,
    disconnect,
    // Serial Monitor
    serialLog,
    // Write
    send
  };
});
