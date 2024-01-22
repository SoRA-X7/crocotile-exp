<script setup lang="ts">
import { useCrocotile } from '@/states/crocotile';
import { ref } from 'vue';
import { watchPostEffect } from 'vue';

const crocotile = useCrocotile();
const monitorText = ref<HTMLTextAreaElement>();

watchPostEffect(() => {
  crocotile.serialLog;
  monitorText.value!.scroll(0, monitorText.value!.scrollHeight);
});
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
    <v-row>
      <v-textarea ref="monitorText" v-model="crocotile.serialLog" rows="20" readonly></v-textarea>
    </v-row>
  </v-container>
</template>
