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
      width="96"
      class="wall-e d-none d-md-block"
    ></v-img>
    <v-row>
      <v-col cols="12">
        <section class="font-weight-light">
          <h1 class="display-1 font-weight-medium">
            Anthropomorphic Expressions Towards Robots
          </h1>
          <div class="headline mb-4 mt-2 font-weight-regular text-left">
            Predicting Anthropomorphic Attitudes Towards Robots<br>
            based on Physical Facial Expressions and Attributes
          </div>
          <div class="title mb-4 font-weight-thin text-left">
            A Study in Experimental Cognitive Psychology, EPFL 2020
          </div>
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
          <h2>How do I participate?</h2>
          <p>
            This web platform was created to facilitate the study and enable
            individuals to participate.
          </p>
          <p>
            You will watch <em>three</em> short video clips of robots, each followed by a quick
            questionnaire about your impression of the robot. It should only take about
            <u>5-10 minutes</u> in total.
          </p>
          <p>
            At certain times during the experiment your face will be recorded,
            so we ask you to enable and authorize access to your web camera, if you have one.
            Please make sure that your face, and only yours, is visible to the camera.
            Note that <strong>we will not save a video recording</strong> since
            the frames will be processed in real-time and <strong>no personal or
            traceable data will be stored</strong>. Your participation is <strong>completely
            anonymous</strong>.
          </p>

          <!-- Browser does not support required APIs -->
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

          <!-- User already submitted on the current browser
               according to local storage parameter -->
          <v-alert
            v-else-if="getSubmitted()"
            type="info"
            outlined
          >
            You have already participated in the study. We appreciate your contribution!
          </v-alert>

          <!-- Else allow participation -->
          <div v-else>
            <!-- Web camera authorized -->
            <template v-if="webcamAuthorized">
              <v-alert
                type="success"
                width="300"
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

            <!-- Web camera not authorized access yet -->
            <template v-else>
              <v-alert
                v-if="webcamDenied"
                type="warning"
                width="300"
              >
                Camera permission denied
              </v-alert>

              <v-btn
                v-else
                @click="requestWebcam"
                color="amber"
              >
                <v-icon left>mdi-webcam</v-icon> authorize webcam
              </v-btn>
            </template>
          </div>

          <h2 class="mt-4">Who are we?</h2>
          <p>
            We are two master's students in Data Science at EPFL.
            Our supervisor is prof. Ahmad Abu-Akel.
            We are interested in human-computer interaction and want to
            help improve the coexistence of robots and humans.
          </p>
          <p>
            Thank you for your support!
          </p>

          <v-row align="center" justify="center">
            <Avatar
              v-for="person in $options.people"
              :key="person.src"
              v-bind="person"
            />
          </v-row>
        </section>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getSubmitted, setLatestCompletedStep } from '@/utils/local-storage';
import Avatar from '@/components/Avatar.vue';
import valentinSrc from '@/assets/valentin.jpg';
import ahmadSrc from '@/assets/ahmad.jpg';
import paulSrc from '@/assets/paul.jpg';

export default {
  name: 'Home',
  components: {
    Avatar,
  },
  data() {
    return {
      webcamAuthorized: false,
      webcamDenied: false,
      overlay: false,
    };
  },
  created() {
    this.unsupportiveBrowser = (
      !window.navigator.mediaDevices
      || !window.navigator.mediaDevices.getUserMedia
      || !window.localStorage
    );
    if (this.unsupportiveBrowser) {
      console.info('Browser unsupported');
    }
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
    getSubmitted,
  },
  people: [
    {
      src: valentinSrc,
      name: 'Valentin Oliver Loftsson',
      role: 'Data Science, MSc',
      institution: 'EPFL',
      email: 'valentin.loftsson@epfl.ch',
    },
    {
      src: paulSrc,
      name: 'Paul Griesser',
      role: 'Data Science, MSc',
      institution: 'EPFL',
      email: 'paul.griesser@epfl.ch',
    },
    {
      src: ahmadSrc,
      name: 'Ahmad Abu-Akel',
      role: 'Research Fellow, PhD',
      institution: 'Institution of Psychology, UNIL',
      email: 'ahmad.abuakel@unil.ch',
    },
  ],
};
</script>

<style scoped>
.home {
  position: relative;
}

.wall-e {
  position: absolute;
  right: 0;
  top: 65px;
}

section p {
  text-align: justify;
}

section h2 {
  margin-bottom: 4px;
}
</style>
