import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useCrocotile = defineStore('crocotile', () => {
  const online = ref(false);
  const x = computed();
  return { online };
});
