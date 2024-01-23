<script setup lang="ts">
import HapticSlider from '@/components/feedback/HapticSlider.vue';
import { linearCases, type ExperimentResult } from '@/models/experimentCases';
import { watchEffect } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';

const localCases = [...linearCases];

const caseIndex = ref(0);
const done = computed(() => caseIndex.value === localCases.length);
const currentCase = computed(() => (done.value ? null : localCases[caseIndex.value]));
const currentResult = ref<Omit<ExperimentResult, 'case'>>({ time: 0, undergoes: 0, overruns: 0 });

const currentVal = ref(1);

const results: ExperimentResult[] = [];

const overlay = ref(false);

watchEffect(() => {
  if (currentVal.value === currentCase.value?.target) {
    console.log('correct, next');
    results.push({ case: currentCase.value, ...currentResult.value });
    overlay.value = true;
    setTimeout(() => {
      caseIndex.value += 1;
      currentVal.value = 1;
      currentResult.value = { time: 0, undergoes: 0, overruns: 0 };
      overlay.value = false;
    }, 1000);
  }
});

watchEffect(() => {
  if (done.value) {
    console.log(results);
  }
});
</script>
<template>
  <v-container>
    <v-row v-if="currentCase" class="align-center justify-center mt-16 text-h2">
      {{ currentCase.target }}
    </v-row>
    <v-row v-if="currentCase" class="align-center justify-center mt-12">
      <div :style="{ width: currentCase.width + 'px' }">
        <HapticSlider v-model="currentVal" :min="1" :max="currentCase.dots" :step="1" />
      </div>
    </v-row>
    <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
      <v-card class="pa-16">
        <v-icon color="success" icon="mdi-check-bold" />
        正解
      </v-card>
    </v-overlay>
  </v-container>
</template>
