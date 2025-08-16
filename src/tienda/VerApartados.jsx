import { useState } from "react";
import { listarApartados, cancelarApartado } from "../services/tiendaService";
import { Input, notification, Spin, Modal, Button } from "antd"; // Usamos Modal y Button de Ant Design
import ModalLiquidar from "./ModalLiquidar";

export default function VerApartados() {
    const [nombreCliente, setNombreCliente] = useState("");
    const [apartados, setApartados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [buscarRealizado, setBuscarRealizado] = useState(false);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [apartadoSeleccionado, setApartadoSeleccionado] = useState(null);

    // Estado para spinner de cancelación por ID
    const [cancelandoId, setCancelandoId] = useState(null);

    // Estado para controlar modal de confirmación de cancelación
    const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
    const [idCancelar, setIdCancelar] = useState(null);

    const buscarApartados = async () => {
        setLoading(true);
        try {
            const response = await listarApartados({ nombre_cliente: nombreCliente });
            setApartados(response.data);
            setBuscarRealizado(true);
        } catch (error) {
            notification.error({
                message: "Error al buscar apartados",
                description: error.message || "Ocurrió un error inesperado.",
            });
        } finally {
            setLoading(false);
        }
    };

    const abrirModalLiquidar = (apartado) => {
        setApartadoSeleccionado(apartado);
        setModalAbierto(true);
        document.getElementById("modal-liquidar").showModal();
    };

    const cerrarModalLiquidar = () => {
        setModalAbierto(false);
        setApartadoSeleccionado(null);
        document.getElementById("modal-liquidar").close();
        setNombreCliente("");
        setApartados([]);
        setBuscarRealizado(false);
    };

    // Abrir modal confirmación cancelación
    const abrirModalConfirmacionCancelar = (id) => {
        setIdCancelar(id);
        setModalConfirmVisible(true);
    };

    // Cancelar apartado con confirmación
    const confirmarCancelar = async () => {
        setCancelandoId(idCancelar);
        setModalConfirmVisible(false);
        try {
            await cancelarApartado(idCancelar);
            notification.success({
                message: "Apartado cancelado",
                description: "El apartado ha sido cancelado correctamente.",
            });
            await buscarApartados();
        } catch (error) {
            console.error("Error al cancelar apartado:", error);
            notification.error({
                message: "Error al cancelar apartado",
                description:
                    error?.response?.data?.message || "Ocurrió un error al cancelar el apartado.",
            });
        } finally {
            setCancelandoId(null);
            setIdCancelar(null);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Apartados</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <Input
                    type="text"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    placeholder="Nombre del cliente"
                    className="input input-bordered w-full"
                    allowClear
                />

                <button
                    className="btn btn-outline btn-success"
                    onClick={buscarApartados}
                    disabled={loading}
                >
                    {loading ? <span className="loading loading-spinner"></span> : "Buscar"}
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center mt-10">
                    <Spin size="large" />
                </div>
            ) : apartados.length === 0 && buscarRealizado ? (
                <div className="text-center text-gray-500 mt-10">
                    No se encontraron apartados para el cliente.
                </div>
            ) : apartados.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Teléfono</th>
                                <th>Zapato</th>
                                <th>Apartado</th>
                                <th>Restante</th>
                                <th>Pagado</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apartados.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.nombre_cliente}</td>
                                    <td>{a.telefono_cliente}</td>
                                    <td>
                                        {`${a.zapato?.marca ?? ""} ${a.zapato?.modelo ?? ""} ${a.zapato?.material ?? ""} ${a.zapato?.color ?? ""} ${a.zapato?.talla ?? ""}`}
                                    </td>
                                    <td>${parseFloat(a.monto_apartado).toFixed(2)}</td>
                                    <td>${parseFloat(a.monto_restante).toFixed(2)}</td>
                                    <td>${parseFloat(a.monto_pagado).toFixed(2)}</td>
                                    <td>${parseFloat(a.precio_zapato).toFixed(2)}</td>
                                    <td>{a.estado}</td>
                                    <td className="space-x-2">
                                        {a.estado !== "CANCELADO" && a.estado !== "COMPLETADO" && (
                                            <>
                                                <button
                                                    className="btn btn-sm btn-outline btn-success"
                                                    onClick={() => abrirModalLiquidar(a)}
                                                >
                                                    Liquidar
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline btn-error flex items-center gap-2"
                                                    onClick={() => abrirModalConfirmacionCancelar(a.id)}
                                                    disabled={cancelandoId === a.id}
                                                >
                                                    {cancelandoId === a.id ? <Spin size="small" /> : "Cancelar"}
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null}

            {/* Modal para liquidar */}
            <ModalLiquidar apartado={apartadoSeleccionado} onClose={cerrarModalLiquidar} />

            {/* Modal de confirmación para cancelar */}
            <Modal
                title="Confirmar cancelación"
                visible={modalConfirmVisible}
                onOk={confirmarCancelar}
                onCancel={() => setModalConfirmVisible(false)}
                okText="Cancelar apartado"
                cancelText="Cerrar"
                confirmLoading={cancelandoId !== null}
            >
                <p>¿Estás seguro de que deseas cancelar este apartado?</p>
            </Modal>
        </div>
    );
}
