<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1>Clientes</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-table height="300px" fixed-header>
                    <thead>
                        <tr>
                            <th class="text-center">Nombre</th>
                            <th class="text-center">Apellido</th>
                            <th class="text-center">T.I.</th>
                            <th class="text-center">N.I.</th>
                            <th class="text-center">Telefono</th>
                            <th class="text-center">Correo</th>
                            <th class="text-center">Nacionalidad</th>
                            <th class="text-center">Procedencia</th>
                            <th class="text-center">Profeción</th>
                            <th class="text-center">Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="Cliente in Clientes" :key="Cliente.id">
                            <td class="text-center">{{ Cliente.name }}</td>
                            <td class="text-center">{{ Cliente.apelllido }}</td>
                            <td class="text-center">{{ Cliente.t_i }}</td>
                            <td class="text-center">{{ Cliente.n_i }}</td>
                            <td class="text-center">{{ Cliente.telefono }}</td>
                            <td class="text-center">{{ Cliente.correo }}</td>
                            <td class="text-center">{{ Cliente.nacionalidad }}</td>
                            <td class="text-center">{{ Cliente.procedencia }}</td>
                            <td class="text-center">{{ Cliente.profecion }}</td>
                            <td>
                                <v-btn class="text-none" color="primary" small @click="editCliente(Cliente.id)">
                                    Editar
                                </v-btn>
                                <v-btn class="text-none" color="red" @click="deleteCliente(Cliente.id)">
                                    Eliminar
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-btn color="primary" @click="showAddClienteDialog()">
                    Nuevo Cliente
                </v-btn>
            </v-col>
        </v-row>

        <!-- Diálogo para agregar/editar habitación -->
        <v-dialog v-model="dialog" max-width="500">
            <v-card>
                <v-card-title>
                    {{ selectedReserva ? "Editar Cliente" : "Nuevo Cliente" }}
                </v-card-title>
                <v-card-text>
                    <!-- Formulario para crear/Editar la reserva -->
                    <v-form>
                        <v-text-field v-model="ClienteForm.name" label="Nombre" requiered>
                        </v-text-field>
                        <v-text-field v-model="ClienteForm.apellido" label="Apellido" requiered>
                        </v-text-field>
                        <v-text-field v-model="ClienteForm.t_i" label="Tipo Identidad" requiered>
                        </v-text-field>
                        <v-text-field v-model="ClienteForm.n_i" label="Numero Identidad" requiered>
                        </v-text-field>
                        <v-text-field v-model="ClienteForm.telefono" label="Telefono" requiered>
                        </v-text-field>
                        <v-text-field v-model="ClienteForm.correo" label="Correo" requiered>
                        </v-text-field>
                        <v-text-field v-model="ClienteForm.nacionalidad" label="Nacionalidad" requiered>
                        </v-text-field>
                        <v-text-field v-model="ClienteForm.procedencia" label="Procedencia" requiered>
                        </v-text-field>
                        <v-text-field v-model="ClienteForm.profecion" label="Profesion" requiered>
                        </v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn Color="primary" @click="submitCliente">
                        Guardar
                    </v-btn>
                    <v-btn text="Cancelar" @click="cancel">
                    </v-btn>
                </v-card-actions>

            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { db } from "@/FireBaseConfig";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default {
    data() {
        return {
            dialog: false,
            Clientes: [],
            selectedCliente: null,
            ClienteForm: {
                name: "",
                apellido: "",
                t_i: "",
                n_i: "",
                telefono: "",
                correo: "",
                nacionalidad: "",
                procedencia: "",
                profecion: "",

            },
        };
    },
    async created() {
        await this.fetchClientes();
    },
    methods: {
        async fetchClientes() {
            const querySnapshot = await getDocs(collection(db, "Cliente"));
            this.Clientes = querySnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => a.name.localeCompare(b.name));
        },
        showAddClienteDialog() {
        this.ResetForm();
        this.dialog = true;
        },
        editCliente(id) {
            const Cliente = this.Clientes.find((h) => h.id === id);
            this.ClienteForm = { ...Cliente };
            this.selectedCliente = id;
            this.dialog = true;
        },
        async deleteCliente(id) {
            await deleteDoc(doc(db, "Cliente", id));
            await this.fetchClientes();
        },
        async submitCliente() {
            if (this.selectedCliente) {
                await updateDoc(doc(db, "Cliente", this.selectedCliente), this.ClienteForm);
            } else {
                await addDoc(collection(db, "Cliente"), this.ClienteForm);
            }
            this.cancel();
            await this.fetchClientes();
        },
        cancel() {
        this.dialog = false;
        this.ResetForm();
        },
        ResetForm() {
            this.selectedCliente = null;
            this.ClienteForm = {
                name: "",
                apellido: "",
                t_i: "",
                n_i: "",
                telefono: "",
                correo: "",
                nacionalidad: "",
                procedencia: "",
                profecion: "",
            };
        },
    },
};
</script>
  
