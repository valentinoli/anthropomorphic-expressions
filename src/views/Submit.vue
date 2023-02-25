<template>
  <div class="submit">
    <Overlay :value="overlay" />
    <div class="text-center">
      <p class="title">
        You have reached the end!
      </p>
      <p>
        The final step is to submit your data
      </p>
      <p>
        Before submitting, please answer the question below
      </p>
      <v-form
        ref="form"
        class="d-flex flex-column align-center"
        @submit.prevent="submit"
      >
        <div
          style="opacity: 0.6"
          class="mt-4"
        >
          Have you ever interacted with a robot in real life?
        </div>
        <v-radio-group
          v-model="robotRealLife"
          :rules="[
            (v) => !!v || '',
          ]"
          inline
        >
          <v-radio
            label="Yes"
            value="1"
          />
          <v-radio
            label="No"
            value="0"
          />
        </v-radio-group>
        <v-btn
          color="success"
          class="mt-6"
          type="submit"
          prepend-icon="mdi-send-circle-outline"
        >
          submit data
        </v-btn>
      </v-form>
    </div>
    <v-alert
      v-if="error"
      type="error"
      outlined
      class="mt-8"
    >
      <div class="d-flex justify-space-between">
        <p>Some error occurred while saving the data</p>
        <v-btn
          depressed
          color="error"
          :href="`mailto:valentin.loftsson@gmail.com?body=${message}`"
        >
          <v-icon left>
            mdi-email
          </v-icon>
          Report error
        </v-btn>
      </div>
      <div class="mt-2">
        <code>
          {{ message }}
        </code>
      </div>
    </v-alert>
  </div>
</template>

<script>
// import uploadData from '@/utils/upload-data'
import {
  setSubmitted, setLatestCompletedStep, getItem, setItem
} from '@/utils/local-storage'
import Overlay from '@/components/Overlay.vue'

export default {
  name: 'Submit',
  components: {
    Overlay
  },
  data () {
    return {
      overlay: false,
      error: false,
      message: '',
      robotRealLife: null
    }
  },
  methods: {
    async submit () {
      const { valid } = await this.$refs.form.validate()

      if (valid) {
        try {
          this.overlay = true

          // Add the answer to the question
          // "Have you ever interacted with a robot in real life?"
          // to local storage
          const generalInfo = JSON.parse(getItem('general'))
          generalInfo.robotRealLife = this.robotRealLife
          setItem('general', JSON.stringify(generalInfo))

          // await uploadData()

          // Clear storage? Perhaps not just in case something goes wrong
          // clearStorage();

          window.setTimeout(() => {
            // Save user's progress as "submitted"
            // so that he/she can't repeat the experiment
            setSubmitted()

            setLatestCompletedStep(null)

            console.info('Data uploaded successfully')

            // Redirect user to /thanks
            this.$router.replace('/thanks').catch((err) => {
              console.error(err)
            })
          }, 1500)
        } catch (err) {
          this.error = true
          this.message = err
          console.error(err)
        } finally {
          this.overlay = false
        }
      }
    }
  }
}
</script>
