<script setup lang="ts">
import { useCrocotile } from '@/states/crocotile';
import { ref } from 'vue';

const crocotile = useCrocotile();

const loading = ref(false);

async function attempt() {
  if (loading.value) return;
  loading.value = true;
  try {
    if (crocotile.online) {
      await crocotile.disconnect();
    } else {
      if (!crocotile.selected) await crocotile.select();
      await crocotile.connect();
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-btn icon @click="attempt">
    <v-progress-circular v-if="loading" indeterminate />
    <v-icon v-else-if="crocotile.online" icon="mdi-link" color="green" />
    <v-icon v-else icon="mdi-link-off" color="red" />
  </v-btn>
</template>
