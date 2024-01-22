<script setup lang="ts">
import { ref } from 'vue';
import { useEventListener, useIntervalFn, useMouseInElement } from '@vueuse/core';
import { calculateLinearHapticPattern } from '@/models/hapticPattern';
import { useCrocotile } from '@/states/crocotile';
import { watchEffect } from 'vue';

const props = defineProps<{
  modelValue: number;
  min: number;
  max: number;
  step: number;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void;
}>();

const crocotile = useCrocotile();

const sliderEl = ref<HTMLElement>();
const { elementX, elementY, elementWidth, elementHeight } = useMouseInElement(sliderEl);
const active = ref(false);
const mousePosOnStart = ref(0);
const timer = useIntervalFn(revisePosition, 400, { immediate: false });
watchEffect(() => (active.value ? timer.resume() : timer.pause()));

useEventListener(window, 'mouseup', (e) => {
  if (active.value) {
    stopPattern();
  }
  active.value = false;
});

function startPattern() {
  console.log('start');
  const pat = calculateLinearHapticPattern(
    elementX.value,
    elementWidth.value - elementX.value,
    elementY.value,
    elementHeight.value - elementY.value,
    props.step
  );
  crocotile.send('P', JSON.stringify(pat));
  mousePosOnStart.value = elementX.value;
  active.value = true;
}

function stopPattern() {
  console.log('stop');
  crocotile.send('N');
}

function revisePosition() {
  const dx = elementX.value - mousePosOnStart.value;
  console.log(dx);
  crocotile.send('R', JSON.stringify(dx));
}
</script>

<template>
  <v-slider
    :modelValue="modelValue"
    @update:modelValue="(v) => emit('update:modelValue', v)"
    @mousedown="startPattern"
    :min="min"
    :max="max"
    :step="step"
    show-ticks="always"
    ref="sliderEl"
  ></v-slider>
</template>
