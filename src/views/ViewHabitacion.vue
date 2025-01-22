<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Habitaciones</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-table height="300px" fixed-header>
          <thead>
            <tr>
              <th class="text-center">Nombre</th>
              <th class="text-center">Precio</th>
              <th class="text-center">Descripción</th>
              <th class="text-center">Estado</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="habitacion in habitaciones" :key="habitacion.id">
              <td class="text-center">{{ habitacion.nameHabitacion }}</td>
              <td class="text-center">{{ habitacion.precio }}</td>
              <td class="text-center">{{ habitacion.descripcion }}</td>
              <td class="text-center">{{ habitacion.estado }}</td>
              <td>
                <v-btn
                  class="text-none"
                  color="primary"
                  small
                  @click="editHabitacion(habitacion.id)"
                >
                  Editar
                </v-btn>
                <v-btn
                  class="text-none"
                  color="red"
                  small
                  @click="deleteHabitacion(habitacion.id)"
                >
                  Eliminar
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click="showAddHabitacionDialog()">Nueva Habitación</v-btn>
      </v-col>
    </v-row>

    <!-- Diálogo para agregar/editar habitación -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          {{ selectedHabitacion ? "Editar Habitación" : "Nueva Habitación" }}
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="habitacionForm.nameHabitacion"
              label="Nombre"
              required
            ></v-text-field>
            <v-text-field
              v-model="habitacionForm.precio"
              label="Precio"
              type="number"
              required
            ></v-text-field>
            <v-textarea
              v-model="habitacionForm.descripcion"
              label="Descripción"
              required
            ></v-textarea>
            <v-text-field
              v-model="habitacionForm.estado"
              label="Estado"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Cancelar" @click="cancel"></v-btn>
          <v-btn color="primary" @click="submitHabitacion">Guardar</v-btn>
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
      habitaciones: [],
      dialog: false,
      selectedHabitacion: null,
      habitacionForm: {
        nameHabitacion: "",
        precio: 0,
        descripcion: "",
        estado: "",
      },
    };
  },
  async created() {
    await this.fetchHabitaciones();
  },
  methods: {
    async fetchHabitaciones() {
      const querySnapshot = await getDocs(collection(db, "habitacion"));
      this.habitaciones = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.nameHabitacion.localeCompare(b.nameHabitacion));
    },
    showAddHabitacionDialog() {
      this.resetForm();
      this.dialog = true;
    },
    editHabitacion(id) {
      const habitacion = this.habitaciones.find((h) => h.id === id);
      this.habitacionForm = { ...habitacion };
      this.selectedHabitacion = id;
      this.dialog = true;
    },
    async deleteHabitacion(id) {
      await deleteDoc(doc(db, "habitacion", id));
      await this.fetchHabitaciones();
    },
    
    async submitHabitacion() {
      if (this.selectedHabitacion) {
        // actualizar habitación existente
        await updateDoc(doc(db, "habitacion", this.selectedHabitacion), this.habitacionForm);
      } else {
        // Creando habitacion nueva
        await addDoc(collection(db, "habitacion"), this.habitacionForm);
      }
      this.cancel();
      await this.fetchHabitaciones();
    },
    cancel() {
      this.dialog = false;
      this.resetForm();
    },
    resetForm() {
      this.selectedHabitacion = null;
      this.habitacionForm = {
        nameHabitacion: "",
        precio: 0,
        descripcion: "",
        estado: "",
      };
    },
  },
};
</script>
