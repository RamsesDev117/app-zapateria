import { useEffect, useState } from "react";
import { getEmpBodega } from "../services/tiendaService";
import { useUser } from "../context/UserContext";

export default function ModalAgregar({ zapato, cantidad, setCantidad, onAgregar, onClose }) {
    const { user } = useUser();
    const [empleados, setEmpleados] = useState([]);
    const [empleadoId, setEmpleadoId] = useState("");
    const [empleadoNombre, setEmpleadoNombre] = useState("");
    const [sucursalId, setSucursalId] = useState("");
    const [sucursalNombre, setSucursalNombre] = useState("");
    const [metodoPago, setMetodoPago] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (zapato) {
            setLoading(true);
            getEmpBodega()
                .then(data => {
                    setEmpleados(data);
                })
                .catch(err => {
                    console.error("Error al obtener empleados:", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [zapato]);

    if (!zapato) return null;

    const isSucursalIgual = (parseInt(sucursalId) === user?.sucursal_id);

    const handleAgregar = () => {
        onAgregar({ 
            cantidad, 
            sucursalId, 
            sucursalNombre, 
            empleadoId, 
            empleadoNombre,
            metodoPago
        });
    };

    return (
        <dialog open className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Agregar a venta</h3>
                <p className="mb-4">
                    {zapato.marca} - {zapato.modelo} - Talla {zapato.talla}
                </p>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Cantidad</label>
                    <input
                        type="number"
                        className="input w-full"
                        min="1"
                        value={cantidad}
                        onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                    />
                </div>

                <div className="mb-4">
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

                <div className="mb-4">
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
                                setEmpleadoNombre(
                                    e.target.options[e.target.selectedIndex].text
                                );
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

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Método de pago</label>
                    <select
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="select select-bordered w-full"
                    >
                        <option disabled value="">Selecciona método</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                </div>

                <div className="modal-action">
                    <button className="btn btn-success" onClick={handleAgregar}>
                        Agregar
                    </button>
                    <button className="btn btn-warning" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </dialog>
    );
}
