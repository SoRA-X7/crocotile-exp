import { defineStore } from 'pinia';
import { computed } from 'vue';
import { ref } from 'vue';

export const useCrocotile = defineStore('crocotile', () => {
  const port = ref<SerialPort | null>(null);
  const online = ref(false);
  const selected = computed(() => port.value !== null);

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
  }
  async function disconnect() {
    if (!port.value || !online.value) return;
    await port.value?.close();
    online.value = false;
  }

  return { online, selected, select, connect, disconnect };
});
