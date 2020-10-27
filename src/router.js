import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/reservas",
      name: "reservas",
      component: () => import("./components/ReservaLista")
    },
    // {
    //   path: "/tutorials/:id",
    //   name: "tutorial-details",
    //   component: () => import("./components/Tutorial")
    // },
    {
      path: "/agregarReserva",
      name: "agregar",
      component: () => import("./components/AgregarReserva")
    }
  ]
});