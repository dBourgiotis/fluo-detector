<script setup lang="ts">
import { ref } from 'vue'
import ImageSampleForm from './components/ImageSampleForm.vue'
import FluorescenceResults from './components/FluorescenceResults.vue'
import { useFindFluo } from './composables/useFindFluo'
import type { FluorescenceResult } from './composables/useFindFluo'

const { detectFluorescence } = useFindFluo()
const result = ref<FluorescenceResult | null>(null)

const findFluo = async (uvOn: {file: File, ref: HTMLImageElement}, uvOff: {file: File, ref: HTMLImageElement}) => {
  result.value = await detectFluorescence(uvOn.ref, uvOff.ref)
}
</script>

<template>
  <section class="bg-gray-50 w-full h-full min-h-screen flex flex-col items-center justify-center p-4">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Fluo Detector</h1>
    <ImageSampleForm :onSubmit="findFluo" />
    <FluorescenceResults v-if="result" :result="result" />
  </section>
</template>

