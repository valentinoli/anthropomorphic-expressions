<template>
  <div class="home">
    <Overlay :value="overlay" />
    <v-img
      :src="srcWallE"
      width="96"
      class="wall-e d-none d-md-block"
    />
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
            individuals to participate. The minimum age to participate is 18.
          </p>
          <p>
            You will watch <em>two</em> short video clips of robots,
            each followed by a quick questionnaire about your impression of the robot.
            As the videos come with sound, please remember to
            <strong>turn your audio volume on</strong>.
            Following this you will answer a few set of questions.
            During the experiment it is suggested that you have a good internet connection.
            The overall process should only take about <u>10-15 minutes</u>.
          </p>
          <p>
            Your face will be recorded at certain times during the experiment,
            so we ask you to enable and authorize access to your web camera, if you have one.
            Please make sure that your face, and only yours, is visible to the camera.
            Note that <strong>we will not save any video recordings</strong> since
            the frames are processed in real-time. <strong>No personal or
              traceable data will be stored</strong> either. Your participation is <strong>completely
              anonymous</strong>.
          </p>

          <template v-if="closed">
            <v-alert
              type="info"
              outlined
            >
              This study has been closed for now. Thanks to everyone who participated!
            </v-alert>
          </template>
          <template v-else>
            <!-- Insecure context checked first -->
            <v-alert
              v-if="!secureContext"
              type="warning"
              outlined
            >
              <strong>You must be viewing this page in a secure context to participate.</strong>
              <div>
                <a :href="`https://${host}`">Open in secure context</a>
              </div>
            </v-alert>

            <!-- User can't authorize web cam in Facebook in-app browser or Instagram -->
            <v-alert
              v-else-if="isFacebookAppBrowser"
              type="warning"
              outlined
            >
              <strong>This app does not support the Facebook in-app browser</strong>
              <div>
                To participate, you must open the app in another browser. We recommend Chrome.
              </div>
            </v-alert>

            <!-- Browser does not support required APIs -->
            <v-alert
              v-else-if="unsupportiveBrowser"
              type="warning"
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
            <template v-else>
              <p>
                <em>
                  By clicking the start button you declare that you understand
                  and acknowledge the terms of the study
                </em>
              </p>
              <v-btn
                color="primary"
                prepend-icon="mdi-robot"
                @click="start"
              >
                start
              </v-btn>
            </template>
          </template>

          <h2 class="mt-4">
            Who are we?
          </h2>
          <p>
            We are two master's students in Data Science at EPFL.
            Our supervisor is prof. Ahmad Abu-Akel.
            We are interested in human-computer interaction and want to
            help improve the coexistence of robots and humans.
          </p>
          <p>
            Thank you for your support!
          </p>

          <v-row
            align="center"
            justify="center"
          >
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
import { setLatestCompletedStep, getSubmitted } from '@/utils/local-storage'

import Avatar from '@/components/Avatar.vue'
import Overlay from '@/components/Overlay.vue'

import valentinSrc from '@/assets/valentin.jpg'
import ahmadSrc from '@/assets/ahmad.jpg'
import paulSrc from '@/assets/paul.jpg'
import srcWallE from '@/assets/wall-e.png'

export default {
  name: 'Home',
  components: {
    Avatar,
    Overlay
  },
  data () {
    return {
      closed: false,
      host: window.location.host,
      overlay: false,
      srcWallE
    }
  },
  created () {
    this.secureContext = import.meta.env.NODE_ENV === 'development' || window.location.protocol.includes('https')
    this.unsupportiveBrowser = (
      !window.navigator.mediaDevices ||
      !window.navigator.mediaDevices.getUserMedia ||
      !window.localStorage
    )
    const ua = navigator.userAgent || navigator.vendor || window.opera
    this.isFacebookAppBrowser = (ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1) || (ua.indexOf('Instagram') > -1)
  },
  methods: {
    start () {
      // Show loading state
      this.overlay = true
      window.setTimeout(() => {
        // Set latest completed step as '/'
        setLatestCompletedStep(this.$route.path)

        // Redirect user to /general
        this.$router.replace('/general')
      }, 500)
    },
    getSubmitted
  },
  people: [
    {
      src: valentinSrc,
      name: 'Valentin Oliver Loftsson',
      role: 'Data Science, MSc',
      institution: 'EPFL',
      email: 'valentin.loftsson@gmail.com'
    },
    {
      src: paulSrc,
      name: 'Paul Griesser',
      role: 'Data Science, MSc',
      institution: 'EPFL',
      email: ''
    },
    {
      src: ahmadSrc,
      name: 'Ahmad Abu-Akel',
      role: 'Research Fellow, PhD',
      institution: 'Institution of Psychology, UNIL',
      email: 'ahmad.abuakel@unil.ch'
    }
  ]
}
</script>

<style scoped>
.home {
  position: relative;
}

.wall-e {
  position: absolute;
  right: 0;
  top: 20px;
}
</style>
