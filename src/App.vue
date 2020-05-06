<template>
  <v-app>
    <!-- <v-app-bar app color="white" light>
      <v-img
        alt="EPFL Logo"
        class="shrink mr-2"
        contain
        src="https://web2018.epfl.ch/4.2.0/icons/epfl-logo.svg"
        transition="scale-transition"
        width="40"
      />
      <span>Anthropomorphic Attitudes Towards Robots</span>
    </v-app-bar> -->

    <!-- Check window.navigator.mediaDevices property support  -->

    <v-content>
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <!-- Don't show step info on index page -->
            <template v-if="$route.path !== '/'">
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
                        :complete="currentStep > index + 1"
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
                  <div class="headline font-weight-bold">{{ steps[currentStep][1] }}</div>
                </v-card>
              </template>
            </template>

            <!-- Display current view -->
            <v-container fluid class="view-container">
              <v-row>
                <v-col class="d-none d-sm-block" sm="1"></v-col>
                <v-col cols="12" sm="10">
                  <router-view/>
                </v-col>
                <v-col class="d-none d-sm-block" sm="1"></v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <!-- <v-footer app>
    </v-footer> -->
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
    currentStep: 0,
  }),
  watch: {
    $route(to) {
      this.currentStep = this.steps.findIndex((entry) => entry[0] === to.path);
    },
  },
};
</script>

<style>
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
</style>
