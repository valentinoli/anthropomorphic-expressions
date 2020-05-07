<template>
  <div class="home">
    <v-overlay
      :value="overlay"
    >
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-img
      :src="require('@/assets/wall-e.png')"
      width="128"
      class="wall-e d-none d-md-block"
    ></v-img>
    <v-row>
      <v-col cols="12" md="8">
        <section class="font-weight-light text-justify">
          <h1 class="display-1 font-weight-medium text-left">
            Anthropomorphic Expressions Towards Robots
          </h1>
          <p class="headline mb-4 mt-2 font-weight-regular text-left">
            Predicting Anthropomorphic Attitudes Towards Robots
            based on Physical Facial Expressions and Attributes
          </p>
          <p class="title font-weight-thin">
            A Study in Experimental Cognitive Psychology, EPFL 2020
          </p>
          <p>
            Welcome dear visitor
          </p>
          <p>
            Undeniably, robots of every kind will become more widespread in
            years to come and human-robot coexistence entails challenges
            that must be addressed. Robot developers of today face the
            challenge of creating robots that meet human expectations and
            accomplish social goals. One way to accomplish this, is to develop
            sophisticated machine learning models that help robots to infer human
            feelings from observations, and adapt their behavior accordingly.
            Such models can potentially encourage healthy rather than overly dependent
            behavior in robots and lead to more pleasant interactions.
          </p>
          <p>
            The purpose of this study is to estimate how well anthropomorphic
            attitudes towards robots can be predicted from facial expressions and attributes.
            Naturally, humans are most comfortable interacting with other humans
            and it has been suggested that anthropomorphism towards robots is an
            indication of acceptability, along with other factors.
          </p>
          <p>
            This web platform was created to facilitate our study and enable
            individuals to participate. We warmly invite you to take part!
          </p>
          <h2>How does it work?</h2>
          <p>
            You will watch <em>three</em> short videos of robots, each followed by a quick
            questionnaire about your impression of the robot. It should only take about
            <u>15-20 minutes</u>. Note that if you need to pause and resume later,
            you can stop at any point in time and even safely close the page, so long
            as you don't clear your browser's data.
          </p>
          <p>
            At certain times during the experiment your face will be recorded,
            so we ask you to enable and authorize access to your web camera, if you have one.
            Note that <strong>we will not save a video recording</strong> since
            the frames will be processed in real-time and <strong>no personal or
            traceable data will be stored</strong>. Your participation is <strong>completely
            anonymous</strong>.
          </p>

          <v-alert
            v-if="unsupportiveBrowser"
            type="error"
            outlined
          >
            <strong>You must use a different browser to participate.</strong>
            <div>
              Your browser does not support the APIs this site requires
            </div>
          </v-alert>

          <v-alert
            v-if="isSubmitted"
            type="info"
            outlined
          >
            You have already participated in the study. We appreciate your contribution!
          </v-alert>

          <div v-else>
            <v-btn
              v-if="!webcamAuthorized"
              @click="requestWebcam"
              color="yellow"
            >
              <v-icon left>mdi-webcam</v-icon> authorize webcam
            </v-btn>

            <template v-if="webcamAuthorized">
              <v-alert
                type="success"
              >
                Camera access authorized
              </v-alert>

              <v-btn
                @click="start"
                color="info"
              >
                <v-icon left>mdi-robot</v-icon> start
              </v-btn>
            </template>


          </div>
        </section>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getSubmitted, setLatestCompletedStep } from '@/utils/local-storage';

export default {
  name: 'Home',
  data() {
    return {
      isSubmitted: getSubmitted(),
      webcamAuthorized: false,
      overlay: false,
    };
  },
  created() {
    this.unsupportiveBrowser = (
      !window.navigator.mediaDevices
      || !window.navigator.mediaDevices.getUserMedia
      || !window.localStorage
    );
    console.log(this.unsupportiveBrowser);
  },
  methods: {
    requestWebcam() {
      window.navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      }).then(() => {
        this.webcamAuthorized = true;
      }).catch((err) => {
        // Permission denied?
        console.error(err);
      });
    },
    start() {
      // Show loading state
      this.overlay = true;
      window.setTimeout(() => {
        // Set latest completed step as '/'
        setLatestCompletedStep(this.$route.path);

        // Redirect user to first video
        this.$router.replace('/video/1');
      }, 3000);
    },
  },
};
</script>

<style scoped>
.home {
  position: relative;
}

.wall-e {
  position: absolute;
  right: 50px;
  top: 15px;
}
</style>
