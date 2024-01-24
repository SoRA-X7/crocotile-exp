<script setup lang="ts">
import { reactive } from 'vue';

const latest = reactive({
  xPower: 0,
  yPower: 0
});
</script>

<template>
  <v-list>
    <v-list-item>
      <template #prepend>
        <v-icon v-if="latest.xPower >= 1" icon="mdi-arrow-right-bold" />
        <v-icon v-else-if="latest.xPower <= -1" icon="mdi-arrow-left-bold" />
        <v-icon v-else icon="mdi-circle-outline" />
      </template>
      <v-list-item-title v-text="'X: ' + latest.xPower" />
    </v-list-item>
    <v-list-item>
      <template #prepend>
        <v-icon v-if="latest.yPower >= 1" icon="mdi-arrow-down-bold" />
        <v-icon v-else-if="latest.yPower <= -1" icon="mdi-arrow-up-bold" />
        <v-icon v-else icon="mdi-circle-outline" />
      </template>
      <v-list-item-title v-text="'Y: ' + latest.xPower" />
    </v-list-item>
  </v-list>
</template>
