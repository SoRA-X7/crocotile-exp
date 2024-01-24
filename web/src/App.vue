<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import SerialMonitor from '@/components/SerialMonitor.vue';
import ConnectionButton from '@/components/buttons/ConnectionButton.vue';
import { useCrocotile } from '@/states/crocotile';
import DebuggerPane from './components/DebuggerPane.vue';

const openSerialMonitor = ref(false);
const openDebugger = ref(false);

const crocotile = useCrocotile();
</script>

<template>
  <v-layout>
    <v-app-bar>
      <v-app-bar-title>Crocotile | Experimental Environment</v-app-bar-title>
      <ConnectionButton />
      <v-btn icon @click="openSerialMonitor = true">
        <v-icon icon="mdi-serial-port"></v-icon>
      </v-btn>
      <v-btn icon @click="openDebugger = true">
        <v-icon icon="mdi-bug"></v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
    <v-navigation-drawer v-if="openDebugger" location="right">
      <DebuggerPane />
    </v-navigation-drawer>
    <v-dialog fullscreen v-model="openSerialMonitor" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark :elevation="8" color="primary">
          <v-toolbar-title>Serial Monitor</v-toolbar-title>
          <v-spacer />
          <ConnectionButton />
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
