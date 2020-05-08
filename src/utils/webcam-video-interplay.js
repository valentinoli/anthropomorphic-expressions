
export default class WebcamDetectorAndVideoInterplay {
  detector;

  video;

  results = [];

  timestamps = [];

  constructor(videoEl) {
    // SDK needs to create video and canvas nodes in the DOM in order to function
    // Here we are adding those nodes to a predefined div.
    const divRoot = document.getElementById('affdexElements');
    const width = 640;
    const height = 480;
    const faceMode = affdex.FaceDetectorMode.LARGE_FACES;

    // Construct a CameraDetector and specify the image width / height and face detector mode.
    const detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

    // Enable detection of all Expressions, Emotions and Emojis classifiers.
    detector.detectAllEmotions();
    detector.detectAllExpressions();
    detector.detectAllEmojis();
    detector.detectAllAppearance();

    // Add callbacks to notify when the detector is initialized/failed to initialize
    detector.addEventListener('onInitializeSuccess', this.onInitializeSuccess.bind(this));
    detector.addEventListener('onInitializeFailure', (err) => console.error(err));

    // Add a callback to notify when detector is stopped
    detector.addEventListener('onStopSuccess', () => console.log('The detector reports stopped'));

    // Add callbacks to notify when camera access is allowed/denied
    detector.addEventListener('onWebcamConnectSuccess', () => {
      // Access provided to web camera
      // Detector is started
      console.log('Webcam access allowed');
    });
    detector.addEventListener('onWebcamConnectFailure', (error) => {
      // Access denied to web camera
      // Detector should not have started
      console.error('Webcam access denied', error);
    });

    // Add a callback to receive the results from processing an image.
    // The faces object contains the list of the faces detected in an image.
    // Faces object contains probabilities for all the different expressions,
    // emotions and appearance metrics
    detector.addEventListener('onImageResultsSuccess', this.onImageResultsSuccess.bind(this));

    this.detector = detector;
    this.video = videoEl;
  }

  get data() {
    return {
      results: this.results,
      timestamps: this.timestamps,
    };
  }

  onInitializeSuccess() {
    console.log('The detector reports initialized');

    // Play video when detector has been initialized
    // Should start almost immediately predicting expression values
    // Triggers HTMLMediaElement: play event (see handling in the Vue Video component)
    const promise = this.video.play();
    if (promise) {
      // undefined in IE
      promise
        .then(() => {
          console.log('Video started playing');
        })
        .catch(console.error);
    }
  }

  onImageResultsSuccess(faces, image, timestamp) {
    console.log(`Timestamp: ${timestamp}`);

    if (faces.length > 0) {
      const {
        appearance,
        expressions,
        emotions,
        emojis,
      } = faces[0];

      const result = {
        appearance,
        expressions,
        emotions,
        emojis,
      };

      this.timestamps.push(timestamp);
      this.results.push(result);
    }
  }

  startDetector() {
    // Detector is started when user clicks the play button (see Vue Video component)
    if (this.detector && !this.detector.isRunning) {
      // Run start() in affdex.js
      console.log('Detector started');
      this.detector.start();

      // Wait for onInitializeSuccess event to trigger...
      // and then the video starts playing at about the same time
      // as when the detector is initialized
    }
  }

  stopDetector() {
    if (this.detector && this.detector.isRunning) {
      this.detector.removeEventListener(this.onImageResultsSuccess.bind(this));
      console.log('Detector stopped');
      this.detector.stop();
    }
  }
}
