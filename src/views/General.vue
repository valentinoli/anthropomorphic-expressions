<template>
  <section>
    <Overlay :value="overlay"/>

    <!-- Form submitted  -->
    <template v-if="formSubmitted">
      <p>
        You will now watch three short video clips of robots in a random order,
        each followed by a quick questionnaire about your impression of the robot.
        As a reminder, please <strong>turn your audio volume on</strong>.
      </p>

      <v-btn
        @click="nextStep"
        color="info"
      >
        <v-icon left>mdi-robot</v-icon> continue
      </v-btn>
    </template>

    <!-- Web camera authorized, show form -->
    <template v-else-if="webcamAuthorized">
      <v-alert
        type="success"
        width="300"
        outlined
      >
        Camera access authorized
      </v-alert>

      <div class="mb-4">
        Before continuing, please provide the following information
      </div>

      <v-form
        ref="form"
        lazy-validation
      >
        <v-text-field
          v-model="age"
          type="number"
          min="18"
          max="130"
          label="Age"
          :rules="[
            (v) => !!v || 'Age is required',
            (v) => v >= 18 || 'Minimum age is 18',
            (v) => v <= 130 || 'Are you really that old?',
          ]"
          required
          outlined
          dense
          autofocus
          style="width: 150px;"
        ></v-text-field>

        <v-radio-group
          v-model="gender"
          label="Gender"
          required
          :rules="[
            (v) => !!v || 'Gender is required',
          ]"
        >
          <v-radio
            label="Female"
            value="Female"
          ></v-radio>
          <v-radio
            label="Male"
            value="Male"
          ></v-radio>
        </v-radio-group>


        <v-btn
          class="mt-6"
          color="info"
          @click="submitForm"
        >
          <v-icon left>mdi-send-circle-outline</v-icon> submit
        </v-btn>
      </v-form>
    </template>

    <!-- Web camera not authorized -->
    <template v-else-if="webcamDenied">
      <v-alert
        v-if="webcamDenied"
        type="warning"
        width="300"
        outlined
      >
        Camera permission denied
      </v-alert>
    </template>

    <!-- Web camera authorization request not sent yet -->
    <template v-else>
      <p>
        Your face will be recorded at certain times during the experiment,
        so we ask you to enable and authorize access to your web camera, if you have one.
        Please make sure that your face, and only yours, is visible to the camera.
        Note that <strong>we will not save any video recordings</strong> since
        the frames are processed in real-time. <strong>No personal or
        traceable data will be stored</strong> either. Your participation is <strong>completely
        anonymous</strong>.
      </p>
      <v-btn
        @click="requestWebcam"
        dark
      >
        <v-icon left>mdi-webcam</v-icon> authorize camera access
      </v-btn>
    </template>
  </section>
</template>

<script>
import { setLatestCompletedStep, setRandomSequence, setItem } from '@/utils/local-storage';
import shuffle from 'lodash.shuffle';
import Overlay from '@/components/Overlay.vue';

export default {
  name: 'General',
  components: {
    Overlay,
  },
  data() {
    return {
      webcamAuthorized: false,
      webcamDenied: false,
      formSubmitted: false,
      overlay: false,
      gender: null,
      age: null,
    };
  },
  methods: {
    requestWebcam() {
      window.navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      }).then((stream) => {
        this.webcamAuthorized = true;
        if (stream) {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
        }
      }).catch((err) => {
        // Permission denied?
        this.webcamDenied = true;
        console.error(err);
      });
    },
    submitForm() {
      const formValid = this.$refs.form.validate();

      if (formValid) {
        const { age, gender } = this;
        const dataKey = 'general';
        setItem(dataKey, JSON.stringify({ age, gender }));
        this.formSubmitted = true;
      }
    },
    nextStep() {
      // Show loading state
      this.overlay = true;
      window.setTimeout(() => {
        // Set a random sequence for the three video/survey pairs
        // and save in local storage. This is to avoid response bias such that
        // people would answer to meet the expectation of the research.
        setRandomSequence(shuffle([1, 2, 3]));

        // Set latest completed step as '/general'
        setLatestCompletedStep(this.$route.path);

        // Redirect user to first video
        this.$router.replace('/video/1');
      }, 1500);
    },
  },
};
</script>
