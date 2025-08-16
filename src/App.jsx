import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegistrarUsuario from './admin/RegistrarUsuario';
import VerUsuario from './admin/VerUsuario';
import RegistrarZapato from './bodega/RegistrarZapato';
import RegistrarInventario from './bodega/RegistrarInventario';
import VerInventario from './bodega/VerInventario';
import RegistrarVenta from './tienda/RegistrarVenta';
import VerVentas from './tienda/VerVentas';
import VerCorte from './tienda/VerCorte';
import RegistrarApartado from './tienda/RegistrarApartado';
import VerApartados from './tienda/VerApartados';
import VerPuntos from './bodega/VerPuntos';
import VerVentasAdmin from './admin/VerVentasAdmin';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Login />} />
      {/* Rutas anidadas de dashboard */}
      <Route path='/dashboard' element={<Dashboard />}>
        {/**Rutas para Admin */}
        <Route path='usuarios/registrar' element={<RegistrarUsuario />} />
        <Route path='usuarios/ver' element={<VerUsuario />} />
        <Route path='admin/ver-ventas' element={<VerVentasAdmin />} />
        <Route path='admin/ver-inventario' element={<VerInventario />} />
        {/**Fin de rutas para Admin */}

        {/**Rutas para Empleado de Bodega */}
        <Route path='bodega/registar-zapatos' element={<RegistrarZapato />} />
        <Route path='bodega/registrar-inventario' element={<RegistrarInventario />} />
        <Route path='bodega/ver-inventario' element={<VerInventario />} />
        <Route path='bodega/ver-puntos' element={<VerPuntos/>} />
        {/**Fin de rutas para Empleado de Bodega */}

        {/**Rutas para Empleado de Tienda */}
        <Route path='tienda/registar-venta' element={<RegistrarVenta />} />;
        <Route path='tienda/ver-ventas' element={<VerVentas />} />;
        <Route path='tienda/ver-corte' element={<VerCorte/>}/>
        <Route path='tienda/registrar-apartado' element={<RegistrarApartado/>}/>
        <Route path='tienda/ver-apartados' element={<VerApartados/>}/>
        {/**Fin de rutas para Empleado de Tienda */}

      </Route>
    </Routes>
  )
}

export default App
