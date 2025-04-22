<script setup lang="ts">
import { ref } from "vue";

interface imgType {
  file: File,
  ref: HTMLImageElement,
}

const props = defineProps<{ onSubmit: (uvOn: imgType, uvOff:imgType) => Promise<void> }>();

const uvOnFile = ref<File | null>(null);
const uvOffFile = ref<File | null>(null);

const uvOnImageUrl = ref<string | null>(null);
const uvOffImageUrl = ref<string | null>(null);

const uvOnImageRef = ref<HTMLImageElement | null>(null);
const uvOffImageRef = ref<HTMLImageElement | null>(null);

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  if (uvOnFile.value && uvOffFile.value && uvOnImageRef.value && uvOffImageRef.value) {
    await props.onSubmit({file: uvOnFile.value, ref: uvOnImageRef.value}, {file: uvOffFile.value, ref: uvOffImageRef.value});
  }
};

const handleFileChange = (e: Event, type: "uvOn" | "uvOff") => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    if (type === "uvOn") {
      uvOnFile.value = input.files[0];
      uvOnImageUrl.value = URL.createObjectURL(input.files[0]);
    } else {
      uvOffFile.value = input.files[0];
      uvOffImageUrl.value = URL.createObjectURL(input.files[0]);
    }
  }
};
</script>

<template>
  <form
    @submit="handleSubmit"
    class="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
  >
    <div class="space-y-4">
      <div>
        <label for="uvOff" class="block text-sm font-medium text-gray-700 mb-2"
          >UV Off Image</label
        >
        <input
          type="file"
          id="uvOff"
          accept="image/*"
          @change="(e) => handleFileChange(e, 'uvOff')"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required
        />
        <img v-if="uvOffImageUrl" :src="uvOffImageUrl" ref="uvOffImageRef" />
      </div>
      <div>
        <label for="uvOn" class="block text-sm font-medium text-gray-700 mb-2"
          >UV On Image</label
        >
        <input
          type="file"
          id="uvOn"
          accept="image/*"
          @change="(e) => handleFileChange(e, 'uvOn')"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required
        />
        <img v-if="uvOnImageUrl" :src="uvOnImageUrl" ref="uvOnImageRef" />
      </div>
    </div>

    <button
      type="submit"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      :disabled="!uvOnFile || !uvOffFile"
    >
      Submit
    </button>
  </form>
</template>
