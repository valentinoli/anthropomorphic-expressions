<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row
          align="center"
          justify="center"
        >
          <v-col cols="12">
            <!-- Don't show step info on index page -->
            <template v-if="$route.path !== '/' && $route.path !== '/thanks'">
              <!-- Don't show stepper on mobile -->
              <!-- <template v-if="$vuetify.breakpoint.smAndUp">
                <v-stepper
                  v-model="currentStep"
                  alt-labels
                >
                  <v-stepper-header>
                    <template
                      v-for="([key, value], index) in steps"
                      :key="`${key}-step`"
                    >
                      <v-stepper-step
                        :complete="currentStep > (index + 1)"
                        :step="index + 1"
                      >
                        {{ value }}
                      </v-stepper-step>
                      <v-divider
                        v-if="index + 1 !== steps.length"
                        :key="key"
                      />
                    </template>
                  </v-stepper-header>
                </v-stepper>
              </template> -->

              <!-- Show alternative to the stepper on mobile  -->
              <!-- <template v-else> -->
              <v-card class="mobile-step-card d-flex justify-center">
                <div class="text-h6 font-weight-bold py-2">
                  {{ steps[currentStep - 1][1] }}
                </div>
              </v-card>
              <!-- </template> -->
            </template>

            <!-- Display current view -->
            <v-container
              fluid
              class="view-container"
            >
              <v-row>
                <v-col
                  class="d-none d-sm-block"
                  md="1"
                  lg="2"
                />
                <v-col
                  cols="12"
                  md="10"
                  lg="8"
                >
                  <router-view />
                </v-col>
                <v-col
                  class="d-none d-sm-block"
                  md="1"
                  lg="2"
                />
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer
      app
      theme="dark"
      elevation="2"
      class="d-flex justify-center font-weight-light"
    >
      <div>
        <v-icon left>
          mdi-copyright
        </v-icon> {{ new Date().getFullYear() }} -
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
import steps from '@/utils/steps'

export default {
  name: 'App',
  components: {
  },
  data: () => ({
    steps: Object.entries(steps),
    currentStep: 1
  }),
  watch: {
    $route (to) {
      this.currentStep = this.steps.findIndex((entry) => entry[0] === to.path) + 1
    }
  }
}
</script>

<style>
p {
  padding-bottom: 1rem
}

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

.v-overlay__content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
