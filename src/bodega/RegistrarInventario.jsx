import axios from "axios";
import { useState } from "react";
import { getZapatoIndex, getZapatoID } from '../services/bodegaService';
import ModalInventario from "./ModalInventario";
import ModalExhibir from "./ModalExhibir";

export default function RegistrarInventario() {
    const [zapatos, setZapatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedZapato, setSelectedZapato] = useState(null);
    const [selectedExhibir, setSelectedExhibir] = useState(null);

    const [filters, setFilters] = useState({
        marca: "",
        modelo: "",
        material: "",
        color: "",
        talla: "",
        estado: ""
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
            const data = await getZapatoIndex(filters);
            setZapatos(data.data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error al obtener inventario:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEtiquetaClick = async (id) => {
        try {
            const data = await getZapatoID(id);
            console.log("Respuesta completa de getZapatoID:", data);

            const zapato = data.zapato; // 👈 aquí estaba el error
            console.log("Zapato recibido:", zapato);

            const zpl = `
            ^XA
            ^FO30,80^A0N,80,80^FD${zapato.marca}^FS
            ^FO50,190^A0N,90,90^FDModelo: ${zapato.modelo}^FS
            ^FO50,300^A0N,90,90^FD${zapato.material} ${zapato.color}^FS
            ^FO550,50^A0N,100,100^FD${zapato.talla}^FS
            ^FO30,420^A0N,60,60^FD${zapato.tipo_zapato}^FS
            ^FO200,500^BCN,100,Y,N,N^FD${zapato.codigo}^FS

            ^FO30,650^A0N,80,80^FD${zapato.marca}^FS
            ^FO50,750^A0N,90,90^FDModelo: ${zapato.modelo}^FS
            ^FO50,850^A0N,90,90^FD${zapato.material} ${zapato.color}^FS
            ^FO550,650^A0N,100,100^FD${zapato.talla}^FS
            ^FO30,950^A0N,60,60^FD${zapato.tipo_zapato}^FS
            ^FO200,1050^BCN,100,Y,N,N^FD${zapato.codigo}^FS
            ^XZ
        `;

            console.log("ZPL generado:", zpl);

            const response = await axios.post(
                "https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/",
                zpl,
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    responseType: "arraybuffer",
                }
            );

            const blob = new Blob([response.data], { type: "image/png" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `etiqueta-${zapato.marca}-${zapato.modelo}-${zapato.material}-${zapato.color}-${zapato.talla}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 5000);

        } catch (error) {
            console.error("Error generando etiqueta:", error);
            alert("No se pudo generar la etiqueta.");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Inventario de Zapatos</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <input
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
                <select
                    name="estado"
                    value={filters.estado}
                    onChange={handleFilterChange}
                    className="select select-bordered w-full"
                >
                    <option value="">Estado</option>
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                </select>

                <button
                    className={`btn btn-primary w-full ${loading ? "btn-disabled" : ""}`}
                    onClick={handleBuscar}
                >
                    {loading ? "Buscando..." : "Buscar"}
                </button>
            </div>

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
                                    <th>ID zapato</th>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                    <th>Material</th>
                                    <th>Color</th>
                                    <th>Talla</th>
                                    <th>Precio</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentZapatos.map(zapato => (
                                    <tr key={zapato.id}>
                                        <td>{zapato.id}</td>
                                        <td>{zapato.marca}</td>
                                        <td>{zapato.modelo}</td>
                                        <td>{zapato.material}</td>
                                        <td>{zapato.color}</td>
                                        <td>{zapato.talla}</td>
                                        <td>${zapato.precio}</td>
                                        <td>{zapato.estado}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline btn-info"
                                                onClick={() => setSelectedZapato(zapato)}
                                            >
                                                Inventario
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline btn-info"
                                                onClick={() => {
                                                    setSelectedExhibir(zapato);
                                                }}
                                            >
                                                Exhibir
                                            </button>

                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline btn-info"
                                                onClick={() => handleEtiquetaClick(zapato.id)}
                                            >
                                                Etiqueta
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

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

            {/* Modal */}
            {selectedZapato && (
                <ModalInventario zapato={selectedZapato} onClose={() => setSelectedZapato(null)} />
            )}

            {selectedExhibir && (
                <ModalExhibir zapato={selectedExhibir} onClose={() => setSelectedExhibir(null)} />
            )}
        </div>
    );
}
