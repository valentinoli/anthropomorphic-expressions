<template>
  <div class="font-weight-light">
    <QuestionnaireForm
      :items="items"
      :choices="choices"
      data-key="sqpb"
    />
  </div>
</template>

<script>
import QuestionnaireForm from '@/components/QuestionnaireForm.vue'
import { spqb } from '@/utils/questionnaires'

export default {
  components: {
    QuestionnaireForm
  },
  data () {
    return {
      overlay: false,
      choices: [
        { text: 'Yes', value: 1 },
        { text: 'No', value: 0 }
      ]
    }
  },
  computed: {
    items () {
      return spqb.map((question, idx) => ({
        question,
        name: `q${idx + 1}`,
        value: null
      }))
    }
  }
}
</script>
