<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Reserva</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-table height="300px" fixed-header>
          <thead>
            <tr>
              <th class="text-center">Fecha Entrada</th>
              <th class="text-center">Fecha Salida</th>
              <th class="text-center">Cliente</th>
              <th class="text-center">Hora Entrada</th>
              <th class="text-center">Hora Salida</th>
              <th class="text-center">Tarifa</th>
              <th class="text-center">Pagado</th>
              <th class="text-center">Comentario</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="Reserva in Reservas" :key="Reserva.id">
              <td class="text-center">{{ Reserva.Fecha_Entrada }}</td>
              <td class="text-center">{{ Reserva.Fecha_Salida }}</td>
              <td class="text-center">{{ Reserva.Cliente }}</td>
              <td class="text-center">{{ Reserva.Hora_Entrada }}</td>
              <td class="text-center">{{ Reserva.Hora_Salida }}</td>
              <td class="text-center">{{ Reserva.Tarifa }}</td>
              <td class="text-center">{{ Reserva.Pagado }}</td>
              <td class="text-center">{{ Reserva.descripcion }}</td>
              <td>
                <v-btn class="text-none" color="primary" small @click="editReserva(Reserva.id)">
                  Editar
                </v-btn>
                <v-btn class="text-none" color="red" @click="deleteReserva(Reserva.id)">
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
        <v-btn color="primary" @click="showAddReservaDialog()">
          Nueva reserva
        </v-btn>
      </v-col>
    </v-row>

    <!-- Diálogo para agregar/editar habitación -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          {{ selectedReserva ? "Editar Reserva" : "Nueva Reserva" }}
        </v-card-title>
        <v-card-text>
          <!-- Formulario para crear/Editar la reserva -->
          <v-form>
            <v-text-field 
            v-model="ReservasForm.Fecha_Entrada" 
            label="Fecha Entrada" 
            requiered>
            </v-text-field>
            <v-text-field 
            v-model="ReservasForm.Fecha_Salida" 
            label="Fecha Salida" 
            requiered>
            </v-text-field>
            <v-text-field 
            v-model="ReservasForm.Cliente" label="Cliente" requiered>
            </v-text-field>
            <v-text-field v-model="ReservasForm.Hora_Entrada" label="Hora Entrada" requiered>
            </v-text-field>
            <v-text-field v-model="ReservasForm.Hora_Salida" label="Hora Salida" requiered>
            </v-text-field>
            <v-text-field v-model="ReservasForm.Tarifa" label="Tarifa" requiered>
            </v-text-field>
            <v-text-field v-model="ReservasForm.Pagado" label="Pagado" requiered>
            </v-text-field>
            <v-text-field v-model="ReservasForm.descripcion" label="Descrición" requiered>
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn Color="primary" @click="submitReserva">
            Guardar
          </v-btn>
          <v-btn text="Cancelar" @click="cancel"></v-btn>
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
        Reservas: [],
        selectedReserva: null,
        ReservasForm: {
          Fecha_Entrada: "",
          Fecha_Salida: "",
          Cliente: "",
          Hora_Entrada: "",
          Hora_Salida: "",
          Tarifa: 0,
          Pagado: 0,
          descripcion: "",
        },
      };
    },
    async created() {
      await this.fetchReserva();
    },
    methods: {
      async fetchReserva() {
        const querySnapshot = await getDocs(collection(db, "Reserva"));
        this.Reservas = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => a.Fecha_Entrada.localeCompare(b.Fecha_Entrada));
      },
      showAddReservaDialog() {
        this.ResetForm();
        this.dialog = true;
      },
      editReserva(id) {
        const Reserva = this.Reservas.find((h) => h.id === id);
        this.ReservasForm = { ...Reserva };
        this.selectedReserva = id;
        this.dialog = true;
      },
      async deleteReserva(id) {
        await deleteDoc(doc(db, "Reserva", id));
        await this.fetchReserva();
      },
      async submitReserva() {
        if (this.selectedReserva) {
          await updateDoc(doc(db, "Reserva", this.selectedReserva), this.ReservasForm);
        } else {
          await addDoc(collection(db, "Reserva"), this.ReservasForm);
        }
        this.cancel();
        await this.fetchReserva();
      },
      cancel() {
        this.dialog = false;
        this.ResetForm();
      },
      ResetForm() {
        this.selectedReserva = null;
        this.ReservasForm = {
          Fecha_Entrada: "",
          Fecha_Salida: "",
          Cliente: "",
          Hora_Entrada: "",
          Hora_Salida: "",
          Tarifa: 0,
          Pagado: 0,
          descripcion: "",
          };
        },
      },
    };
    </script>
  
