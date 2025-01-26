<template>
    <v-card>
        <v-container>
            <v-row>
                <v-col cols="3">
                    <v-card-title>Nuevo Pago</v-card-title>
                </v-col>
            </v-row>

            <v-row>
                <v-card-text>
                    <v-form>
                        <v-row>
                            <v-col cols="12" offset="0">
                                <v-sheet class="pa-2 ma-2">
                                    <h2>
                                        Número de identidad: {{ clienteFormHijo.n_i }}, Nombre: {{ clienteFormHijo.name }}, Apellido: {{ clienteFormHijo.apellido }}
                                    </h2>
                                </v-sheet>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="3">
                                <v-text-field
                                    v-model="PagosForm.fechaPago"
                                    label="Fecha"
                                    outlined
                                    
                                ></v-text-field>
                            </v-col>

                            <v-col cols="3">
                                <v-text-field
                                    v-model="PagosForm.Metodo_Pago"
                                    label="Método de Pago"
                                    outlined
                                ></v-text-field>
                            </v-col>

                            <v-col cols="3">
                                <v-text-field
                                    v-model="PagosForm.valorPago"
                                    label="Valor"
                                    outlined
                                ></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field
                                    v-model="PagosForm.numero_Factura"
                                    label="Número de Factura"
                                    outlined
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-row>

            <v-row>
                <v-col>
                    <v-table height="300px" fixed-header>
                        <thead>
                            <tr>
                                <th class="text-center">Fecha</th>
                                <th class="text-center">Número de Factura</th>
                                <th class="text-center">Valor</th>
                                <th class="text-center">Método de Pago</th>
                                <th class="text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="pago_tabla in pagos" :key="pago_tabla.id">
                                <td class="text-center">{{ pago_tabla.fechaPago }}</td>
                                <td class="text-center">{{ pago_tabla.numero_Factura }}</td>
                                <td class="text-center">{{ pago_tabla.valorPago }}</td>
                                <td class="text-center">{{ pago_tabla.Metodo_Pago }}</td>
                                <td>
                                    <v-btn text @click="cancel">Cancelar</v-btn>
                                    
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-col>
            </v-row>
            <v-row>
                <v-col >
                    <p><strong>Total de pagos: ${{ totalPagado }}</strong></p>
                </v-col>
                <v-col >
                    <p><strong>Total de Deuda: ${{ totalDeuda }}</strong></p>
                </v-col>
                <v-col >
                    <p><strong>Diferencia: ${{ diferencia }}</strong></p>
                </v-col>
            </v-row>
           
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="cancel">Cancelar</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="Agregar_Pago">Guardar</v-btn>
            </v-card-actions>
        </v-container>
    </v-card>
</template>

<script>
import { db } from "@/FireBaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";

export default {
    props: {
        clienteFormHijo: {
                type: Object,
                required: true,
                default: () => ({}),
        },
    },
    data() {
        return {
            pagos: [],
            servicio_Totales: [],
            totalDeuda:0,
            diferencia:0,
            totalPagado: 0,
            PagosForm: {
                fechaPago: "",
                Metodo_Pago: "",
                valorPago: 0,
                numero_Factura: "",
                numero_Identidad: "",
            },
            clientesBase: [],
            cliente_form: {
                numero_Identidad: "",
                nombre_Cliente: "",
                apellido_Cliente: "",
            },
        };
    },

    async created() {
        // Buscamos el cliente automáticamente al cargar el componente
        await this.FetchPago();
    },

    methods: {
        async FetchPago() {
            try {
                const snapshot = await getDocs(collection(db, "pagos"));
                this.pagos = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const snapshotServicio = await getDocs(collection(db, "cuentas"));
                this.servicio_Totales = snapshotServicio.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                this.Calcular_Pago_Totales();
                console.log(this.servicio_Totales);
            } catch (error) {
                console.error("Error al cargar pagos:", error);
            }
        },

        async Agregar_Pago() {
            if (this.PagosForm.valorPago <= 0) {
                alert("Por favor, agrega un valor válido al pago.");
                return;
            }
            try {
                const nuevo_Pago = {
                    numero_Identidad: this.nuemero_Identidad_Props,
                    ...this.PagosForm,
                    totalDeuda: this.totalDeuda,
                    totalPagado: this.totalPagado0,
                    diferencia:this.diferencia,
                };
                await addDoc(collection(db, "pagos"), nuevo_Pago);
                alert("Pago guardado exitosamente.");
                await this.FetchPago();
            } catch (error) {
                alert("Error al guardar el pago:", error);
            }
        },

        Calcular_Pago_Totales() {

            const PagosAgregados = this.pagos.reduce((acc, pago) => acc + Number(pago.valorPago), 0);
            const TotalServicio = Number(this.servicio_Totales.reduce(
                (acc, servicio) => acc + servicio.TotalesGeneral[0]?.total || 0,
                0
            ));
            this.totalPagado = PagosAgregados;
            this.totalDeuda = TotalServicio;
            this.diferencia = Number(TotalServicio - PagosAgregados);
            console.log("Valor del pago: " + PagosAgregados);
            console.log("Valor del servicio: " + TotalServicio);

        },

        
        cancel() {
            this.$emit("cerrar-dialogo");
        },
    },
};
</script>

<style lang="">

</style>