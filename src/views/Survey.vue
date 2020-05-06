<template>
  <div class='survey'>
    Survey {{ id }}
  </div>
</template>

<script>
// import { setLatestCompletedStep } from '@/utils/local-storage';

export default {
  name: 'Survey',
  components: {
  },
  mounted() {
    // setLatestCompletedStep(this.$route.path);
    // const nextPath = this.id === 3 ? '/thanks' : `/video/${this.id + 1}`;
    // setTimeout(() => this.$router.replace(nextPath), 2000);
  },
  computed: {
    id() {
      return Number(this.$route.params.id);
    },
  },
};
</script>
