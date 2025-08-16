import { useState } from "react";
import { exhibirCalzado } from "../services/bodegaService";
import { notification } from "antd";

export default function ModalExhibir({ zapato, onClose }) {
    const [sucursalId, setSucursalId] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGuardar = async () => {
        if (!sucursalId || cantidad <= 0) {
            notification.warning({
                message: "Datos incompletos",
                description: "Selecciona sucursal y cantidad mayor a 0.",
                placement: "topRight"
            });
            return;
        }

        const payload = {
            zapato_id: zapato.id,
            sucursal_id: parseInt(sucursalId),
            cantidad: parseInt(cantidad)
        };

        setLoading(true);

        try {
            const data = await exhibirCalzado(payload);
            console.log("Calzado Exhibido:", data);

            notification.success({
                message: "Calzado exhibido correctamente",
                description: data.message || "El calzado ha sido exhibido.",
                placement: "topRight"
            });

            onClose();
        } catch (error) {
            console.error("Error al exhibir el calzado:", error);

            notification.error({
                message: "Error al exhibir el calzado",
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
                <h3 className="font-bold text-lg mb-4">Exhibir Zapato</h3>

                <div className="flex flex-wrap gap-4 mb-4">
                    <p><strong>ID:</strong> {zapato.id}</p>
                    <p><strong>Marca:</strong> {zapato.marca}</p>
                    <p><strong>Modelo:</strong> {zapato.modelo}</p>
                    <p><strong>Material:</strong> {zapato.material}</p>
                    <p><strong>Color:</strong> {zapato.color}</p>
                    <p><strong>Talla:</strong> {zapato.talla}</p>
                </div>

                <div className="flex flex-col gap-4">
                    <p>Seleccione sucursal y cantidad:</p>

                    <div className="flex gap-4">
                        <select
                            className="select w-48"
                            value={sucursalId}
                            onChange={(e) => setSucursalId(e.target.value)}
                        >
                            <option value="">Seleccionar Tienda</option>
                            <option value="2">Tienda 1</option>
                            <option value="3">Tienda 2</option>
                        </select>

                        <input
                            type="number"
                            className="input w-32"
                            placeholder="Cantidad"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            min="0"
                        />
                    </div>
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
