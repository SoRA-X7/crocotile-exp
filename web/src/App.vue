<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import SerialMonitor from '@/components/SerialMonitor.vue';
import { useCrocotile } from '@/states/crocotile';

const openSerialMonitor = ref(false);

const crocotile = useCrocotile();
</script>

<template>
  <v-layout>
    <v-app-bar>
      <v-app-bar-title>Experiment Environment</v-app-bar-title>
      <v-btn icon>
        <v-icon v-if="crocotile.online" icon="mdi-link-on" color="green" />
        <v-icon v-else icon="mdi-link-off" color="red" />
      </v-btn>
      <v-btn icon @click="openSerialMonitor = true">
        <v-icon icon="mdi-serial-port"></v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
    <v-dialog fullscreen v-model="openSerialMonitor" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark :elevation="8" color="primary">
          <v-toolbar-title>Serial Monitor</v-toolbar-title>
          <v-spacer />
          <v-btn icon>
            <v-icon v-if="crocotile.online" icon="mdi-link-on" color="green" />
            <v-icon v-else icon="mdi-link-off" color="red" />
          </v-btn>
          <v-btn icon dark @click="openSerialMonitor = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <SerialMonitor />
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<style scoped></style>
