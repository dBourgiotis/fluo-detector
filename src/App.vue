<script setup lang="ts">
import ImageSampleForm from './components/ImageSampleForm.vue'
import { useFindFluo } from './composables/useFindFluo'

const { findFluo } = useFindFluo()

</script>

<template>
  <section class="bg-gray-50 w-full h-full min-h-screen flex flex-col items-center justify-center">
    <h1>Fluo Detector</h1>
    <ImageSampleForm @submit="findFluo" />
  </section>
</template>

