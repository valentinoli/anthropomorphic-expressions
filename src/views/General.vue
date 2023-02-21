<template>
  <section>
    <div id="affdexElements" />
    <Overlay :value="overlay">
      <template v-if="!faceDetected">
        <div class="mb-3">
          No face detected, please make sure your face is visible
        </div>
      </template>
    </Overlay>

    <!-- Form submitted  -->
    <template v-if="formSubmitted">
      <p>
        You will now watch two short video clips of robots,
        each followed by a quick questionnaire about your impression of the robot.
        For convenience, the questionnaire is available in four languages:
        English, French, German, and Spanish.
        Finally, you will answer a few questions.
        As a reminder, please <strong>turn your audio volume on</strong>.
      </p>

      <p>
        Note that if you need to pause and resume later,
        you can stop at any point in time and even safely close the page, just
        as long as you don't clear you browser's data in the meantime.
      </p>

      <v-btn
        color="primary"
        @click="nextStep"
      >
        <v-icon left>
          mdi-robot
        </v-icon> continue
      </v-btn>
    </template>

    <!-- Web camera authorized and face detected -> show form -->
    <template v-else-if="faceDetectionConfirmed">
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
            (v) => v >= 17 || 'Minimum age is 17',
            (v) => v <= 80 || 'Maximum age is 80',
          ]"
          required
          outlined
          dense
          autofocus
          style="width: 150px;"
        />

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
          />
          <v-radio
            label="Male"
            value="Male"
          />
        </v-radio-group>

        <v-btn
          class="mt-6"
          color="primary"
          @click="submitForm"
        >
          <v-icon left>
            mdi-send-circle-outline
          </v-icon> submit
        </v-btn>
      </v-form>
    </template>

    <template v-else-if="testedFaceDetection">
      <template v-if="faceDetected">
        <v-alert
          type="success"
          :width="alertWidth"
          outlined
        >
          Camera test successful
        </v-alert>

        <v-btn
          color="primary"
          @click="faceDetectionConfirmed = true"
        >
          <v-icon left>
            mdi-robot
          </v-icon> continue
        </v-btn>
      </template>
      <template v-else>
        <v-alert
          type="error"
          :width="alertWidth"
          outlined
        >
          <strong>Camera test failed</strong>
          <div>
            Please make sure your face is always visible to the front camera
          </div>
        </v-alert>

        <v-btn
          color="primary"
          dark
          @click="testCameraDetector"
        >
          <v-icon left>
            mdi-camera-front
          </v-icon> retry
        </v-btn>
      </template>
    </template>

    <template v-else-if="webcamAuthorized">
      <v-alert
        type="success"
        :width="alertWidth"
        outlined
      >
        Camera access authorized
      </v-alert>

      <p>
        Please press the button to test the camera
      </p>

      <v-btn
        color="primary"
        dark
        @click="testCameraDetector"
      >
        <v-icon left>
          mdi-camera-front
        </v-icon> test camera
      </v-btn>
    </template>

    <!-- Web camera not authorized -->
    <template v-else-if="webcamDenied">
      <v-alert
        v-if="webcamDenied"
        type="error"
        :width="alertWidth"
        outlined
      >
        Camera authorization denied or failed
      </v-alert>
    </template>

    <!-- First thing the user sees -->
    <template v-else>
      <p>
        Before continuing, please make sure you have a good internet connection.
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
      <v-btn
        color="primary"
        dark
        @click="requestWebcam"
      >
        <v-icon left>
          mdi-webcam
        </v-icon> authorize camera access
      </v-btn>
    </template>
  </section>
</template>

<script>
import { setLatestCompletedStep, setItem } from '@/utils/local-storage'
import Overlay from '@/components/Overlay.vue'

export default {
  name: 'General',
  components: {
    Overlay
  },
  data () {
    return {
      webcamAuthorized: false,
      webcamDenied: false,
      testedFaceDetection: false,
      faceDetectionConfirmed: false,
      faceDetected: true,
      formSubmitted: false,
      overlay: false,
      gender: null,
      age: null,
      alertWidth: 'fit-content'
    }
  },
  methods: {
    requestWebcam () {
      window.navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      }).then((stream) => {
        this.webcamAuthorized = true
        if (stream) {
          stream.getTracks().forEach((track) => {
            track.stop()
          })
        }
      }).catch((err) => {
        // Permission denied?
        this.webcamDenied = true
        console.error(err)
      })
    },
    testCameraDetector () {
      this.overlay = true
      let attempts = 0
      let successes = 0

      // See proper documentation of below code in webcam-video-interplay.js
      const divRoot = document.getElementById('affdexElements')
      const width = 640
      const height = 480
      const faceMode = affdex.FaceDetectorMode.LARGE_FACES

      const detector = new affdex.CameraDetector(divRoot, width, height, faceMode)

      detector.detectAllEmotions()
      detector.detectAllExpressions()
      detector.detectAllEmojis()
      detector.detectAllAppearance()

      detector.addEventListener('onInitializeSuccess', () => console.info('The detector reports initialized'))
      detector.addEventListener('onInitializeFailure', (err) => console.error(err))
      detector.addEventListener('onStopSuccess', () => {
        console.info('The detector reports stopped')
        const successRate = successes / attempts
        if (successRate > 0.95) {
          this.faceDetected = true
        } else {
          this.faceDetected = false
          console.info(`${Math.round(successRate * 100)}% face detection success rate`)
        }

        this.testedFaceDetection = true
        this.overlay = false
      })

      detector.addEventListener('onImageResultsSuccess', (faces) => {
        const success = faces.length === 1
        attempts += 1
        if (success) {
          this.faceDetected = true
          console.info('Face detected')
          successes += 1
        } else {
          this.faceDetected = false
          console.warn('Face not detected')
        }

        if (attempts > 100) {
          detector.removeEventListener('onImageResultsSuccess')
          detector.stop()
        }
      })

      detector.start()
    },
    submitForm () {
      const formValid = this.$refs.form.validate()

      if (formValid) {
        const { age, gender } = this
        const dataKey = 'general'
        setItem(dataKey, JSON.stringify({ age, gender }))
        this.formSubmitted = true
      }
    },
    nextStep () {
      // Show loading state
      this.overlay = true
      window.setTimeout(() => {
        // Set latest completed step as '/general'
        setLatestCompletedStep(this.$route.path)

        // Redirect user to first video
        this.$router.replace('/video/1')
      }, 1500)
    }
  }
}
</script>
