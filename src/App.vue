<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <!-- Don't show step info on index page -->
            <template v-if="$route.path !== '/' && $route.path !== '/thanks'">
              <!-- Don't show stepper on mobile -->
              <template v-if="$vuetify.breakpoint.smAndUp">
                <v-stepper
                  v-model="currentStep"
                  alt-labels
                >
                  <v-stepper-header>
                    <template v-for="([key, value], index) in steps">
                      <v-stepper-step
                        :key="`${key}-step`"
                        :complete="currentStep > (index + 1)"
                        :step="index + 1"
                      >
                        {{ value }}
                      </v-stepper-step>
                      <v-divider
                        v-if="index + 1 !== steps.length"
                        :key="key"
                      ></v-divider>
                    </template>
                  </v-stepper-header>
                </v-stepper>
              </template>

              <!-- Show alternative to the stepper on mobile  -->
              <template v-else>
                <v-card class="mobile-step-card d-flex justify-center">
                  <div class="headline font-weight-bold">{{ steps[currentStep - 1][1] }}</div>
                </v-card>
              </template>
            </template>

            <!-- Display current view -->
            <v-container fluid class="view-container">
              <v-row>
                <v-col class="d-none d-sm-block" md="1" lg="2"></v-col>
                <v-col cols="12" md="10" lg="8">
                  <router-view/>
                </v-col>
                <v-col class="d-none d-sm-block" md="1" lg="2"></v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-footer app elevation="2" dark class="d-flex justify-center font-weight-light">
      <div>
        <v-icon left>mdi-copyright</v-icon> 2020 -
        <a
          href="mailto:valentin.loftsson@epfl.ch,paul.griesser@epfl.ch"
          target="_blank"
          class="contact-link"
        >
          Contact
        </a>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import steps from '@/utils/steps';

export default {
  name: 'App',
  components: {
  },
  data: () => ({
    steps: Object.entries(steps),
    currentStep: 1,
  }),
  watch: {
    $route(to) {
      this.currentStep = this.steps.findIndex((entry) => entry[0] === to.path) + 1;
    },
  },
};
</script>

<style>
  section p {
    text-align: justify;
  }

  section h2 {
    margin-bottom: 4px;
  }

  .view-container {
    min-height: 90vh;
  }

  .v-stepper,
  .mobile-step-card {
    margin-bottom: 20px;
  }

  .mobile-step-card {
    padding: 24px;
  }

  .contact-link {
    color: white !important;
    text-decoration: none;
  }

  .contact-link:hover {
    text-decoration: underline;
  }

  .v-footer {
    z-index: 10 !important;
  }
</style>
