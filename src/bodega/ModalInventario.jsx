import { useState } from "react";
import { storeInventario } from "../services/bodegaService";
import { notification } from "antd";

export default function ModalInventario({ zapato, onClose }) {
    const [inventarios, setInventarios] = useState([
        { sucursal_id: 1, sucursal_nombre: "Bodega", unidades_disponibles: "" },
        { sucursal_id: 2, sucursal_nombre: "Tienda 1", unidades_disponibles: "" },
        { sucursal_id: 3, sucursal_nombre: "Tienda 2", unidades_disponibles: "" },
    ]);

    const [loading, setLoading] = useState(false);

    const handleCantidadChange = (index, value) => {
        const newInventarios = [...inventarios];
        newInventarios[index].unidades_disponibles = parseInt(value) || "";
        setInventarios(newInventarios);
    };

    const handleGuardar = async () => {
        const payload = inventarios.map(item => ({
            zapato_id: zapato.id,
            sucursal_id: item.sucursal_id,
            unidades_disponibles: item.unidades_disponibles || 0
        }));

        setLoading(true);

        try {
            const data = await storeInventario(payload);
            console.log("Inventario registrado:", data);

            notification.success({
                message: "Inventario registrado",
                description: data.message || "El inventario fue guardado correctamente.",
                placement: "topRight"
            });

            onClose(); // cerrar modal
        } catch (error) {
            console.error("Error al guardar inventario:", error);

            notification.error({
                message: "Error al guardar inventario",
                description: error.response?.data?.message || "Hubo un problema al guardar.",
                placement: "topRight"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog open className="modal">
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-lg mb-4">Inventario del Zapato</h3>

                <div className="flex flex-wrap gap-4 mb-4">
                    <p><strong>ID:</strong> {zapato.id}</p>
                    <p><strong>Marca:</strong> {zapato.marca}</p>
                    <p><strong>Modelo:</strong> {zapato.modelo}</p>
                    <p><strong>Material:</strong> {zapato.material}</p>
                    <p><strong>Color:</strong> {zapato.color}</p>
                    <p><strong>Talla:</strong> {zapato.talla}</p>
                </div>

                <div className="flex flex-col gap-4">
                    <p>Registre las cantidades por sucursal</p>

                    {inventarios.map((item, index) => (
                        <div key={index} className="flex flex-row gap-4">
                            <input
                                type="text"
                                className="input w-48 cursor-default"
                                value={item.sucursal_nombre}
                                readOnly
                            />
                            <input
                                type="number"
                                className="input w-48"
                                placeholder="Cantidad"
                                value={item.unidades_disponibles || ""}
                                onChange={(e) => handleCantidadChange(index, e.target.value)}
                                min="0"
                            />
                        </div>
                    ))}
                </div>

                <div className="modal-action">
                    <button
                        onClick={handleGuardar}
                        className={`btn btn-outline btn-success ${loading ? "btn-disabled" : ""}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Guardando...
                            </>
                        ) : (
                            "Guardar"
                        )}
                    </button>
                    <button onClick={onClose} className="btn btn-outline btn-warning">
                        Cerrar
                    </button>
                </div>
            </div>
        </dialog>
    );
}
