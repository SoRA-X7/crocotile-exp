<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMouseInElement } from '@vueuse/core';
import { encode } from '@msgpack/msgpack';
import { calculateLinearHapticPattern, type HapticPattern } from '@/models/hapticPattern';

const enc = new TextEncoder();

const props = defineProps<{
  modelValue: number;
  step: number;
  device: SerialPort | null;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void;
}>();

const sliderEl = ref<HTMLElement>();
const { elementX, elementWidth } = useMouseInElement(sliderEl);
const mousePosOnStart = ref(0);
let revisePositionTimer = 0;

const device = computed(() => props.device);

// const write = (command: string, data: Uint8Array = new Uint8Array(0)) => {
const write = (command: string, data: string = '') => {
  if (!device.value?.writable) {
    console.warn('not writable');
    return;
  }
  const writer = device.value.writable.getWriter();
  writer.write(enc.encode(command));
  // writer.write(data);
  writer.write(enc.encode(data));
  writer.write(enc.encode('\n'));
  writer.close();
};

const startPattern = (e: MouseEvent) => {
  console.log('start');
  if (!e.target) return;
  const pat = calculateLinearHapticPattern(
    elementX.value,
    elementWidth.value - elementX.value,
    props.step
  );
  console.log(pat);
  //   const encoded = encode(pat);
  const encoded = JSON.stringify(pat);
  console.log(encoded);
  write('P', encoded);
  mousePosOnStart.value = elementX.value;
  revisePositionTimer = setInterval(revisePosition, 400);
};

const stopPattern = (e: MouseEvent) => {
  console.log('stop');
  write('N');
  clearInterval(revisePositionTimer);
  revisePositionTimer = 0;
};

const revisePosition = () => {
  const dx = elementX.value - mousePosOnStart.value;
  console.log(dx);
  write('R', JSON.stringify(dx));
};
</script>

<template>
  <v-slider
    :modelValue="modelValue"
    @update:modelValue="(v) => emit('update:modelValue', v)"
    @mousedown="startPattern"
    @mouseup="stopPattern"
    :min="1"
    :max="step"
    :step="1"
    show-ticks="always"
    ref="sliderEl"
  ></v-slider>
</template>
