<template>
  <div class="video-container">
    <div id="affdexElements"></div>
    <video id="robotVideo">
      <source :src="`video/video${id}.mp4#t=${playbackRange}`" type="video/mp4">
      <p>
        Your browser does not support HTML5 video
      </p>
    </video>
    <v-overlay
      :value="overlay"
      absolute
    >
      <v-progress-circular
        v-if="loading"
        indeterminate
        size="64"
      ></v-progress-circular>
      <v-btn
        v-else
        @click="onPlayButtonClick"
        fab
        light
        x-large
      >
        <v-icon>mdi-play</v-icon>
      </v-btn>
    </v-overlay>
  </div>
</template>

<script>
import WebcamDetectorAndVideoInterplay from '@/utils/webcam-video-interplay';
import { setLatestCompletedStep, setItem } from '@/utils/local-storage';
import playbackRanges from '@/utils/playback-range';
import processData from '@/utils/process-data';

export default {
  name: 'Video',
  components: {
  },
  data() {
    return {
      overlay: true,
      loading: true,
    };
  },
  mounted() {
    const videoEl = this.$el.querySelector('#robotVideo');
    this.interplay = new WebcamDetectorAndVideoInterplay(videoEl);

    videoEl.addEventListener('canplaythrough', this.onVideoCanplaythrough);
    videoEl.addEventListener('play', this.onVideoPlay);
    videoEl.addEventListener('pause', this.onVideoPause);
  },
  computed: {
    id() {
      return Number(this.$route.params.id);
    },
    playbackRange() {
      return playbackRanges[this.$route.path];
    },
  },
  methods: {
    onVideoCanplaythrough() {
      // The browser estimates it can play the media
      // up to its end without stopping for content buffering.
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event
      // Display play button after a short timeout
      window.setTimeout(() => {
        this.loading = false;
      }, 1000);
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

      const { path } = this.$route;

      // Process the predictions and save in local storage
      const data = processData(this.interplay.data);
      setItem(path, JSON.stringify(data));

      // Set the latest completed step of the current participant
      // and save it in browser's local storage
      setLatestCompletedStep(this.$route.path);

      window.setTimeout(() => {
        // Redirect user to the survey when data has been saved
        const nextPath = `/survey/${this.id}`;
        this.$router.replace(nextPath);
      }, 1000);
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
