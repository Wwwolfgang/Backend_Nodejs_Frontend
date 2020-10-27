<template>
    <v-row align="center" class="list px-3 mx-auto">
        <v-col cols="6" md="3">
            <v-autocomplete
                v-model="restauranteFilter"
                :items="restaurantes"
                :filter="buscarRestaurante"
                clearable
                outlined
                dense
                item-text="nombre"
                item-value="id"
                label="Filtrar por Restaurante"
                @click:clear="$nextTick(() => restauranteFilter=null)"
            ></v-autocomplete>
        </v-col>
            <v-col cols="6" md="3">
              <v-autocomplete
                  v-model="fechaFilter"
                  :items="fechas"
                  :filter="buscarFecha"
                  clearable
                  outlined
                  dense
                  label="Filtrar por Fecha"
                  @click:clear="$nextTick(() => fechaFilter=null)"
              ></v-autocomplete>
            </v-col>
        <v-col cols="12" sm="12">
            <v-card class="mx-auto" tile>
                <v-card-title>Reservas</v-card-title>

                <v-data-table
                    :headers="headers"
                    :items="reservasFiltradas"
                    multi-sort
                    :sort-by="['inicio','mesa']"
                    :sort-desc="[false, false]"
                    disable-pagination
                    :hide-default-footer="true"
                >
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon small @click="deleteReserva(item.id)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import ReservaDatosService from "@/services/ReservaDatosService";
import RestauranteDatosService from "@/services/RestauranteDatosService";

export default {
    name: "ReservaLista",
    data() {
        return {
            reservas: [],
            restaurantes: [],
            fechas: [],
            restauranteFilter: null,
            fechaFilter: null,
            title: "",
            headers: [
                {text: "Restaurante", align: "start", sortable: true, value: "restaurante"},
                {text: "Fecha", value: "fecha", sortable: true},
                {text: "Inicio", value: "inicio", sortable: true},
                {text: "Fin", value: "fino", sortable: true},
                {text: "Nombre", value: "nombre", sortable: false},
                {text: "Cantidad", value: "cantidad", sortable: false},
                {text: "Mesa", value: "mesa", sortable: true},
                {text: "Cliente", value: "cliente", sortable: false},
                {text: "Actions", value: "actions", sortable: false},
            ],
        }
    },
    methods: {
        async obtenerReservas() {
            await ReservaDatosService.getAll()
                .then((response) => {
                    this.reservas = response.data.map(this.getDisplayReserva);
                    this.prepararReservas()
                    this.getAllFechas();
                    console.log(response.data);
                })
                .catch((e) => {
                    console.log(e);
                })
        },
        prepararReservas() {
            for (let reserva of this.reservas) {
                for (let i = 0; i < 8; i++) {
                    if (reserva.horarios[i]) {
                        if (i < 3) {
                            reserva.inicio.push(((i + 12).toString()).concat(" Hs."))
                            reserva.fino.push(((i + 13).toString()).concat(" Hs."))
                        } else {
                            reserva.inicio.push(((i + 16).toString()).concat(" Hs."))
                            reserva.fino.push(((i + 17).toString()).concat(" Hs."))
                        }
                    }
                }
            }
        },
        async obtenerRestaurantes() {
            await RestauranteDatosService.getAll()
                .then((response) => {
                    this.restaurantes = response.data.map(this.getDisplayRestaurante);
                    console.log(response.data);
                })
                .catch((e) => {
                    console.log(e);
                })
        },
        getDisplayRestaurante(restaurante) {
            return {
                id: restaurante.id,
                direccion: restaurante.direccion,
                nombre: restaurante.nombre,
                mesas: restaurante.mesas,
                reservas: restaurante.reservas
            }
        },
        getAllFechas() {
            let fechAs = []
            for (let reserva of this.reservas) {
                if (fechAs.length === 0) {
                    fechAs.push(reserva.fecha)
                } else {
                    let nuevo = true
                    for (let fech of fechAs) {
                        if (fech.valueOf() === reserva.fecha.valueOf()) {
                            nuevo = false
                            break
                        }
                    }
                    if (nuevo) {
                        fechAs.push(reserva.fecha)
                    }
                }
            }
            this.fechas = fechAs
        },
        buscarRestaurante(item, queryText) {
            const textOne = item.nombre.toLowerCase()
            const searchText = queryText.toLowerCase()

            return textOne.indexOf(searchText) > -1
        },
        buscarFecha(item, queryText) {
            const textOne = item.toString()
            const searchText = queryText.toLowerCase()

            return textOne.indexOf(searchText) > -1
        },
        deleteReserva(id) {
            ReservaDatosService.delete(id)
                .then(() => {
                    this.refreshLista()
                })
                .catch((e) => {
                    console.log(e);
                });

        },
        refreshLista() {
            this.obtenerReservas();
        },
        getDisplayReserva(reserva) {
            return {
                id: reserva.id,
                nombre: reserva.nombre,
                cantidad: reserva.cantidad,
                fecha: reserva.fecha,
                restaurante: reserva.restaurante.nombre,
                restauranteId: reserva.restauranteId,
                mesa: reserva.mesa.nombre,
                cliente: reserva.cliente.nombre,
                horarios: [reserva.r1213, reserva.r1314, reserva.r1415, reserva.r1920, reserva.r2021, reserva.r2122, reserva.r2223],
                inicio: [],
                fino: []
            }
        },

    },
    computed: {
        reservasFiltradas() {
            let reservasMostrar = []
            if(this.restauranteFilter === null && this.fechaFilter === null)
            { return this.reservas }
            else if (this.restauranteFilter !== null && this.fechaFilter === null) {
                for (let reserva of this.reservas) {
                    if (reserva.restauranteId === this.restauranteFilter) {
                        reservasMostrar.push(reserva)
                    }
                }
                return reservasMostrar
            } else if(this.restauranteFilter === null && this.fechaFilter !== null){
                for (let reserva of this.reservas) {
                    if (reserva.fecha.valueOf() === this.fechaFilter.valueOf()) {
                        reservasMostrar.push(reserva)
                    }
                }
                return reservasMostrar
            }else{
                return this.reservas
            }
        },
    },
    mounted() {
        this.obtenerReservas();
        this.obtenerRestaurantes();

    },
}
</script>

<style scoped>

</style>