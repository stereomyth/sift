<script>
import Side from '@/components/Side.vue';
import Thumbs from '@/components/Thumbs.vue';
import Top from '@/components/Top.vue';
import Viewer from '@/components/Viewer.vue';

export default {
  components: { Side, Thumbs, Top, Viewer },
};
</script>

<template>
  <div class="grid grid-contain w-screen h-screen">
    <Top class="top" />
    <Viewer class="viewer" />
    <Side class="side" />
    <Thumbs class="thumbs" />
  </div>
</template>

<style lang="postcss">
@tailwind base;

body {
  @apply text-white bg-gray-900;
}

pre {
  @apply border-dashed border-2 p-2 m-2;
  font-size: 10px;
}

.btn {
  @apply cursor-pointer rounded leading-none p-1;
}
.btn:hover {
  @apply bg-gray-700;
}

.grid-contain {
  grid-template: 32px auto 150px / auto 150px;
}
.top {
  grid-area: 1 / 1 / 2 / 3;
}
.viewer {
  grid-area: 2 / 1 / 3 / 2;
}
.side {
  grid-area: 2 / 2 / 3 / 3;
}
.thumbs {
  grid-area: 3 / 1 / 4 / 3;
}

@tailwind components;
@tailwind utilities;
</style>
