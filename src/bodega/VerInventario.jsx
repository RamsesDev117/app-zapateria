import { useState } from "react";
import { getInventarioSucursal } from '../services/bodegaService';
import EditarModal from "./EditarModal";

export default function VerInventario() {
    const [zapatos, setZapatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedZapato, setSelectedZapato] = useState(null);

    const [filters, setFilters] = useState({
        sucursal_id: "",
        marca: "",
        modelo: "",
        material: "",
        color: "",
        talla: ""
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentZapatos = zapatos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.max(1, Math.ceil(zapatos.length / itemsPerPage));

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const handleBuscar = async () => {
        setLoading(true);
        try {
            const data = await getInventarioSucursal(filters);
            setZapatos(data.data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error al obtener inventario:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-6">Inventario de Zapatos por sucursal</h1>

                {/* Filtros */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <select
                        name="sucursal_id"
                        value={filters.sucursal_id}
                        onChange={handleFilterChange}
                        className="select select-bordered w-full"
                    >
                        <option disabled value="">Sucursal</option>
                        <option value="1">Bodega</option>
                        <option value="2">Tienda 1</option>
                        <option value="3">Tienda 2</option>
                    </select>

                    <input type="text" name="marca" value={filters.marca} onChange={handleFilterChange} placeholder="Marca" className="input input-bordered w-full" />
                    <input type="text" name="modelo" value={filters.modelo} onChange={handleFilterChange} placeholder="Modelo" className="input input-bordered w-full" />
                    <input type="text" name="material" value={filters.material} onChange={handleFilterChange} placeholder="Material" className="input input-bordered w-full" />
                    <input type="text" name="color" value={filters.color} onChange={handleFilterChange} placeholder="Color" className="input input-bordered w-full" />
                    <input type="text" name="talla" value={filters.talla} onChange={handleFilterChange} placeholder="Talla" className="input input-bordered w-full" />

                    <button
                        className={`btn btn-outline btn-success ${loading ? "btn-disabled" : ""}`}
                        onClick={handleBuscar}
                    >
                        {loading ? "Buscando..." : "Buscar"}
                    </button>
                </div>

                {/* Tabla */}
                {loading && (
                    <div className="flex justify-center my-8">
                        <span className="loading loading-dots loading-lg text-blue-600"></span>
                    </div>
                )}

                {!loading && zapatos.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        No hay zapatos registrados con esos filtros.
                    </div>
                )}

                {!loading && zapatos.length > 0 && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Marca</th>
                                        <th>Modelo</th>
                                        <th>Material</th>
                                        <th>Color</th>
                                        <th>Talla</th>
                                        <th>Unidades disponibles</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentZapatos.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.zapato?.marca || '-'}</td>
                                            <td>{item.zapato?.modelo || '-'}</td>
                                            <td>{item.zapato?.material || '-'}</td>
                                            <td>{item.zapato?.color || '-'}</td>
                                            <td>{item.zapato?.talla || '-'}</td>
                                            <td>{item.unidades_disponibles}</td>
                                            <td>
                                                <label
                                                    htmlFor="modal-editar"
                                                    className="btn btn-outline btn-primary btn-sm"
                                                    onClick={() => setSelectedZapato(item)}
                                                >
                                                    Editar
                                                </label>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        <div className="flex justify-center mt-6 gap-4">
                            <button className="btn" onClick={goToPrevPage} disabled={currentPage === 1}>
                                Anterior
                            </button>
                            <span className="self-center">Página {currentPage} de {totalPages}</span>
                            <button className="btn" onClick={goToNextPage} disabled={currentPage === totalPages}>
                                Siguiente
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            {selectedZapato && (
                <EditarModal zapato={selectedZapato} onUpdate={handleBuscar} />
            )}
        </>
    );
}
