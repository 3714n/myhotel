<template>
  <v-container>
    <v-app-bar>
      <v-app-bar-title class="my-custom-title">My Hotel</v-app-bar-title>

      <template v-slot:append>
        <v-btn icon="mdi-heart"></v-btn>

        <v-btn icon="mdi-magnify"></v-btn>

        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>
  </v-container>
</template>

<script>

</script>

<style scoped>
.my-custom-title {
  text-align: left;
}
</style>