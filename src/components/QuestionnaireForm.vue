<template>
  <div>
    <Overlay :value="overlay" />
    <v-form
      ref="form"
      lazy-validation
    >
      <div class="d-flex flex-column">
        <div
          v-for="item in items"
          :key="item.name"
          class="d-flex flex-column align-center mb-6"
        >
          <div>
            {{ item.question }}
          </div>

          <v-radio-group
            :id="item.name"
            v-model="item.value"
            :name="item.name"
            :rules="radioRules"
            required
            :row="$vuetify.breakpoint.smAndUp"
            :column="$vuetify.breakpoint.xsOnly"
          >
            <v-radio
              v-for="choice in choices"
              :key="choice.text"
              :label="choice.text"
              :value="choice.value"
            />
          </v-radio-group>
        </div>
      </div>

      <v-row justify="center">
        <v-btn
          class="mr-4 justify-center btn-submit"
          color="success"
          @click="submit"
        >
          <v-icon left>
            mdi-send-circle-outline
          </v-icon>submit
        </v-btn>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import Overlay from '@/components/Overlay.vue'
import nextStep from '@/utils/next-step'
import { setItem, setLatestCompletedStep } from '@/utils/local-storage'

export default {
  components: {
    Overlay
  },
  props: {
    dataKey: {
      required: true,
      type: String
    },
    items: {
      required: true,
      type: Array
    },
    choices: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      overlay: false,
      radioRules: [
        (v) => v === 0 || !!v || ''
      ]
    }
  },
  methods: {
    submit () {
      const formValid = this.$refs.form.validate()

      if (formValid) {
        this.overlay = true

        const data = this.items.map(({ name, value }) => ({ name, value }))

        const submission = {
          data
        }
        if (this.dataKey === 'aq10') {
          // Compute score for AQ10 test
          // SCORING: Only 1 point can be scored for each question.
          // Score 1 point for Definitely or Slightly Agree
          // on each of items 1, 7, 8, and 10.
          // Score 1 point for Definitely or Slightly Disagree
          // on each of items 2, 3, 4, 5, 6, and 9.
          // If the individual scores more than 6 out of 10,
          // consider referring them for a specialist diagnostic assessment.
          // Assuming the following mapping:
          // 1: Definitely Agree
          // 2: Slightly Agree
          // 3: Slightly Disagree
          // 4: Definitely Disagree
          const questionsAgreeScored = [1, 7, 8, 10].map((k) => `q${k}`)
          const questionsDisagreeScored = [2, 3, 4, 5, 6, 9].map((k) => `q${k}`)
          let totalScore = 0

          data.forEach(({ name, value }, idx) => {
            let score = 0
            if (
              (questionsAgreeScored.includes(name) && value <= 2) ||
              (questionsDisagreeScored.includes(name) && value >= 3)
            ) {
              totalScore += 1
              score = 1
            }
            submission.data[idx].score = score
          })

          submission.totalScore = totalScore
          submission.considerDiagnosticAssessment = totalScore >= 6
        }
        setItem(this.dataKey, JSON.stringify(submission))

        const { path } = this.$route

        window.setTimeout(() => {
          // Set the latest completed step of the current participant
          // and save it in browser's local storage
          setLatestCompletedStep(path)

          // Redirect user to next step when data has been saved
          const toPath = nextStep(path)
          this.$router.replace(toPath)
        }, 1000)
      } else {
        // Scroll to first error
        const { $el } = this.$refs.form.inputs.find(({ hasError }) => hasError)
        $el.scrollIntoView()
      }
    }
  }
}
</script>

<style scoped>
.v-form {
  width: 100%;
}

.form__item {
  width: 33%;
}

.btn-submit {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
