<script setup lang="ts">
import { useCrocotile } from '@/states/crocotile';

const crocotile = useCrocotile();
</script>

<template>
  <v-container>
    <v-row>
      <v-btn @click="crocotile.select()">Select</v-btn>
      <v-btn v-if="crocotile.selected && !crocotile.online" @click="crocotile.connect()">
        Connect
      </v-btn>
      <v-btn v-if="crocotile.selected && crocotile.online" @click="crocotile.disconnect()">
        Disconnect
      </v-btn>
    </v-row>
  </v-container>
</template>
