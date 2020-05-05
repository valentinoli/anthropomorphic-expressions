<template>
  <div class="home">
    <!-- <span v-if="isSubmitted">You have already participated</span> -->
    <router-link to="/video/1">Start</router-link>
  </div>
</template>

<script>
import { getSubmitted, setLatestCompletedStep } from '@/utils/local-storage';

export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
      isSubmitted: getSubmitted(),
    };
  },
  mounted() {
    setLatestCompletedStep(this.$route.path);
  },
};
</script>
