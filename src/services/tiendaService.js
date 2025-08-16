import api from './api';

export const getZapatoIndex = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await api.get(`tienda/getZapato${query ? `?${query}` : ""}`);
    return response.data;
}

export const getEmpBodega = async () => {
    const response = await api.get('tienda/getEmpBodega');
    return response.data;
}

export const registrarVentas = async (ventas) => {
    const response = await api.post('tienda/registrarVentas', ventas);
    return response.data
}

export const ventasUsuarioDia = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await api.get(`tienda/ventas-usuario-dia${query ? `?${query}` : ""}`);
    return response.data;
}

export const corteCaja = async (corte) => {
    const response = await api.post('tienda/corte-caja', corte);
    return response.data
}

export const obtenerCorteCaja = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await api.get(`tienda/obtener-corte-caja${query ? `?${query}` : ""}`);
    return response.data;
}

export const registrarApartado = async (apartado) => {
    const response = await api.post('tienda/registrar-apartado', apartado);
    return response.data;
}

export const listarApartados = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await api.get(`tienda/listar-apartados${query ? `?${query}` : ""}`);
    return response.data;
}

export const completarApartado = async (id, data) => {
    try {
        const response = await api.post(`tienda/apartado/${id}/completar`, data);
        return response.data;
    } catch (error) {
        console.error("Error completando apartado:", error);
        throw error;
    }
};

export const cancelarApartado = async (id) => {
    try {
        const response = await api.post(`tienda/apartado/${id}/cancelar`);
        return response.data;
    } catch (error) {
        console.error("Error al cancelar el apartado", error)
        throw error;
    }
}
