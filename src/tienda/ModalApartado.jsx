import { useEffect, useState } from "react";
import { getEmpBodega, registrarApartado } from "../services/tiendaService";
import { useUser } from "../context/UserContext";
import { notification } from "antd";

export default function ModalApartado({ zapato, cantidad, setCantidad, onApartar, onClose }) {
    const { user } = useUser();
    const [empleados, setEmpleados] = useState([]);
    const [empleadoId, setEmpleadoId] = useState("");
    const [empleadoNombre, setEmpleadoNombre] = useState("");
    const [sucursalId, setSucursalId] = useState("");
    const [sucursalNombre, setSucursalNombre] = useState("");
    const [loading, setLoading] = useState(false);
    const [guardando, setGuardando] = useState(false); // Spinner mientras guarda

    const [nombreCliente, setNombreCliente] = useState("");
    const [telefonoCliente, setTelefonoCliente] = useState("");
    const [fechaApartado, setFechaApartado] = useState("");
    const [fechaLimite, setFechaLimite] = useState("");
    const [montoApartado, setMontoApartado] = useState(0);

    useEffect(() => {
        if (zapato) {
            setLoading(true);
            getEmpBodega()
                .then(data => setEmpleados(data))
                .catch(err => console.error("Error al obtener empleados:", err))
                .finally(() => setLoading(false));

            const hoy = new Date();
            const limite = new Date();
            limite.setDate(hoy.getDate() + 20);
            const formatoFecha = (fecha) => fecha.toISOString().split("T")[0];

            setFechaApartado(formatoFecha(hoy));
            setFechaLimite(formatoFecha(limite));
        }
    }, [zapato]);

    if (!zapato) return null;

    const isSucursalIgual = parseInt(sucursalId) === user?.sucursal_id;

    const handleApartar = async () => {
        const json = {
            zapato_id: zapato.id,
            nombre_cliente: nombreCliente,
            telefono_cliente: telefonoCliente,
            fecha_apartado: fechaApartado,
            fecha_limite: fechaLimite,
            monto_apartado: montoApartado,
            precio_zapato: zapato.precio,
            usuario_id: user?.usuario_id, // Quien está haciendo el apartado
            usuario_bodega_id: empleadoId, // Quien llevó el zapato desde otra sucursal o bodega
            apartado_sucursal_id: user?.sucursal_id,
            zapato_sucursal_id: parseInt(sucursalId),
        };

        setGuardando(true);

        try {
            const response = await registrarApartado(json);
            notification.success({
                message: "Apartado registrado",
                description: response.message || "El apartado se guardó correctamente.",
            });
            onApartar(response.apartado);
            onClose();
        } catch (error) {
            console.error("Error al registrar apartado:", error);
            notification.error({
                message: "Error al registrar apartado",
                description: error.response?.data?.message || "Ocurrió un error inesperado.",
            });
        } finally {
            setGuardando(false);
        }
    };

    return (
        <dialog open className="modal">
            <div className="modal-box max-w-4xl">
                <h3 className="font-bold text-lg mb-4">Apartar zapato</h3>
                <p className="mb-4">
                    {zapato.marca} - {zapato.modelo} - Talla {zapato.talla}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-1 font-semibold">Cantidad</label>
                        <input
                            type="number"
                            className="input w-full"
                            min="1"
                            value={cantidad}
                            onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">¿De dónde le trajeron el zapato?</label>
                        <select
                            value={sucursalId}
                            onChange={(e) => {
                                const id = e.target.value;
                                const name = e.target.options[e.target.selectedIndex].text;
                                setSucursalId(id);
                                setSucursalNombre(name);

                                if (parseInt(id) === user?.sucursal_id) {
                                    setEmpleadoId(user.usuario_id);
                                    setEmpleadoNombre(user.nombre_usuario);
                                } else {
                                    setEmpleadoId("");
                                    setEmpleadoNombre("");
                                }
                            }}
                            className="select select-bordered w-full"
                        >
                            <option disabled value="">Selecciona sucursal</option>
                            <option value="1">Bodega</option>
                            <option value="2">Tienda 1</option>
                            <option value="3">Tienda 2</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">¿Quién trajo el zapato?</label>
                        {loading ? (
                            <div className="flex justify-center">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        ) : (
                            <select
                                value={empleadoId}
                                disabled={isSucursalIgual}
                                onChange={(e) => {
                                    setEmpleadoId(e.target.value);
                                    setEmpleadoNombre(e.target.options[e.target.selectedIndex].text);
                                }}
                                className="select select-bordered w-full"
                            >
                                <option disabled value="">Selecciona empleado</option>
                                {empleados.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.nombre}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Nombre del cliente</label>
                        <input
                            type="text"
                            className="input w-full"
                            value={nombreCliente}
                            onChange={(e) => setNombreCliente(e.target.value)}
                            placeholder="Nombre del cliente"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Teléfono del cliente</label>
                        <input
                            type="tel"
                            className="input w-full"
                            value={telefonoCliente}
                            onChange={(e) => setTelefonoCliente(e.target.value)}
                            placeholder="Teléfono"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Fecha de apartado</label>
                        <input
                            type="date"
                            className="input w-full"
                            value={fechaApartado}
                            onChange={(e) => setFechaApartado(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Fecha límite</label>
                        <input
                            type="date"
                            className="input w-full"
                            value={fechaLimite}
                            onChange={(e) => setFechaLimite(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Monto apartado</label>
                        <input
                            type="number"
                            className="input w-full"
                            min="0"
                            value={montoApartado}
                            onChange={(e) => setMontoApartado(parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>

                <div className="modal-action mt-4">
                    <button className="btn btn-success" onClick={handleApartar} disabled={guardando}>
                        {guardando ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            "Apartar"
                        )}
                    </button>
                    <button className="btn btn-warning" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </dialog>
    );
}
