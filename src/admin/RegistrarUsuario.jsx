import { useEffect, useState } from "react";
import { getRoles, getSucursales, registerUser } from "../services/adminService";
import { notification } from "antd";

export default function RegistrarUsuario() {
    const [roles, setRoles] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [loadingSucursales, setLoadingSucursales] = useState(true);

    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        usuario: "",
        password: "",
        rol_id: "",
        sucursal_id: "",
        estado: "ACTIVO"
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);

        try {
            await registerUser(
                formData.nombre,
                formData.usuario,
                formData.password,
                formData.rol_id,
                formData.sucursal_id,
                formData.estado
            );

            notification.success({
                message: 'Usuario registrado',
                description: `El usuario ${formData.usuario} fue creado exitosamente.`,
            });

            setFormData({
                nombre: "",
                usuario: "",
                password: "",
                rol_id: "",
                sucursal_id: "",
                estado: "ACTIVO"
            });
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            notification.error({
                message: 'Error',
                description: 'No se pudo registrar el usuario.',
            });
        } finally {
            setLoadingSubmit(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                <h1 className="font-bold text-xl">Registrar usuarios</h1>

                <div className="flex flex-row gap-4">
                    <div className="flex flex-col w-72">
                        <label className="text-sm font-semibold mb-1">Nombre completo</label>
                        <input
                            name="nombre"
                            type="text"
                            className="input"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <h2 className="font-semibold">Datos para iniciar sesión</h2>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col w-52">
                        <label className="text-sm font-semibold mb-1">Usuario</label>
                        <input
                            name="usuario"
                            type="text"
                            className="input"
                            value={formData.usuario}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col w-52">
                        <label className="text-sm font-semibold mb-1">Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            className="input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <h2 className="font-semibold">Sucursal y rol del usuario</h2>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col w-52">
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
                    </div>

                    <div className="flex flex-col w-52">
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
                </div>

                <div className="fixed bottom-4 right-4">
                    <button
                        type="submit"
                        className={`w-full py-2 mt-2 rounded-lg font-semibold text-white transition ${loadingSubmit
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#9F2241] hover:bg-[#7d1b34]"
                            }`}
                        disabled={loadingSubmit}
                    >
                        {loadingSubmit ? "Registrando..." : "Registrar Usuario"}
                    </button>
                </div>
            </div>
        </form>
    );
}
