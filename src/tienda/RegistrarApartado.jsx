import { useState, useRef } from "react";
import { getZapatoIndex } from "../services/tiendaService";
import ModalApartado from "./ModalApartado";

export default function RegistrarApartado() {
    const [zapatos, setZapatos] = useState([]);
    const [loading, setLoading] = useState(false);
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
            newValue = newValue.replace(/\s+/g, "");

            const tallaRegEx = /^[2-7](\.5)?$/;
            if (tallaRegEx.test(newValue)) {
                newValue = '2' + newValue;
            }
        } else {
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

    // Función para abrir modal con zapato seleccionado
    const abrirModalApartado = (zapato) => {
        setModalZapato(zapato);
        setCantidad(1);
    };

    // Función que recibe los datos del modal al apartar
    const handleApartar = (datosApartado) => {
        console.log("Datos apartados:", datosApartado);

        setZapatos([]);       // Limpiar tabla
        setModalZapato(null); // Cerrar modal

        // Limpiar los filtros/input
        setFilters({
            marca: "",
            modelo: "",
            material: "",
            color: "",
            talla: ""
        });
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Registrar nuevo apartado</h1>

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
                                            onClick={() => abrirModalApartado(item)}
                                        >
                                            Apartar zapato
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ModalApartado
                zapato={modalZapato}
                cantidad={cantidad}
                setCantidad={setCantidad}
                onApartar={handleApartar}
                onClose={() => setModalZapato(null)}
            />
        </div>
    );
}
