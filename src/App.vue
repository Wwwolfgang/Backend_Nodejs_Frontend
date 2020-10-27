<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        Sistema de Reservas
      </div>
      <v-btn to="/reservas" text>
        Reservas
      </v-btn>
      <v-btn to="/agregarReserva" text>
        Nueva Reserva
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>
