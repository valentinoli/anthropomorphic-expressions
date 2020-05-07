<template>
  <div class='survey'>
    <v-overlay
      :value="overlay"
    >
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>

    <v-row justify="center">
      <v-btn
        v-for="lang in langs"
        :key="lang"
        @click="setLang(lang)"
        icon
        class="btn-lang"
        :color="selectedLang === lang ? 'success' : ''"
      >
        {{ lang }}
      </v-btn>
    </v-row>

    <v-row>
      <v-form
        ref="form"
        lazy-validation
      >
        <p class="title text-center">
          {{ form.title }}
        </p>

        <v-row
          v-for="item in form.items"
          :key="item.name"
        >
          <div class="radio__label radio__lowLabel">{{ item.lowLabel }}</div>

          <v-radio-group
            v-model="item.value"
            :name="item.name"
            :id="item.name"
            :rules="radioRules"
            required
            row
          >
            <v-radio
              v-for="n in 5"
              :key="`${item.name}-${n}`"
              :label="`${n}`"
              :value="n"
            ></v-radio>
          </v-radio-group>

          <div class="radio__label radio__highLabel">{{ item.highLabel }}</div>
        </v-row>

        <v-row justify="center">
          <v-btn
            class="mr-4 justify-center btn-submit"
            color="success"
            @click="submit"
          >
            {{ form.submitText }}
          </v-btn>
        </v-row>
      </v-form>
    </v-row>
  </div>
</template>

<script>
import { setLatestCompletedStep, setItem } from '@/utils/local-storage';
import survey from '@/utils/survey';
import shuffle from 'lodash.shuffle';

const defaultLang = 'en';

export default {
  name: 'Survey',
  data() {
    return {
      langs: Object.keys(survey),
      selectedLang: defaultLang,
      overlay: false,
    };
  },
  created() {
    // Shuffle survey item indices beforehand to keep
    // the same shuffling if the user changes language
    const { items } = survey[defaultLang];
    const itemKeys = Object.keys(items);
    const indices = [...Array(itemKeys.length).keys()];
    this.indices = shuffle(indices);

    this.updateForm();
  },
  computed: {
    id() {
      return Number(this.$route.params.id);
    },
    radioRules() {
      return [
        (v) => !!v || '', // this.form.requiredMessage
      ];
    },
  },
  methods: {
    setLang(lang) {
      this.selectedLang = lang;
      this.updateForm();
    },
    submit() {
      const formValid = this.$refs.form.validate();

      if (formValid) {
        this.overlay = true;
        const { path } = this.$route;

        // v-model directive on the radio button groups took care of
        // updating the values in this.form.items
        const submission = this.form.items.map(({ name, value }) => ({ name, value }));
        setItem(path, JSON.stringify(submission));

        // Set the latest completed step of the current participant
        // and save it in browser's local storage
        setLatestCompletedStep(path);

        window.setTimeout(() => {
          // Redirect user to next video/submission when data has been saved
          const nextPath = this.id === 3 ? '/submit' : `/video/${this.id + 1}`;
          this.$router.replace(nextPath);
        }, 1000);
      } else {
        // Scroll to first error
        const { id: firstErrorId } = this.$refs.form.inputs.find(({ hasError }) => hasError);
        const el = document.getElementById(firstErrorId);
        el.scrollIntoView();
      }
    },
    updateForm() {
      const { items, ...rest } = survey[this.selectedLang];
      const itemsEntries = Object.entries(items).map(
        // Transform object into Array of objects for Vue template iteration
        // to work properly with v-for and v-model
        ([k, v]) => ({
          // field name attribute
          name: k,
          // initialize value for form's v-model
          value: this.form ? this.form.items.find((item) => item.name === k).value : null,
          lowLabel: v[0],
          highLabel: v[1],
        }),
      );
      const shuffledItems = this.indices.map((idx) => itemsEntries[idx]);
      this.form = { items: shuffledItems, ...rest };
    },
  },
};
</script>

<style scoped>
.btn-lang {
  margin-left: 5px;
  margin-bottom: 20px;
}

.btn-lang:last-child {
  margin-right: 10px;
}

.radio__label {
  margin-top: 20px;
}

.radio__lowLabel {
  text-align: right;
  margin-right: 16px;
  width: calc(50% - 150px);
}

.v-form {
  width: 100%;
}

.btn-submit {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
