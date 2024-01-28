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
  hapticDisabled: boolean;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void;
  (e: 'start'): void;
  (e: 'end'): void;
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
    0,
    -elementX.value,
    elementWidth.value - elementX.value,
    -elementY.value,
    elementHeight.value - elementY.value,
    props.max
  );
  console.log(pat);
  if (!props.hapticDisabled) {
    crocotile.send('P', JSON.stringify(pat));
  }
  mousePosXOnStart.value = elementX.value;
  mousePosYOnStart.value = elementY.value;
  emit('start');
  currentPattern.value = pat;
}

function stopPattern() {
  console.log('stop');
  if (!props.hapticDisabled) {
    crocotile.send('N');
  }

  if (localValue.value !== props.modelValue) {
    emit('update:modelValue', localValue.value);
  }
  currentPattern.value = null;
  emit('end');
}

function revisePosition() {
  // return;
  const dx = elementX.value - mousePosXOnStart.value;
  const dy = elementY.value - mousePosYOnStart.value;
  // console.log(dx, dy);
  crocotile.send('R', `${JSON.stringify(dx)},${JSON.stringify(dy)}`);
}

watchEffect(() => {
  // if (isOutside.value) return;
  if (!currentPattern.value) return;
  const strengthX = testHaptic(
    0,
    currentPattern.value,
    elementX.value / 400,
    mousePosXOnStart.value / 400
  );
  const strengthY = testHaptic(
    1,
    currentPattern.value,
    elementY.value / 400,
    mousePosYOnStart.value / 400
  );
  // console.log(strengthX, strengthY);
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
