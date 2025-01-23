<template>
    <v-card>
        <v-container>
            <v-row>
                <v-col cols="3">
                    <v-card-title>
                        Nueva cuenta
                    </v-card-title>
                </v-col>
            </v-row>

            <v-row>
                <v-card-text>
                    <v-form>
                        <v-row>
                            <v-col cols="4" offset="0">
                                <v-sheet class="pa-2 ma-2">
                                    <v-text-field v-model="clienteForm.n_i" label="Numero de Identidad" outlined clearable
                                        @change="buscarCliente"></v-text-field>
                                </v-sheet>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="4">

                                <v-text-field v-model="clienteForm.name" label="name" outlined readonly></v-text-field>

                            </v-col>

                            <v-col cols="4">

                                <v-text-field v-model="clienteForm.apellido" label="Apellido" outlined
                                    readonly></v-text-field>

                            </v-col>

                            <v-col cols="4">

                                <v-text-field v-model="cuentaForm.Fecha_Apertura" label="Fecha de apertura"
                                    outlined></v-text-field>

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
                                <th class="text-center">Habitaciones</th>
                                <th class="text-center">tariafa</th>
                                <th class="text-center">Cantidad</th>
                                <th class="text-center">Acciones</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="habitaciones in habitacion" :key="habitaciones.id">
                                <td class="text-center">{{ habitaciones.nameHabitacion }}</td>
                                <td class="text-center">{{ habitaciones.precio }}</td>
                                <td class="text-center">
                                    <input type="number" v-model="habitaciones.Cantidad" min="0"
                                 placeholder="Personas"/>
                                </td>
                                <td>
                                    <v-btn color="primary" @click="agregaProducto(habitaciones)"
                                        :disabled="isHabitaciones(habitaciones)">agregar</v-btn>
                                </td>

                            </tr>
                        </tbody>

                    </v-table>

                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-card-title>
                        Habitaciones Seleccionada
                    </v-card-title>
                </v-col>
                <v-col>
                    <ul>
                        <li v-for="(item, index) in nuevaOrden.habitaciones" :key="index">
                            {{ item.nameHabitacion }}- cantidad: {{ item.Cantidad }} - Total: ${{ item.total }}
                            <v-btn color="red" @click="remover(index)">Remover</v-btn>
                        </li>
                    </ul>
                </v-col>
            </v-row>
            <p><strong>total de habitacioneses: ${{ nuevaOrden.total }}</strong></p>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Cancelar" @click="cancel"></v-btn>
                <v-btn color="primary" @click="GuardarCuenta">Guardar</v-btn>
            </v-card-actions>
        </v-container>
    </v-card>
</template>
  
  <script>
import { db } from "@/FireBaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default {
    data() {
        return {
            nuevaOrden:{
                ordenHabitaciones:"",
                total: 0,
                CantidadPersonas:0,
                habitaciones: [],
                cliente:[],
                TotalesGeneral: [],
            },
            habitacion:[],
            
            clienteForm: {
                n_i: "",
                name: "",
                apellido: "",
                
            },
            cuentaForm: {
                Fecha_Apertura: "",
                
                
            },
            clientes: [], // Lista de clientes cargada desde Firestore
        };
    },
    async created() {
        await this.fetchClientes();
    },
    methods: {
        async fetchClientes() {
            // Obtener la colección "clientes" desde Firestore
            try {
                const snapshot = await getDocs(collection(db, "Cliente"));
                const QuerySnapshot = await getDocs(collection(db, "habitacion"))
                this.clientes = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                this.habitacion = QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), Cantidad: 0, }))

            } catch (error) {
                console.error("Error al cargar clientes:", error);
            }
        },
        agregaProducto(habitacion){
            if(habitacion.Cantidad <= 0){
                alert('agregar valor persona a la habitaciones');
                return;
            }
            const habitacionesTotal = habitacion.precio * habitacion.Cantidad;
            
            const habitacionesToAgregar = {
                ...habitacion,
                total: habitacionesTotal,
                CantidadPersonas: habitacion.Cantidad
                   
            };
            this.nuevaOrden.habitaciones.push(habitacionesToAgregar);
            this.recalcular();
        },
                
        
        recalcular(){
            
            this.nuevaOrden.total = this.nuevaOrden.habitaciones.reduce((acc, habitaciones) => acc + habitaciones.total, 0);
            this.nuevaOrden.CantidadPersonas = this.nuevaOrden.habitaciones.reduce((acc, habitaciones) => acc + habitaciones.CantidadPersonas, 0);
            
        },
        isHabitaciones(habitaciones){
            return this.nuevaOrden.habitaciones.some(item => item.id === habitaciones.id);

        },
        remover(index){
            this.nuevaOrden.habitaciones.splice(index, 1);
            this.recalcular();
        },
        async GuardarCuenta() {
            try {
                const Totales = {
                    total: this.nuevaOrden.total,
                    cantidadPersonas: this.nuevaOrden.CantidadPersonas
                };

                this.nuevaOrden.TotalesGeneral.push(Totales);
                
                const nuevaCuenta = {
                    fecha: this.cuentaForm.Fecha_Apertura,
                    habitaciones: this.nuevaOrden.habitaciones,
                    clientes: this.nuevaOrden.cliente,
                    TotalesGeneral: this.nuevaOrden.TotalesGeneral,        
                 };
                await addDoc(collection(db, "cuentas"), nuevaCuenta);
                alert("Cuenta guardada exitosamente");               
                this.cancel();
            } catch (error) {
                console.error("Error al guardar la cuenta:", error);
            }

        },

        buscarCliente() {
            // Buscar el cliente por número de identidad
            const clienteEncontrado = this.clientes.find(
                (Cliente) => Cliente.n_i === this.clienteForm.n_i
            );
            if (clienteEncontrado) {
                this.clienteForm = {
                    name: clienteEncontrado.name,
                    apellido: clienteEncontrado.apellido,
                    n_i: clienteEncontrado.n_i,
                
                };
                this.nuevaOrden.cliente.push(clienteEncontrado);
                
            } else {
                this.$emit("alert", "Cliente no encontrado");
                this.clienteForm = {n_i:"", name: "", apellido: "" };
            }
           
        },
  
      cancel() {
        this.$emit("cerrar-dialogo");
      },
    },
  };
  </script>
  
  <style scoped>
  /* Aquí puedes agregar tus estilos personalizados */
  </style>
  