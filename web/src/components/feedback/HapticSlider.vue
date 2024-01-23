<script setup lang="ts">
import { ref, watch, watchEffect, nextTick, computed } from 'vue';
import { useEventListener, useIntervalFn, useMouseInElement } from '@vueuse/core';
import {
  type HapticPattern,
  calculateLinearHapticPattern,
  testHaptic
} from '@/models/hapticPattern';
import { useCrocotile } from '@/states/crocotile';

const props = defineProps<{
  modelValue: number;
  min: number;
  max: number;
  step: number;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void;
}>();

const localValue = ref(props.modelValue);
watch(props, async () => {
  await nextTick();
  localValue.value = props.modelValue;
});

const crocotile = useCrocotile();

const sliderEl = ref<HTMLElement>();
const { elementX, elementY, elementWidth, elementHeight, isOutside } = useMouseInElement(sliderEl);
const currentPattern = ref<HapticPattern | null>(null);
const active = computed(() => !!currentPattern.value);
const mousePosXOnStart = ref(0);
const mousePosYOnStart = ref(0);
const timer = useIntervalFn(revisePosition, 400, { immediate: false });
watchEffect(() => (active.value ? timer.resume() : timer.pause()));

useEventListener(window, 'mouseup', (e) => {
  if (active.value) {
    stopPattern();
  }
});

function startPattern() {
  console.log('start');
  const pat = calculateLinearHapticPattern(
    -elementX.value,
    elementWidth.value - elementX.value,
    -elementY.value,
    elementHeight.value - elementY.value,
    props.max
  );
  console.log(pat);
  crocotile.send('P', JSON.stringify(pat));
  mousePosXOnStart.value = elementX.value;
  mousePosYOnStart.value = elementY.value;
  currentPattern.value = pat;
}

function stopPattern() {
  console.log('stop');
  crocotile.send('N');

  if (localValue.value !== props.modelValue) {
    emit('update:modelValue', localValue.value);
  }
  currentPattern.value = null;
}

function revisePosition() {
  return;
  const dx = elementX.value - mousePosXOnStart.value;
  const dy = elementY.value - mousePosYOnStart.value;
  console.log(dx, dy);
  crocotile.send('R', `${JSON.stringify(dx)},${JSON.stringify(dy)}`);
}

const preview = ref(0);
watchEffect(() => {
  if (isOutside.value) return;
  if (!currentPattern.value) return;
  const strength = testHaptic(
    currentPattern.value,
    elementX.value / 400,
    mousePosXOnStart.value / 400
  );
  console.log(strength);
});
</script>

<template>
  <v-slider
    :modelValue="localValue"
    @update:modelValue="(v) => (localValue = v)"
    @mousedown="startPattern"
    :min="min"
    :max="max"
    :step="step"
    show-ticks="always"
    tick-size="4"
    ref="sliderEl"
  >
    <template #prepend>
      {{ min }}
    </template>
    <template #append>
      {{ max }}
    </template>
  </v-slider>
</template>
