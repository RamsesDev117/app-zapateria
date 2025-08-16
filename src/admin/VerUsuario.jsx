import { useEffect, useState } from "react";
import { getUsuarios, activateUsuario, deactivateUsuario } from "../services/adminService";
import { notification } from "antd";
import ModalUsuario from "./ModalUsuario";

export default function VerUsuario() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const data = await getUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            notification.error({
                message: 'Error',
                description: 'No se pudieron cargar los usuarios.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleToggleEstado = async (usuario) => {
        try {
            if (usuario.estado === "ACTIVO") {
                await deactivateUsuario(usuario.id);
                notification.success({
                    message: "Usuario desactivado",
                    description: `El usuario ${usuario.nombre} ha sido desactivado.`
                });
            } else {
                await activateUsuario(usuario.id);
                notification.success({
                    message: "Usuario activado",
                    description: `El usuario ${usuario.nombre} ha sido activado.`
                });
            }

            // Volver a cargar la lista
            await fetchUsuarios();

            // Verificar si realmente cambió el estado, si no, forzar reload
            const updatedUser = usuarios.find(u => u.id === usuario.id);
            if (updatedUser && updatedUser.estado === usuario.estado) {
                console.warn("El estado no cambió en el frontend, forzando recarga completa.");
                window.location.reload();
            }

        } catch (error) {
            console.error("Error al cambiar estado:", error);
            notification.error({
                message: "Error",
                description: "No se pudo cambiar el estado del usuario. Se recargará la página."
            });
            window.location.reload();
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl">Usuarios registrados</h1>

            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th className="w-56">Nombre completo</th>
                            <th className="w-40">Usuario</th>
                            <th className="w-32">Rol</th>
                            <th className="w-32">Sucursal</th>
                            <th className="w-32">Estado</th>
                            <th className="w-64">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    Cargando usuarios...
                                </td>
                            </tr>
                        ) : usuarios.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        ) : (
                            usuarios.map((usuario, index) => (
                                <tr key={usuario.id}>
                                    <td>{index + 1}</td>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.usuario}</td>
                                    <td>{usuario.rol}</td>
                                    <td>{usuario.sucursal}</td>
                                    <td>{usuario.estado}</td>
                                    <td className="flex gap-2">
                                        <button
                                            className="btn btn-sm bg-[#9F2241] hover:bg-[#7d1b34] text-white"
                                            onClick={() => setSelectedUsuario(usuario)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className={`btn btn-sm ${usuario.estado === "ACTIVO"
                                                ? "bg-yellow-600 hover:bg-yellow-700"
                                                : "bg-green-600 hover:bg-green-700"
                                            } text-white`}
                                            onClick={() => handleToggleEstado(usuario)}
                                        >
                                            {usuario.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedUsuario && (
                <ModalUsuario
                    usuario={selectedUsuario}
                    onClose={() => {
                        setSelectedUsuario(null);
                        fetchUsuarios();
                    }}
                />
            )}
        </div>
    );
}
