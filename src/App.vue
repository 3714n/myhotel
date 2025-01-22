<template>
  <v-app>
    <!-- Encabezado -->
    <heardApp />

    <!-- Contenido principal -->
    <v-main app>
      <v-container fluid class="pa-0">
        <v-row>
          <!-- Menú lateral -->
          <v-col cols="2" class="pa-0">
            <menuLateral />
          </v-col>

          <!-- Contenido dinámico -->
          <v-col cols="10" class="pa-4">
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import heardApp from '../src/module/menus/components/heardApp.vue'
import menuLateral from '../src/module/menus/components/MenuLateral.vue'
</script>

<style scoped>

/* El contenido principal se ajusta al espacio restante */
.v-main {
  
  margin-top: 0; /* Coincide con la altura del encabezado */
}

.v-container {
 height: calc(0vh - 64px);
 padding:6px;  /*Altura total menos la altura del encabezado */
}

.v-col-2 {
  max-width: 15%; /* Ajusta el ancho del menú lateral */
}

.v-col-10 {
  width: 85%; /* Resto del espacio */
}
</style>
