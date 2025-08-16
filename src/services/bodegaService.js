import api from './api';

export const postZapatos = async (zapatos) => {
    const response = await api.post('bodega/registerZapatos', zapatos);
    return response.data;
};

export const getZapatoIndex = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await api.get(`bodega/indexInventario${query ? `?${query}` : ""}`);
    return response.data;
};

export const storeInventario = async (inventarios) => {
    const response = await api.post('bodega/storeInventario', inventarios);
    return response.data;
};

export const getInventarioSucursal = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await api.get(`bodega/inventario-sucursal${query ? `?${query}` : ""}`);
    return response.data;
}

export const exhibirCalzado = async (datos) => {
    const respoonse = await api.post('bodega/trasladar-calzado', datos);
    return respoonse.data;
}

export const getZapatoID = async (id) => {
    const response = await api.get(`bodega/zapatos/${id}`);
    return response.data;
}

export const editarInventario = async (id, unidades) => {
    const response = await api.put(`bodega/editar-inventario/${id}`, {
        unidades_disponibles: unidades
    });
    return response.data;
};


export const getEmpBodega = async () => {
    const response = await api.get('bodega/getEmpBodega');
    return response.data;
}

export const getPuntoBodega = async ({ fecha_inicio, fecha_fin, usuario_id }) => {
    const query = new URLSearchParams({
        ...(fecha_inicio && { fecha_inicio }),
        ...(fecha_fin && { fecha_fin }),
        ...(usuario_id && { usuario_id }),
    }).toString();

    const response = await api.get(`bodega/puntos-empleado${query ? `?${query}` : ""}`);
    return response.data;
};
