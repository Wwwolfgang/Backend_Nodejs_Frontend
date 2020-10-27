<template>
    <v-stepper
        v-model="e6"
        vertical
    >
        <v-stepper-step
            :complete="e6 > 1"
            step="1"
        >
            Seleccione un restaurante
        </v-stepper-step>

        <v-stepper-content step="1">
            <v-card
                class="mb-6"
                height="200px"
            >
                <div v-if="restaurantes.length>0">
                    <v-container
                        class="px-3"
                        fluid
                    >
                        <v-radio-group v-model="restaurante">
                            <v-radio
                                v-for="(restaurante,id) in restaurantes"
                                :key="id"
                                :label="`Restaurante: ${restaurante.nombre} Direccion: ${restaurante.direccion}`"
                                :value="restaurante"
                            ></v-radio>
                        </v-radio-group>

                    </v-container>
                </div>
                <div v-else>
                    No hay restaurantes para seleccionar!
                </div>
            </v-card>
            <div v-if="restaurante !== null">
                <v-btn
                    color="primary"
                    @click="e6 = 2"
                >
                    Continuar
                </v-btn>
                <v-btn
                    text
                    @click="restaurante = null"
                >
                    Cancelar
                </v-btn>
            </div>
        </v-stepper-content>

        <v-stepper-step
            :complete="e6 > 2"
            step="2"
        >
            Seleccione una fecha y un horario de reserva
        </v-stepper-step>

        <v-stepper-content step="2">
            <v-card
                class="mb-12"
                height="420px"
            >
                <v-container
                    class="px-3"
                    fluid
                >
                    <v-row>
                        <v-col>
                            <v-date-picker v-model="fecha"></v-date-picker>
                        </v-col>
                        <v-col>
                            <v-container fluid>
                                Horarios a elegir
                                <v-checkbox
                                    v-model="rangos[0]"
                                    :label="`12 hs - 13 hs`"
                                ></v-checkbox>
                                <v-checkbox
                                    v-model="rangos[1]"
                                    :label="`13 hs - 14 hs`"
                                ></v-checkbox>
                                <v-checkbox
                                    v-model="rangos[2]"
                                    :label="`14 hs - 15 hs`"
                                ></v-checkbox>
                                <v-checkbox
                                    v-model="rangos[3]"
                                    :label="`19 hs - 20 hs`"
                                ></v-checkbox>
                                <v-checkbox
                                    v-model="rangos[4]"
                                    :label="`20 hs - 21 hs`"
                                ></v-checkbox>
                            </v-container>
                        </v-col>
                        <v-col>
                            <v-container fluid>
                                <v-checkbox
                                    v-model="rangos[5]"
                                    :label="`21 hs - 22 hs`"
                                ></v-checkbox>
                                <v-checkbox
                                    v-model="rangos[6]"
                                    :label="`22 hs - 23 hs`"
                                ></v-checkbox>
                            </v-container>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
            <div v-if="horarioElegido === true">
                <v-btn
                    color="primary"
                    @click="e6 = 3,mesas = restaurante.mesas,reservas=restaurante.reservas"
                >
                    Continuar
                </v-btn>
                <v-btn
                    text
                    @click="rangos = []">
                    Cancelar
                </v-btn>
                <v-btn
                    text
                    @click="e6 = 1,rangos = []"
                >
                    Atras
                </v-btn>
            </div>
        </v-stepper-content>

        <v-stepper-step
            :complete="e6 > 3"
            step="3"
        >
            Seleccione una mesa
        </v-stepper-step>

        <v-stepper-content step="3">
            <v-card
                class="mb-12"
                height="fluid"
            >
                <v-row>
                    <v-col>
                        <v-container fluid v-if="mesasFiltradas.length>0">
                            <v-checkbox
                                v-model="mesasElegidas"
                                v-for="(mesa,index) in mesasFiltradas"
                                :key="index"
                                :label="`${mesa.nombre} Capacidad: ${mesa.capacidad}`"
                                :value="mesa"
                            >
                            </v-checkbox>
                        </v-container>
                        <v-container v-else>
                            No hay mesas disponibles en este horario
                        </v-container>
                    </v-col>
                    <v-col>
                        <v-container fluid>
                            <v-autocomplete
                                v-model="clienteElegido"
                                :items="clientes"
                                :filter="buscarCliente"
                                outlined
                                item-text="cedula"
                                item-value="id"
                                label="Cliente"
                            ></v-autocomplete>
                            <v-text-field
                                v-model="personas"
                                type="number"
                                label="Cantidad de personas"
                                required
                            ></v-text-field>
                            <v-text-field
                                v-model="nombreReserva"
                                label="Nombre o descripcion de la reserva (opcional)"
                                required
                            ></v-text-field>
                        </v-container>
                    </v-col>
                    <v-col>
                        <v-container fluid>
                            <template>
                                <form>
                                    <v-text-field
                                        v-model="nombre"
                                        :error-messages="nombreErrors"
                                        :counter="10"
                                        label="Nombre"
                                        required
                                        @input="$v.nombre.$touch()"
                                        @blur="$v.nombre.$touch()"
                                    ></v-text-field>
                                    <v-text-field
                                        v-model="apellido"
                                        :error-messages="apellidoErrors"
                                        :counter="10"
                                        label="Apellido"
                                        required
                                        @input="$v.apellido.$touch()"
                                        @blur="$v.apellido.$touch()"
                                    ></v-text-field>
                                </form>
                                <v-text-field
                                    v-model="cedula"
                                    :error-messages="cedulaErrors"
                                    label="Cedula"
                                    required
                                    @input="$v.cedula.$touch()"
                                    @blur="$v.cedula.$touch()"
                                ></v-text-field>
                                <v-btn
                                    class="mr-4"
                                    @click="registrar"
                                >
                                    Registrar
                                </v-btn>
                                <v-btn @click="cancelar">
                                    Cancelar
                                </v-btn>
                            </template>
                        </v-container>
                    </v-col>
                </v-row>
            </v-card>
            <div v-if="listoReserva">
                <v-btn
                    color="primary"
                    @click="reservar"
                >
                    Reservar
                </v-btn>
                <v-btn
                    text
                    @click="mesasElegidas=[],clienteElegido=null,personas=''"
                >
                    Cancelar
                </v-btn>
                <v-btn
                    text
                    @click="e6 = 2,mesasElegidas=[],clienteElegido=null,personas=''"
                >
                    Atras
                </v-btn>
            </div>
            <div v-else>
                <v-btn
                    text
                    @click="e6 = 2,mesasElegidas=[],clienteElegido=null,personas=''"
                >
                    Atras
                </v-btn>
            </div>
        </v-stepper-content>
    </v-stepper>
</template>

<script>
import RestauranteDatosService from "@/services/RestauranteDatosService";
import ClientesDatosService from "@/services/ClientesDatosService";
import ReservaDatosService from "@/services/ReservaDatosService";
import {validationMixin} from 'vuelidate'
import {required, maxLength, integer} from 'vuelidate/lib/validators'

export default {
    name: "AgregarReserva",
    mixins: [validationMixin],
    validations: {
        nombre: {required, maxLength: maxLength(10)},
        apellido: {required, maxLength: maxLength(10)},
        cedula: {required, integer},
    },
    data() {
        return {
            personas: '',
            nombreReserva:'',
            nombre: '',
            apellido: '',
            cedula: null,
            e6: 1,
            restaurante: null,
            restaurantes: [],
            fecha: new Date().toISOString().substr(0, 10),
            rangos: [false, false, false, false, false, false, false],
            mesas: [],
            reservas: [],
            mesasElegidas: [],
            clientes: [],
            clienteElegido: null,
        }
    },
    methods: {
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
                reservas: restaurante.reservas.map(this.getDisplayReserva)
            }
        },
        getDisplayReserva(reserva) {
            return {
                mesaId: reserva.mesaId,
                nombre: reserva.nombre,
                cantidad: reserva.cantidad,
                fecha: reserva.fecha,
                rangos: [reserva.r1213, reserva.r1314, reserva.r1415, reserva.r1920, reserva.r2021, reserva.r2122, reserva.r2223],
            }
        },
        async getAllClientes() {
            await ClientesDatosService.getAll()
                .then((response) => {
                    this.clientes = response.data.map(this.getDisplayClientes);
                    console.log(response.data);
                })
                .catch((e) => {
                    console.log(e);
                })
        },
        getDisplayClientes(cliente) {
            return {
                id: cliente.id,
                cedula: cliente.cedula,
                nombre: cliente.nombre,
                apellido: cliente.apellido
            }
        },
        buscarCliente(item, queryText) {
            const textOne = item.cedula.toString()
            const searchText = queryText.toLowerCase()

            return textOne.indexOf(searchText) > -1
        },

        registrar() {
            this.$v.$touch()
            let data = {
                nombre: this.nombre,
                apellido: this.apellido,
                cedula: this.cedula,
            };

            ClientesDatosService.create(data)
                .then((response) => {
                    console.log(response.data);
                    this.getAllClientes()
                    this.$v.$reset()
                    this.nombre = ''
                    this.apellido = ''
                    this.cedula = null
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        reservar() {
            for (let mesa of this.mesasElegidas) {
                let data = {
                    nombre: this.nombreReserva,
                    mesaId: mesa.id,
                    clienteId: this.clienteElegido,
                    restauranteId: this.restaurante.id,
                    fecha: this.fecha,
                    cantidad: this.personas,
                    r1213: this.rangos[0],
                    r1314: this.rangos[1],
                    r1415: this.rangos[2],
                    r1920: this.rangos[3],
                    r2021: this.rangos[4],
                    r2122: this.rangos[5],
                    r2223: this.rangos[6],

                };
                ReservaDatosService.create(data)
                    .then((response) => {
                        console.log(response.data);
                        this.$router.push("reservas")
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
        },
        cancelar() {
            this.$v.$reset()
            this.nombre = ''
            this.apellido = ''
            this.cedula = null
        },

    },
    computed: {
        mesasFiltradas() {
            let mesasfiltradas = []
            let mesasEliminar = []
            let otraFecha = false
            if (this.reservas.length === 0) {
                mesasfiltradas = this.mesas
            } else {
                for (let reserva of this.reservas) {
                    let rangoOcupado = false
                    if (this.fecha.valueOf() === reserva.fecha.valueOf()) {
                        otraFecha = true
                        for (let step = 0; step < 7; step++) {
                            rangoOcupado = !(this.rangos[step] === false || reserva.rangos[step] !== this.rangos[step]);
                            console.log(rangoOcupado, step)
                            if (rangoOcupado) {
                                mesasEliminar.push(reserva.mesaId)
                                console.log("Mesa id:", reserva.mesaId)
                                break
                            }
                        }
                    }
                }
                if (!otraFecha) {
                    mesasfiltradas = this.mesas
                } else {
                    for (let mesa of this.mesas) {
                        let existe = false
                        let duplicado = false
                        for (let mesaE of mesasEliminar) {
                            if (mesa.id === mesaE) {
                                existe = true
                                break
                            }
                        }
                        if (!existe) {
                            for (let table of mesasfiltradas) {
                                if (table.id === mesa.id) {
                                    duplicado = true
                                    break
                                }
                            }
                            if (!duplicado) {
                                mesasfiltradas.push(mesa)
                                console.log("pushed")
                            }
                        }
                    }
                }
            }
            return mesasfiltradas
        },
        horarioElegido() {
            for (let step = 0; step < 8; step++) {
                if (this.rangos[step] === true) {
                    return true
                }
            }
            return false
        },
        nombreErrors() {
            const errors = []
            if (!this.$v.nombre.$dirty) return errors
            !this.$v.nombre.maxLength && errors.push('Nombre solo puede ser de 10 caracteres')
            !this.$v.nombre.required && errors.push('Nombre es obligatorio.')
            return errors
        },
        apellidoErrors() {
            const errors = []
            if (!this.$v.apellido.$dirty) return errors
            !this.$v.apellido.maxLength && errors.push('Apellido solo puede ser de 10 caracteres')
            !this.$v.apellido.required && errors.push('Apellido es obligatorio.')
            return errors
        },
        cedulaErrors() {
            const errors = []
            if (!this.$v.cedula.$dirty) return errors
            !this.$v.cedula.required && errors.push('Cedula es obligatoria.')
            !this.$v.cedula.integer && errors.push('La cedula solo puede contener numeros.')
            return errors
        },
        listoReserva() {
            return this.clienteElegido !== null && this.personas !== '' && this.personas > 0 && this.mesasElegidas.length > 0;

        },
    },
    mounted() {
        this.obtenerRestaurantes();
        this.getAllClientes();
    },

}
</script>

<style scoped>

</style>