<template>
  <div>
    <p><strong>Thanks for participating in our study!</strong></p>
    <p>Please encourage people around you to participate too!</p>
  </div>
</template>

<script>
import { setSubmitted, clearStorage } from '@/utils/local-storage';

export default {
  name: 'Thanks',
  mounted() {
    clearStorage();
    setSubmitted();
  },
};
</script>
