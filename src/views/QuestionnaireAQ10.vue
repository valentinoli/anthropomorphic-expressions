<template>
  <div class="font-weight-light">
    <QuestionnaireForm
      :items="items"
      :choices="choices"
      data-key="aq10"
    />
  </div>
</template>

<script>
import QuestionnaireForm from '@/components/QuestionnaireForm.vue'
import { aq10 } from '@/utils/questionnaires'

export default {
  components: {
    QuestionnaireForm
  },
  data () {
    return {
      overlay: false,
      formOptions: [
        'Definitely Agree',
        'Slightly Agree',
        'Slightly Disagree',
        'Definitely Disagree'
      ]
    }
  },
  computed: {
    items () {
      return aq10.map((question, idx) => ({
        question,
        name: `q${idx + 1}`,
        value: null
      }))
    },
    choices () {
      return this.formOptions.map((option, idx) => ({
        text: option,
        value: idx + 1
      }))
    }
  }
}
</script>
