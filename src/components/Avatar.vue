<template>
  <v-col cols="12" md="3" align="center">
    <v-avatar color="grey" size="120">
      <v-img :src="src" :alt="name" contain></v-img>
    </v-avatar>

    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title>{{ name }}</v-list-item-title>
        <v-list-item-subtitle>
          <div>
            {{ institution }}
          </div>
          <div>
            {{ role }}
          </div>
          <div>
            {{ email }}
          </div>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-col>
</template>

<script>
export default {
  name: 'Avatar',
  props: ['src', 'name', 'email', 'role', 'institution'],
};
</script>
