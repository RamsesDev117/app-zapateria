import { useState, useRef } from "react";
import { getZapatoIndex } from "../services/tiendaService";
import { notification } from "antd";
import ModalAgregar from "./ModalAgregar";
import TablaCarrito from "./TablaCarrito";

export default function RegistrarVenta() {
    const [zapatos, setZapatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [carrito, setCarrito] = useState([]);
    const [modalZapato, setModalZapato] = useState(null);
    const [cantidad, setCantidad] = useState(1);

    const [filters, setFilters] = useState({
        marca: "",
        modelo: "",
        material: "",
        color: "",
        talla: ""
    });

    const marcaRef = useRef(null);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        let newValue = value.trim();

        if (name === "talla") {
            // Quitamos todos los espacios intermedios
            newValue = newValue.replace(/\s+/g, "");

            // Regla: si el usuario escribe del 2 al 7 o 2.5 al 7.5
            const tallaRegEx = /^[2-7](\.5)?$/;

            if (tallaRegEx.test(newValue)) {
                // Anteponer el '2' para formar '22', '23', etc.
                newValue = '2' + newValue;
            }
        } else {
            // Para los otros campos capitalizamos la primera letra
            newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);
        }

        setFilters({
            ...filters,
            [name]: newValue
        });
    };


    const handleBuscar = async () => {
        setLoading(true);
        try {
            const data = await getZapatoIndex(filters);
            setZapatos(data.data);
        } catch (error) {
            console.error("Error al obtener inventario:", error);
        } finally {
            setLoading(false);
        }
    };

    const abrirModalAgregar = (zapato) => {
        setModalZapato(zapato);
        setCantidad(1);
    };

    const agregarAlCarrito = ({ cantidad, sucursalId, sucursalNombre, empleadoId, empleadoNombre, metodoPago }) => {
        if (cantidad <= 0) {
            notification.warning({
                message: "Cantidad inválida",
                description: "Debe ser mayor a cero",
                placement: "topRight"
            });
            return;
        }

        setCarrito(prev => [
            ...prev,
            {
                ...modalZapato,
                cantidad,
                sucursalId,
                sucursalNombre,
                empleadoId,
                empleadoNombre,
                metodoPago
            }
        ]);

        setFilters({
            marca: "",
            modelo: "",
            material: "",
            color: "",
            talla: ""
        });
        setZapatos([]);
        setModalZapato(null);

        marcaRef.current?.focus();
    };

    const eliminarDelCarrito = (index) => {
        setCarrito(prev => prev.filter((_, i) => i !== index));
    };

    const totalVenta = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    return (
        <>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-6">Registrar nueva venta</h1>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <input
                        ref={marcaRef}
                        type="text"
                        name="marca"
                        value={filters.marca}
                        onChange={handleFilterChange}
                        placeholder="Marca"
                        className="input input-bordered w-full"
                    />
                    <input
                        type="text"
                        name="modelo"
                        value={filters.modelo}
                        onChange={handleFilterChange}
                        placeholder="Modelo"
                        className="input input-bordered w-full"
                    />
                    <input
                        type="text"
                        name="material"
                        value={filters.material}
                        onChange={handleFilterChange}
                        placeholder="Material"
                        className="input input-bordered w-full"
                    />
                    <input
                        type="text"
                        name="color"
                        value={filters.color}
                        onChange={handleFilterChange}
                        placeholder="Color"
                        className="input input-bordered w-full"
                    />
                    <input
                        type="text"
                        name="talla"
                        value={filters.talla}
                        onChange={handleFilterChange}
                        placeholder="Talla"
                        className="input input-bordered w-full"
                    />
                    <button
                        className={`btn btn-outline btn-success ${loading ? "btn-disabled" : ""}`}
                        onClick={handleBuscar}
                    >
                        {loading ? "Buscando..." : "Buscar"}
                    </button>
                </div>

                {!loading && zapatos.length > 0 && (
                    <div className="overflow-x-auto mt-4">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                    <th>Material</th>
                                    <th>Color</th>
                                    <th>Talla</th>
                                    <th>Precio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {zapatos.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.marca}</td>
                                        <td>{item.modelo}</td>
                                        <td>{item.material}</td>
                                        <td>{item.color}</td>
                                        <td>{item.talla}</td>
                                        <td>${item.precio}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline btn-primary"
                                                onClick={() => abrirModalAgregar(item)}
                                            >
                                                Agregar a la venta
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <TablaCarrito
                    carrito={carrito}
                    totalVenta={totalVenta}
                    eliminarDelCarrito={eliminarDelCarrito}
                    limpiarCarrito={() => setCarrito([])}
                />

            </div>

            <ModalAgregar
                zapato={modalZapato}
                cantidad={cantidad}
                setCantidad={setCantidad}
                onAgregar={agregarAlCarrito}
                onClose={() => setModalZapato(null)}
            />
        </>
    );
}
