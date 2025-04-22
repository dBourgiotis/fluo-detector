<script setup lang="ts">
import type { FluorescenceResult } from "../composables/useFindFluo";
import { ref, watch, toRefs } from "vue";

const props = defineProps<{
  result: FluorescenceResult;
}>();
const { result } = toRefs(props);

const canvas = ref<HTMLCanvasElement | null>(null);

watch(result, (newResult: FluorescenceResult) => {
  if (!canvas.value) return;
  if (newResult.areaPx > 0) {
    // Set canvas dimensions to match the overlay image
    canvas.value.width = newResult.overlay.width;
    canvas.value.height = newResult.overlay.height;
    canvas.value.getContext("2d")?.drawImage(newResult.overlay, 0, 0);
  } else {
    canvas.value.getContext("2d")?.clearRect(0, 0, canvas.value.width, canvas.value.height);
  }
}, { immediate: true });
</script>

<template>
  <div class="mt-6 p-6 bg-white rounded-lg shadow-md max-w-md w-full">
    <div
      v-if="result.areaPx === 0 && result.meanIntensity === 0"
      class="text-center"
    >
      <h2 class="text-xl font-semibold text-gray-800 mb-2">
        No Fluorescence Detected
      </h2>
      <p class="text-gray-600">
        The analysis shows no signs of fluorescence in the sample.
      </p>
    </div>
    <div v-else class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-800">Fluorescence Detected</h2>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Area (px)</p>
          <p class="text-lg font-medium text-gray-900">
            {{ result.areaPx.toLocaleString() }}
          </p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Mean Intensity</p>
          <p class="text-lg font-medium text-gray-900">
            {{ result.meanIntensity.toFixed(2) }}
          </p>
        </div>
      </div>
    </div>
    <div class="mt-6 overflow-auto max-h-[500px]">
      <canvas ref="canvas" id="canvas" class="w-full"></canvas>
    </div>
  </div>
</template>
