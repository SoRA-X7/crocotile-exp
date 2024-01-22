<script setup lang="ts">
import HapticSlider from '@/components/feedback/HapticSlider.vue';
import { ref } from 'vue';

const val1 = ref(1);
</script>
<template>
  <v-container>
    <v-row>
      <HapticSlider v-model="val1" :min="1" :max="10" :step="1" />
    </v-row>
  </v-container>
</template>
