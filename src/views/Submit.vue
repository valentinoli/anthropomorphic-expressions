<template>
  <div class="submit">
    <v-overlay
      :value="overlay"
    >
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <div class="text-center">
      <p class="title">
        You have reached the end!
      </p>
      <p>
        The final step is to submit your data
      </p>
      <p>
        Please click the button below
      </p>
      <v-btn @click="submit" color="success" class="mt-4 mb-6">
        <v-icon left>mdi-send-circle-outline</v-icon>submit data
      </v-btn>
    </div>
    <v-alert type="error" outlined v-if="error">
      <div class="d-flex justify-space-between">
        <p>Some error occurred while saving the data</p>
        <v-btn
          depressed
          color="error"
          :href="`mailto:valentin.loftsson@epfl.ch,paul.griesser@epfl.ch?body=${message}`"
        >
          <v-icon left>mdi-email</v-icon>
          Report error
        </v-btn>
      </div>
      <div class="mt-2">
        <code>
          {{ message }}
        </code>
      </div>
    </v-alert>
  </div>
</template>

<script>
import uploadData from '@/utils/upload-data';
import { setSubmitted, clearStorage } from '@/utils/local-storage';

export default {
  name: 'Submit',
  data() {
    return {
      overlay: false,
      error: false,
      message: '',
    };
  },
  methods: {
    async submit() {
      try {
        this.overlay = true;
        await uploadData();

        // Clear storage and
        // save user's progress as "submitted"
        // so that he/she can't repeat the experiment
        clearStorage();
        setSubmitted();

        window.setTimeout(() => {
          // Redirect user to /thanks
          this.$router.replace('/thanks');
        }, 1000);
      } catch (err) {
        this.error = true;
        this.message = err;
        console.error(err);
      } finally {
        this.overlay = false;
      }
    },
  },
};
</script>
