<template>
  <div class="video-container">
    <div id="affdexElements" />
    <video id="robotVideo">
      <source
        :src="src"
        type="video/mp4"
      >
      <p>
        Your browser does not support HTML5 video
      </p>
    </video>
    <v-overlay
      v-model="overlay"
      attach=".video-container"
      absolute
      content-class="v-overlay__content-video"
    >
      <template v-if="warning">
        <div>
          {{ warning }}
        </div>
      </template>
      <template v-else-if="loading">
        <div class="text-h5 mb-3 font-weight-bold">
          This might take a few seconds
        </div>
        <v-progress-circular
          indeterminate
          size="64"
        />
      </template>
      <template v-else>
        <div class="text-h5 mb-3 font-weight-bold">
          Please make sure your audio is on
        </div>
        <v-btn
          large
          icon="mdi-play"
          @click="onPlayButtonClick"
        />
      </template>
    </v-overlay>
  </div>
</template>

<script>
import WebcamDetectorAndVideoInterplay from '@/utils/webcam-video-interplay'
import { setLatestCompletedStep, setItem } from '@/utils/local-storage'
import playbackRanges from '@/utils/playback-range'
import processResults from '@/utils/process-affdex-predictions'

export default {
  name: 'VideoPlayer',
  data () {
    const idParam = Number(this.$route.params.id)
    console.log(idParam)
    return {
      overlay: true,
      loading: true,
      warning: false,
      idParam,
      playbackRange: playbackRanges[idParam - 1],
      src: undefined
    }
  },
  created () {
    console.log(this.idParam)
    // const srcUrl = await import(`@/assets/video/video${this.idParam}.mp4`)
    const src = new URL(
      `/src/assets/video/video${this.idParam}.mp4`,
      import.meta.url
    ).href
    console.log(src)
    this.src = `${src}#t=${this.playbackRange}`
  },
  mounted () {
    const videoEl = this.$el.querySelector('#robotVideo')
    console.log(videoEl)
    this.interplay = new WebcamDetectorAndVideoInterplay(this, videoEl)

    videoEl.addEventListener('canplaythrough', this.onVideoCanplaythrough)
    videoEl.addEventListener('play', this.onVideoPlay)
    videoEl.addEventListener('pause', this.onVideoPause)
  },
  methods: {
    onVideoCanplaythrough () {
      console.log('canplay')
      // The browser estimates it can play the media
      // up to its end without stopping for content buffering.
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event
      // Display play button after a short timeout
      window.setTimeout(() => {
        this.loading = false
      }, 500)
    },
    onPlayButtonClick () {
      // User clicks play button
      // --> start detector and show loading state
      this.interplay.startDetector()
      this.loading = true
    },
    onVideoPlay () {
      console.log('play')
      // Video starts playing after detector has started
      // (see interplay class onInitializeSuccess method)
      // --> hide overlay
      this.overlay = false
    },
    onVideoPause () {
      // Video doesn't necessarily stop at the end
      // since we specify a playback range
      // so we have to listen for the "pause" event
      // and not "ended"
      // User can't pause the video manually
      // (perhaps programmatically in the console!)

      // Stop the detector and show overlay loading state
      this.interplay.stopDetector()
      this.overlay = true

      // Process the predictions and save data in local storage
      const { timestamps, results } = this.interplay.data
      const processedResults = processResults(results)
      const data = { timestamps, data: processedResults }
      const dataKey = `video_${this.idParam}`
      setItem(dataKey, JSON.stringify(data))

      window.setTimeout(() => {
        // Set the latest completed step of the current participant
        // and save it in browser's local storage
        setLatestCompletedStep(this.$route.path)

        // Redirect user to the survey when data has been saved
        const nextPath = `/survey/${this.idParam}`
        this.$router.replace(nextPath)
      }, 1000)
    },
    setWarning (warning) {
      // Function called in webcam-video-interplay
      if (warning || this.warning) {
        // warning state is changing
        this.warning = warning
        this.overlay = warning
      }
    }
  }
}
</script>

<style scoped>
  .video-container {
    /* To be able to use absolute positioning of the overlay */
    position: relative;
  }

  .video-container video {
    width: 100%;
    object-fit: contain;
    margin-bottom: -6px;
  }
</style>

<style>
/* cannot be scoped */
.v-overlay__content.v-overlay__content-video {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
