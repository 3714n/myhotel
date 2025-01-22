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
                            <v-col cols="4" offset="0">
                                <v-sheet class="pa-2 ma-2">
                                    <h2>
                                        Numero de identidad: {{ NuemeroIdentidad }}, Nombre:  {{ nombreCliente }},  Apellido: {{ ApellidoCliente }}
                                    </h2>
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
</template>
<script>
export default {
    
}
</script>
<style lang="">
    
</style>