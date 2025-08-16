import api from './api';

export const getRoles = async () => {
    const response = await api.get('admin/roles');
    return response.data
}

export const getSucursales = async () => {
    const response = await api.get('admin/sucursales');
    return response.data
}

export const registerUser = async (nombre, usuario, password, rol_id, sucursal_id, estado) => {
    const response = await api.post('admin/register', {nombre, usuario, password, rol_id, sucursal_id, estado });
    return response.data
}

export const getUsuarios = async () => {
    const response = await api.get('admin/usuarios');
    return response.data
}

export const updateUsuario = async (id, datos) => {
    const response = await api.put(`admin/usuarios/${id}`, datos);
    return response.data;
}

export const deactivateUsuario = async (id) => {
    const response = await api.patch(`admin/usuarios/${id}/desactivar`);
    return response.data
}

export const activateUsuario = async (id) => {
    const response = await api.patch(`admin/usuarios/${id}/activar`);
    return response.data
}

export const getVentasSucursal = async ({ fecha_inicio, fecha_fin, sucursal_id }) => {
    const query = new URLSearchParams({
        ...(fecha_inicio && { fecha_inicio }),
        ...(fecha_fin && { fecha_fin }),
        ...(sucursal_id && { sucursal_id }),
    }).toString();

    const response = await api.get(`admin/ventas-sucursal${query ? `?${query}` : ""}`);
    return response.data;
};