
class WebcamDetectorAndVideoInterplay {
  vue

  detector

  video

  results = []

  timestamps = []

  constructor (vue, videoEl) {
    this.vue = vue

    // SDK needs to create video and canvas nodes in the DOM in order to function
    // Here we are adding those nodes to a predefined div.
    const divRoot = document.getElementById('affdexElements')
    const width = 640
    const height = 480
    const faceMode = affdex.FaceDetectorMode.LARGE_FACES

    // Construct a CameraDetector and specify the image width / height and face detector mode.
    const detector = new affdex.CameraDetector(divRoot, width, height, faceMode)

    // Enable detection of all Expressions, Emotions and Emojis classifiers.
    detector.detectAllEmotions()
    detector.detectAllExpressions()
    detector.detectAllEmojis()
    detector.detectAllAppearance()

    // Add callbacks to notify when the detector is initialized/failed to initialize
    detector.addEventListener('onInitializeSuccess', this.onInitializeSuccess.bind(this))
    detector.addEventListener('onInitializeFailure', (err) => console.error(err))

    // Add a callback to notify when detector is stopped
    detector.addEventListener('onStopSuccess', () => console.info('The detector reports stopped'))

    // Add callbacks to notify when camera access is allowed/denied
    detector.addEventListener('onWebcamConnectSuccess', () => {
      // Access provided to web camera
      // Detector is started
      console.info('Webcam access allowed')
    })
    detector.addEventListener('onWebcamConnectFailure', (error) => {
      // Access denied to web camera
      // Detector should not have started
      console.error('Webcam access denied', error)
    })

    // Add a callback to receive the results from processing an image.
    // The faces object contains the list of the faces detected in an image.
    // Faces object contains probabilities for all the different expressions,
    // emotions and appearance metrics
    detector.addEventListener('onImageResultsSuccess', this.onImageResultsSuccess.bind(this))

    this.detector = detector
    this.video = videoEl
  }

  get data () {
    return {
      results: this.results,
      timestamps: this.timestamps
    }
  }

  onImageResultsSuccess (faces) {
    if (faces.length === 1) {
      const {
        appearance,
        expressions,
        emotions,
        emojis,
        measurements
      } = faces[0]

      this.timestamps.push(this.video.currentTime)
      this.results.push({
        appearance,
        expressions,
        emotions,
        emojis,
        measurements
      })

      this.vue.setWarning(false)
    } else if (faces.length > 1) {
      // Doesn't seem to occur, why?
      this.vue.setWarning('Too many faces detected')
    } else {
      this.vue.setWarning('No face detected, please make sure your face is visible')
    }
  }

  onInitializeSuccess () {
    console.info('The detector reports initialized')

    // Play video when detector has been initialized
    // Should start almost immediately predicting expression values
    // Triggers HTMLMediaElement: play event (see handling in the Vue Video component)
    const promise = this.video.play()
    if (promise) {
      // undefined in IE
      promise
        .then(() => {
          console.info('Video started playing')
        })
        .catch(console.error)
    }
  }

  startDetector () {
    // Detector is started when user clicks the play button (see Vue Video component)
    if (this.detector && !this.detector.isRunning) {
      // Run start() in affdex.js
      console.info('Detector started')
      this.detector.start()

      // Wait for onInitializeSuccess event to trigger...
      // and then the video starts playing at about the same time
      // as when the detector is initialized
    }
  }

  stopDetector () {
    if (this.detector && this.detector.isRunning) {
      this.detector.removeEventListener('onImageResultsSuccess')
      console.info('Detector stopped')
      this.detector.stop()
    }
  }
}

export default WebcamDetectorAndVideoInterplay
