<script setup lang="ts">
import { ref, watchPostEffect } from 'vue';
import FeedbackSlider from '@/components/feedback/FeedbackSlider.vue';
import { VTextarea } from 'vuetify/components';

const textDecoder = new TextDecoder();
const serialMonitor = ref('');

const device = ref<SerialPort | null>(null);
const name = ref('');

navigator.serial.addEventListener('connect', (e) => {
  // `e.target` に接続する、すなわち利用可能なポートのリストに加えます。
  console.log('connect', e);
});

navigator.serial.addEventListener('disconnect', (e) => {
  // `e.target` を利用可能なポートのリストから外します。
  console.log('disconnect', e);
});

const getPorts = () =>
  navigator.serial.getPorts().then((ports: any[]) => {
    // ページの読み込み時、`ports` を用いて利用可能なポートのリストを初期化します。
    console.log(ports);
  });

const request = () => {
  navigator.serial
    .requestPort()
    .then((port) => {
      // `port` に接続する、すなわち利用可能なポートのリストに加えます。
      port.open({ baudRate: 115200 }).then(() => {
        console.log('loaded', port);
        name.value = port.getInfo().usbProductId + '';
        reader(port);
      });
      port.addEventListener('disconnect', (e) => {
        device.value = null;
        name.value = '';
        console.log('disconnected');
      });
      device.value = port;
    })
    .catch((e) => {
      // ユーザーがポートを選択しませんでした。
      device.value = null;
    });
};

const disconnect = () => {
  device.value?.forget();
};

const reader = async (port: SerialPort) => {
  const r = port.readable.getReader();
  try {
    while (true) {
      const { value, done } = await r.read();
      if (!done) {
        console.warn('Canceled');
        // break;
      }
      const str = textDecoder.decode(value);
      serialMonitor.value += str;
    }
  } catch (e) {
    console.warn('Error', e);
  }
};

const range = ref(5);
const textArea = ref<VTextarea>();
const step = ref('10');

watchPostEffect(() => {
  serialMonitor.value;
  textArea.value?.scroll(0, textArea.value?.scrollHeight ?? 0);
});
</script>

<template>
  <main>
    <v-container>
      <v-btn @click="request">Connect</v-btn>
      <div v-if="device">
        {{ name }}
        <v-btn @click="disconnect" color="red">Disconnect</v-btn>
      </div>
      <v-combobox
        v-model="step"
        label="Steps"
        :items="['2', '5', '10', '30', '50']"
        class="w-25 ml-auto"
      ></v-combobox>
      <FeedbackSlider v-model="range" :step="Number(step)" :device="device"></FeedbackSlider>
      <v-textarea ref="textArea" v-model="serialMonitor" rows="20" readonly></v-textarea>
      <v-btn @click="serialMonitor = ''">Clear</v-btn>
    </v-container>
  </main>
</template>
