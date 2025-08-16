import { useState, useEffect } from "react";
import { completarApartado } from "../services/tiendaService";
import { notification, Spin } from "antd";

export default function ModalLiquidar({ apartado, onClose }) {
    const [montoPago, setMontoPago] = useState("");
    const [cambio, setCambio] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (apartado) {
            const pago = parseFloat(montoPago) || 0;
            const restante = parseFloat(apartado.monto_restante) || 0;
            setCambio(pago > restante ? pago - restante : 0);
        }
    }, [montoPago, apartado]);

    const confirmarPago = async () => {
        if (!apartado) return;

        const montoExacto = parseFloat(apartado.monto_restante);
        const data = { monto_pagado: montoExacto };

        setLoading(true);
        try {
            await completarApartado(apartado.id, data);

            notification.success({
                message: "Pago registrado",
                description: "El apartado ha sido liquidado correctamente.",
            });

            setMontoPago("");

            if (onClose) onClose();
        } catch (error) {
            notification.error({
                message: "Error al completar pago",
                description:
                    error?.response?.data?.message || "Ocurrió un error al procesar el pago.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog id="modal-liquidar" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Liquidar Apartado</h3>

                {apartado ? (
                    <div className="py-4">
                        <p className="mb-4">
                            Cliente: <strong>{apartado.nombre_cliente}</strong> <br />
                            Teléfono: {apartado.telefono_cliente} <br />
                            Monto Restante:{" "}
                            <strong>${parseFloat(apartado.monto_restante).toFixed(2)}</strong>
                        </p>

                        <div className="mb-4">
                            <p><strong>Marca:</strong> {apartado.zapato?.marca ?? "N/A"}</p>
                            <p><strong>Modelo:</strong> {apartado.zapato?.modelo ?? "N/A"}</p>
                            <p><strong>Material:</strong> {apartado.zapato?.material ?? "N/A"}</p>
                            <p><strong>Color:</strong> {apartado.zapato?.color ?? "N/A"}</p>
                            <p><strong>Talla:</strong> {apartado.zapato?.talla ?? "N/A"}</p>
                            <p><strong>Precio:</strong> ${parseFloat(apartado.precio_zapato).toFixed(2)}</p>
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Monto con el que paga</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                className="input input-bordered w-full"
                                value={montoPago}
                                onChange={(e) => setMontoPago(e.target.value)}
                                placeholder="Ej. 500"
                            />
                        </div>

                        {montoPago && (
                            <div className="mt-2">
                                {parseFloat(montoPago) < parseFloat(apartado.monto_restante) ? (
                                    <p className="text-red-500 font-bold">
                                        El monto ingresado es insuficiente para liquidar.
                                    </p>
                                ) : (
                                    <p className="text-green-600 font-bold">
                                        Cambio a devolver: ${cambio.toFixed(2)}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="py-4">Cargando datos...</p>
                )}

                <div className="modal-action">
                    <form method="dialog">
                        <button 
                            className="btn" 
                            type="button" 
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                        <button
                            type="button"
                            onClick={confirmarPago}
                            className="btn btn-success flex items-center gap-2"
                            disabled={
                                loading ||
                                !montoPago ||
                                parseFloat(montoPago) < parseFloat(apartado?.monto_restante ?? 0)
                            }
                        >
                            {loading ? <Spin size="small" /> : "Confirmar Pago"}
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    );
}
