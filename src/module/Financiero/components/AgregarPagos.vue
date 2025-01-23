<template>
    <v-card>
        <v-container>
            <v-row>
                <v-col cols="3">
                    <v-card-title>
                        Nuevo Pago
                    </v-card-title>
                </v-col>
            </v-row>

            <v-row>
                <v-card-text>
                    <v-form>
                        <v-row>
                            <v-col cols="12" offset="0">
                                <v-sheet class="pa-2 ma-2">
                                    <h2>
                                        Numero de identidad: {{ cliente_form.nuemero_Identidad }}, Nombre: {{
                                        cliente_form.nombre_Cliente }}, Apellido: {{ cliente_form.apellido_Cliente }}
                                    </h2>
                                </v-sheet>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="3">

                                <v-text-field v-model="PagosForm.fechaPago" label="Fecha" outlined
                                    readonly></v-text-field>

                            </v-col>

                            <v-col cols="3">

                                <v-text-field v-model="PagosForm.Metodo_Pago" label="Metodo del pago_tabla" outlined
                                    readonly></v-text-field>

                            </v-col>

                            <v-col cols="3">

                                <v-text-field v-model="PagosForm.valorPago" label="Valor" outlined></v-text-field>

                            </v-col>
                            <v-col cols="3">

                                <v-text-field v-model="PagosForm.numero_Factura" label="Numero_Factura"
                                    outlined></v-text-field>

                            </v-col>
                        </v-row>

                    </v-form>
                </v-card-text>
            </v-row>
            <v-row>
                <v-col>
                    <v-table height="1000px" fixed-header>
                        <thead>
                            <tr>
                                <th class="text-center">Fecha</th>
                                <th class="text-center">Numero de factura</th>
                                <th class="text-center">Valor</th>
                                <th class="text-center">Metodo de pago_tabla</th>
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
                                    <v-btn text="Cancelar" @click="cancel"></v-btn>
                                    <v-btn color="primary" @click="Agregar_Pago">Guardar</v-btn>
                                </td>
                            </tr>

                        </tbody>
                    </v-table>
                </v-col>
            </v-row>

            <p><strong>total de pagoes: ${{ PagosForm.total_Pagado }}</strong></p>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Cancelar" @click="cancel"></v-btn>
            </v-card-actions>
        </v-container>
    </v-card>
</template>

<script>
import { db } from "@/FireBaseConfig";
import { addDoc, collection, getDocs } from 'firebase/firestore';

export default {
    props:{
        nuemero_Identidad_Props:{
            
        },
    },
    data() {
        return {
            pagos: [],
            PagosForm: {
                fechaPago: "",
                Metodo_Pago: "",
                valorPago: 0,
                numero_Factura: "",
                total_Pagado: 0,
                nuemero_Identidad: "",
                cliente_Guardado: [],
            },
            clientesBase: [],
            cliente_form: {
                nuemero_Identidad: "",
                nombre_Cliente: "",
                apellido_Cliente: ""
            }
        };
    },

    async created() {
        await this.FecthPago();
    },
    methods: {
        async FecthPago() {
            try {
                const Querysnapshot = await getDocs(collection(db, "Cliente"));
                const snapshot = await getDocs(collection(db, "pagos"));
                this.pagos = snapshot.docs.map((doc) => ({
                    id: doc.id, ...doc.data()
                }));
                this.clientesBase = Querysnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

            } catch (error) {
                console.error("Error al cargar pagos:", error);

            }
        },
        async Agregar_Pago() {
            if (this.PagosForm.valorPago <= 0) {
                alert('agregar valor del pago');
                return;
            }
            try {
                const nuevo_Pago = {
                    nuemero_Identidad: this.PagosForm.nuemero_Identidad,
                    pagos: this.PagosForm,

                };
                await addDoc(collection(db, "pagos"), nuevo_Pago);
                alert("Pago guardado exitosamente")
                this.FecthPago();
            } catch (error) {
                alert("Error al guardar el pago:", error);

            }
        },

        Calcular_Pago_Totales() {
            this.total_Pagado = this.pagos.valor.reduce((acc, pagos) => acc + pagos.valorPago, 0);

        },
        Buscar_Cliente() {
            const cliente_Encontrado = this.clientesBase.find(
                (clientes) => clientes.n_i === this.nuemero_Identidad_Props
            );
            if (cliente_Encontrado) {
                this.cliente_form = {
                    nuemero_Identidad: cliente_Encontrado.n_i,
                    nombre_Cliente: cliente_Encontrado.name,
                    apellido_Cliente: cliente_Encontrado.apellido,

                };
                this.nuevo_Pago.cliente_Guardado.push(cliente_Encontrado);
            }
        },
        cancel() {
            this.$emit("cerrar-dialogo");
        },
    }


}
</script>
<style lang="">

</style>