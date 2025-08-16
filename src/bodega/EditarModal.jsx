import { useState } from "react";
import { editarInventario } from "../services/bodegaService";
import { notification } from "antd";

export default function EditarModal({ zapato, onUpdate }) {
    const [unidades, setUnidades] = useState(zapato.unidades_disponibles);
    const [loading, setLoading] = useState(false);

    const handleGuardar = async () => {
        try {
            setLoading(true);

            const data = await editarInventario(zapato.id, unidades);

            notification.success({
                message: "Inventario actualizado",
                description: `El zapato ${zapato.zapato?.marca} ${zapato.zapato?.modelo} ahora tiene ${unidades} unidades.`,
                placement: "topRight",
            });

            // Actualizar tabla
            if (onUpdate) onUpdate();

            // Cerrar modal
            document.getElementById("modal-editar").checked = false;

        } catch (error) {
            console.error("Error al actualizar inventario:", error);
            notification.error({
                message: "Error al actualizar",
                description: error?.response?.data?.message || "Ocurrió un error al guardar los cambios.",
                placement: "topRight",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <input type="checkbox" id="modal-editar" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Editar Inventario</h3>

                    <p><strong>ID:</strong> {zapato.id}</p>
                    <p><strong>Marca:</strong> {zapato.zapato?.marca}</p>
                    <p><strong>Modelo:</strong> {zapato.zapato?.modelo}</p>
                    <p><strong>Material:</strong> {zapato.zapato?.material}</p>
                    <p><strong>Color:</strong> {zapato.zapato?.color}</p>
                    <p><strong>Talla:</strong> {zapato.zapato?.talla}</p>

                    <div className="mt-4">
                        <label className="block mb-1">Unidades disponibles:</label>
                        <input
                            type="number"
                            value={unidades}
                            onChange={(e) => setUnidades(Number(e.target.value))}
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div className="modal-action">
                        <label htmlFor="modal-editar" className="btn">Cancelar</label>
                        <button
                            className={`btn btn-primary ${loading ? "loading" : ""}`}
                            onClick={handleGuardar}
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
