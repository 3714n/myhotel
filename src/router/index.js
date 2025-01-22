import { createRouter, createWebHistory } from 'vue-router'
import MyDasboard from '../views/MyDasboard.vue'
import ViewHabitacion from '../views/ViewHabitacion.vue'
import MyDisponibilidad from '../views/MyDisponibilidad.vue'
import ViewReserva from '../views/ViewReserva.vue'
import ViewClientes from '@/views/ViewClientes.vue'
import ViewCuenta from '@/views/ViewCuenta.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: MyDasboard
  },
  {
    path: '/habitaciones',
    name: 'Habitaciones',
    component: ViewHabitacion
  },
  {
    path: '/reserva',
    name: 'Reserva',
    component: ViewReserva
  },  
  {
    path: '/disponibilidad',
    name: 'Disponibilidad',
    component: MyDisponibilidad
  },
  {
    path: '/disponibilidad',
    name: 'Disponibilidad',
    component: MyDisponibilidad
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: ViewClientes
  },
  {
    path: '/cuentas',
    name: 'Cuentas',
    component: ViewCuenta
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
