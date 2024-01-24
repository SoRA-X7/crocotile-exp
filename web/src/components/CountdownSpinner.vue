<script setup lang="ts">
import { useRafFn } from '@vueuse/core';
import { watchEffect } from 'vue';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    time?: number;
  }>(),
  {
    time: 3
  }
);

const emit = defineEmits<{
  (e: 'fire'): void;
}>();

const startTime = ref(0);
const remaining = ref(0);
const seconds = computed(() => Math.ceil(remaining.value));
const float = computed(() => seconds.value - remaining.value);
// const fill = computed(() => 2 * (float.value < 0.5 ? float.value : 1 - float.value));
// const rot = computed(() => Math.max(float.value * 2 - 1, 0));

// watchEffect(() => console.log(fill.value));

onMounted(() => (startTime.value = Date.now()));

const { pause, resume } = useRafFn(() => {
  remaining.value = props.time - (Date.now() - startTime.value) / 1000;
  if (remaining.value <= 0) {
    emit('fire');
  }
});
</script>

<template>
  <v-progress-circular :modelValue="20" :rotate="float * 360" size="100" width="10" color="success">
    {{ seconds }}
  </v-progress-circular>
</template>
