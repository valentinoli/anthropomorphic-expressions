<template>
  <v-overlay
    :value="value"
  >
    <slot />
    <v-progress-circular
      indeterminate
      size="64"
    />
  </v-overlay>
</template>

<script>
export default {
  name: 'Overlay',
  props: {
    value: Boolean
  }
}
</script>
