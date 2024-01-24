<script setup lang="ts">
import HapticSlider from '@/components/feedback/HapticSlider.vue';
import { linearCases, type ExperimentResult } from '@/models/experimentCases';
import { reactive, watchEffect } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';
import { stringify as csvStringify } from 'csv-stringify/browser/esm/sync';
import CountdownSpinner from '@/components/CountdownSpinner.vue';

const localCases = [...linearCases];

const state = ref<'preparation' | 'countdown' | 'ongoing'>('preparation');

const participant = ref('');

const caseIndex = ref(0);
const done = computed(() => caseIndex.value === localCases.length);
const currentCase = computed(() => (done.value ? null : localCases[caseIndex.value]));
const currentResult = reactive({ time: 0, undergoes: 0, overruns: 0 });

const startTime = ref<number | null>(null);

const currentVal = ref(1);

const results: ExperimentResult[] = [];

const overlay = ref(false);

function timerStart() {
  startTime.value ??= Date.now();
}

function download(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = fileName;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}

watchEffect(() => {
  if (!currentCase.value) return;
  if (currentVal.value === currentCase.value.target) {
    console.log('correct, next');
    currentResult.time = Date.now() - startTime.value!;
    results.push({ case: currentCase.value, ...currentResult });
    overlay.value = true;
    startTime.value = null;
    setTimeout(() => {
      caseIndex.value += 1;
      currentVal.value = 1;
      currentResult.time = 0;
      currentResult.undergoes = 0;
      currentResult.overruns = 0;
      overlay.value = false;
    }, 1000);
  } else if (currentVal.value < currentCase.value?.target) {
    currentResult.undergoes += 1;
  } else {
    currentResult.overruns += 1;
  }
});

watchEffect(() => {
  if (done.value) {
    console.log(results);
    const csv = csvStringify(results, {
      header: true
    });
    download(csv, `croc-exp-${participant.value}.csv`);
  }
});
</script>
<template>
  <v-container>
    <div v-if="state === 'preparation'">
      <v-container style="max-width: 400px">
        <v-row>
          <v-text-field v-model="participant" label="Participant ID"></v-text-field>
        </v-row>
        <v-row class="justify-center">
          <v-btn size="large" color="primary" @click="state = 'countdown'">Start</v-btn>
        </v-row>
      </v-container>
    </div>
    <div v-else-if="state === 'countdown'">
      <v-row class="align-center">
        <v-col align="center" class="h-100">
          <CountdownSpinner @fire="state = 'ongoing'" />
        </v-col>
      </v-row>
    </div>
    <div v-else-if="state === 'ongoing'">
      <v-row v-if="currentCase" class="align-center justify-center mt-16 text-h2">
        {{ currentCase.target }}
      </v-row>
      <v-row v-if="currentCase" class="align-center justify-center mt-12">
        <div :style="{ width: currentCase.width + 'px' }">
          <HapticSlider
            v-model="currentVal"
            :min="1"
            :max="currentCase.dots"
            :step="1"
            :track-size="12"
            :thumb-size="28"
            thumb-label
            @start="timerStart"
          />
        </div>
      </v-row>
      <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
        <v-card class="pa-16">
          <v-icon color="success" icon="mdi-check-bold" />
          正解
        </v-card>
      </v-overlay>
    </div>
  </v-container>
</template>
