import { getRoles, getSucursales, updateUsuario } from "../services/adminService";
import { useEffect, useState } from "react";
import { notification } from "antd";

export default function ModalUsuario({ usuario, onClose }) {

    const [roles, setRoles] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [loadingSucursales, setLoadingSucursales] = useState(true);

    const [formData, setFormData] = useState({
        nombre: usuario.nombre,
        usuario: usuario.usuario,
        rol_id: usuario.rol_id,
        sucursal_id: usuario.sucursal_id,
        estado: usuario.estado
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rolesData = await getRoles();
                setRoles(rolesData);
                setLoadingRoles(false);

                const sucursalesData = await getSucursales();
                setSucursales(sucursalesData);
                setLoadingSucursales(false);
            } catch (error) {
                notification.error({
                    message: 'Error',
                    description: 'No se pudieron cargar roles o sucursales.',
                });
                setLoadingRoles(false);
                setLoadingSucursales(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            await updateUsuario(usuario.id, formData);
            notification.success({
                message: 'Usuario actualizado',
                description: `El usuario ${formData.usuario} fue actualizado correctamente.`,
            });
            onClose(); // cerrar modal
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Error',
                description: 'No se pudo actualizar el usuario.'
            });
        }
    };

    return (
        <>
            <input type="checkbox" id="modal-editar-usuario" className="modal-toggle" checked={true} readOnly />
            <div className="modal modal-open">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Editar usuario: {usuario.nombre}</h3>

                    <div className="flex flex-col gap-2">
                        <label className="label font-semibold">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            className="input input-bordered"
                            value={formData.nombre}
                            onChange={handleChange}
                        />

                        <label className="label font-semibold">Usuario</label>
                        <input
                            type="text"
                            name="usuario"
                            className="input input-bordered"
                            value={formData.usuario}
                            onChange={handleChange}
                        />

                        <label className="font-bold">Rol</label>
                        <select
                            name="rol_id"
                            className="input input-bordered w-full"
                            value={formData.rol_id}
                            onChange={handleChange}
                            required
                            disabled={loadingRoles}
                        >
                            {loadingRoles ? (
                                <option value="">Cargando roles...</option>
                            ) : (
                                <>
                                    <option value="">Seleccione un rol</option>
                                    {roles.map((rol) => (
                                        <option key={rol.id} value={rol.id}>
                                            {rol.nombre}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>

                        <label className="font-bold">Sucursal</label>
                        <select
                            name="sucursal_id"
                            className="input input-bordered w-full"
                            value={formData.sucursal_id}
                            onChange={handleChange}
                            required
                            disabled={loadingSucursales}
                        >
                            {loadingSucursales ? (
                                <option value="">Cargando sucursales...</option>
                            ) : (
                                <>
                                    <option value="">Seleccione una sucursal</option>
                                    {sucursales.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nombre}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>

                    <div className="modal-action">
                        <button
                            className="btn bg-[#9F2241] hover:bg-[#7d1b34] text-white"
                            onClick={handleUpdate}
                        >
                            Guardar cambios
                        </button>
                        <label
                            htmlFor="modal-editar-usuario"
                            className="btn"
                            onClick={onClose}
                        >
                            Cancelar
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
}
