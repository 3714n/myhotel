
<template>
  <div class="card-menu">
  <v-card >
    <v-layout>
      <v-navigation-drawer app :style="{ width: '100vh' }"
        image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
        theme="dark"
        permanent
      >
        <v-list nav>
          <v-list-item v-for="item in menuitems" :key="item.title" :to="item.route" prepend-icon="mdi-email" ><v-list-item-title>{{ item.title }}</v-list-item-title></v-list-item>
                    
        </v-list>
      </v-navigation-drawer>
      <v-main class="full-height" ></v-main>
    </v-layout>
  </v-card>
  </div>

</template>



<script>
export default {
  data (){
    return{
      menuitems: [
        {title: "Disponibilidad", route: "/disponibilidad"},
        {title: "Reserva", route: "/reserva"},
        {title: "Habitaciones", route: "/habitaciones"},
        {title: "Clientes", route: "/clientes"},
        {title: "Cuentas", route: "/cuentas"},
      ],
    };
  },
};

</script>

<style scoped>
.full-height{
  height: 90.33vh;
  
  padding: 0;


};




</style>