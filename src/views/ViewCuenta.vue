        <template>
            <v-container>
                <v-row>
                    <v-col>
                        <h1>Vista Cuentas</h1>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <v-table height="300px" fixed-header>
                            <thead>
                                <tr>
                                    <th class="text-center">Nombre</th>
                                    <th class="text-center">Apellido</th>
                                    <th class="text-center">Numero Identidad</th>
                                    <th class="text-center">Habitaciones</th>
                                    <th class="text-center">Fecha Apertura</th>
                                    <th class="text-center">Cantidad Personas</th>
                                    <th class="text-center">Valor a pagar</th>
                                    <th class="text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="cuenta in Cuentas" :key="cuenta.id">
                                    <td class="text-center">{{ cuenta.clientes[0].name }}</td>
                                    <td class="text-center">{{ cuenta.clientes[0].apellido }}</td>
                                    <td class="text-center">{{ cuenta.clientes[0].n_i }}</td>
                                    <td class="text-center">
                                        <ul>
                                            <li v-for="habitacion in cuenta.habitaciones" :key="habitacion.id">
                                                {{ habitacion.nameHabitacion }} ({{ habitacion.Cantidad }} personas)
                                            </li>
                                        </ul>
                                    </td>
                                    <td class="text-center">{{ cuenta.fecha }}</td>
                                    <td class="text-center">{{ cuenta.TotalesGeneral[0].cantidadPersonas }}</td>
                                    <td class="text-center">{{ cuenta.TotalesGeneral[0].total }}</td>
                                    <td>
                                        <v-btn class="text-none" color="primary" small @click="AgregarPago(cuenta.id)">
                                            Nuevo pago
                                        </v-btn>
                                        <v-btn class="text-none" color="red" small @click="CerrarCuenta(cuenta.id)">
                                            Cerrar Cuenta
                                        </v-btn>
                                    </td>
                                </tr>


                            </tbody>
                        </v-table>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-btn color="primary" @click="Nueva_cuenta()"> Nueva Cuenta</v-btn>
                    </v-col>
                </v-row>

                <v-dialog v-model="dialog" max-width="1000">
                    <nuevoServ @cerrar-dialogo="dialog = false" />
                    {{  fetchCuentas() }}
                </v-dialog>
                <v-dialog v-model="dialog1"  max-width="1000">
                    <nuevoPago :clienteFormHijo="clienteFormPadre" @cerrar-dialogo="dialog = false" />
                    {{  fetchCuentas() }}
                </v-dialog>

            </v-container>
        </template>
    <script>
    import { db } from "@/FireBaseConfig";
    import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
    import nuevoServ from '../module/Financiero/components/AgregarServ.vue';
    import nuevoPago from '../module/Financiero/components/AgregarPagos.vue';
    export default {
        components: {
            nuevoServ,
            nuevoPago,
        },
        data() {
            return {
                Cuentas: [],
                dialog1: false,
                dialog: false,
                selectedcuentas: null,
                clienteSeleccionado: null,
                clienteFormPadre:{
                    n_i:"",
                    name:"",
                    apellido:"",
                    
                },

            };
        },
        async created() {
            await this.fetchCuentas();
           
        },
        methods: {

            async fetchCuentas() {
                try {
                    const BusquedaSnapshot = await getDocs(collection(db, "cuentas"));

                    // Construimos `Cuentas` como un array de subarrays
                    this.Cuentas = BusquedaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), }));
                } catch (error) {
                    console.error("Error al cargar las cuentas:", error);
                }
            },

            Nueva_cuenta() {
                
                this.dialog = true;
                this.fetchCuentas();
                
            },

            AgregarPago(id) {
                const ClienteDatos = this.Cuentas.find((h) => h.id === id);
                this.clienteFormPadre = {...ClienteDatos.clientes[0]}
                this.dialog1 = true;
                this.fetchCuentas();
                console.log("numero de identidad: " + this.clienteFormPadre.n_i);
                console.log("numero de identidad: " + this.clienteFormPadre.name);
                console.log("numero de identidad: " + this.clienteFormPadre.apellido);
            },
            async CerrarCuenta(id) {
                await deleteDoc(doc(db, "cuenta", id));
                await this.fetchCuentas();
            },

            cancel() {
                this.dialog = false;
                this.resetForm();
            },

        },
    };
    </script>
    <style></style>