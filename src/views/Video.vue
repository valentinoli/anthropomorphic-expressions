<template>
  <div class="video-container">
    <div id="affdexElements"></div>
    <video id="robotVideo">
      <source
        :src="`${
          require(`@/assets/video/video${idParam}.mp4`)
        }#t=${playbackRange}`"
        type="video/mp4">
      <p>
        Your browser does not support HTML5 video
      </p>
    </video>
    <v-overlay
      :value="overlay"
      absolute
      opacity=0.7
    >
      <template v-if="warning">
        <div>
          {{ warning }}
        </div>
      </template>
      <template v-else-if="loading">
        <div class="mb-3">
          This might take a few seconds
        </div>
        <v-progress-circular
          indeterminate
          size="64"
        >
        </v-progress-circular>
      </template>
      <template v-else>
        <div class="mb-3">
          Please make sure your audio is on
        </div>
        <v-btn
          @click="onPlayButtonClick"
          fab
          light
          large
        >
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </template>
    </v-overlay>
  </div>
</template>

<script>
import WebcamDetectorAndVideoInterplay from '@/utils/webcam-video-interplay';
import { setLatestCompletedStep, setItem } from '@/utils/local-storage';
import playbackRanges from '@/utils/playback-range';
import processResults from '@/utils/process-affdex-predictions';

export default {
  name: 'Video',
  data() {
    return {
      overlay: true,
      loading: true,
      warning: false,
    };
  },
  computed: {
    idParam() {
      return Number(this.$route.params.id);
    },
    playbackRange() {
      return playbackRanges[this.idParam - 1];
    },
  },
  mounted() {
    const videoEl = this.$el.querySelector('#robotVideo');
    this.interplay = new WebcamDetectorAndVideoInterplay(this, videoEl);

    videoEl.addEventListener('canplaythrough', this.onVideoCanplaythrough);
    videoEl.addEventListener('play', this.onVideoPlay);
    videoEl.addEventListener('pause', this.onVideoPause);
  },
  methods: {
    onVideoCanplaythrough() {
      // The browser estimates it can play the media
      // up to its end without stopping for content buffering.
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event
      // Display play button after a short timeout
      window.setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    onPlayButtonClick() {
      // User clicks play button
      // --> start detector and show loading state
      this.interplay.startDetector();
      this.loading = true;
    },
    onVideoPlay() {
      // Video starts playing after detector has started
      // (see interplay class onInitializeSuccess method)
      // --> hide overlay
      this.overlay = false;
    },
    onVideoPause() {
      // Video doesn't necessarily stop at the end
      // since we specify a playback range
      // so we have to listen for the "pause" event
      // and not "ended"
      // User can't pause the video manually
      // (perhaps programmatically in the console!)

      // Stop the detector and show overlay loading state
      this.interplay.stopDetector();
      this.overlay = true;

      // Process the predictions and save data in local storage
      const { timestamps, results } = this.interplay.data;
      const processedResults = processResults(results);
      const data = { timestamps, data: processedResults };
      const dataKey = `video_${this.idParam}`;
      setItem(dataKey, JSON.stringify(data));

      window.setTimeout(() => {
        // Set the latest completed step of the current participant
        // and save it in browser's local storage
        setLatestCompletedStep(this.$route.path);

        // Redirect user to the survey when data has been saved
        const nextPath = `/survey/${this.idParam}`;
        this.$router.replace(nextPath);
      }, 1000);
    },
    setWarning(warning) {
      // Function called in webcam-video-interplay
      if (warning || this.warning) {
        // warning state is changing
        this.warning = warning;
        this.overlay = warning;
      }
    },
  },
};
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
