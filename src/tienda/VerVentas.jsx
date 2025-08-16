import { useState } from "react";
import { DatePicker, ConfigProvider, Spin, message } from "antd";
import esES from "antd/locale/es_ES";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useUser } from "../context/UserContext";
import { ventasUsuarioDia, corteCaja } from "../services/tiendaService";
import ModalCorte from "./ModalCorte";

dayjs.locale("es");

export default function VerVentas() {
    const { user } = useUser();
    const [selectedDate, setSelectedDate] = useState(null);
    const [ventasDetalles, setVentasDetalles] = useState([]);
    const [totalVentas, setTotalVentas] = useState(0);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [resumenMetodoPago, setResumenMetodoPago] = useState([]);

    const onChange = (date, dateString) => {
        setSelectedDate(dateString);
    };

    const fetchVentas = async (fecha) => {
        if (!user) {
            console.log("No hay usuario logueado");
            return;
        }

        setLoading(true);
        try {
            const response = await ventasUsuarioDia({
                usuario_id: user.usuario_id,
                fecha: fecha,
            });

            // Mapeamos detalles usando el total de la venta para la columna Total
            const detallesExtendidos = response.ventas.flatMap((venta) =>
                venta.detalles.map((detalle) => ({
                    fecha: venta.fecha,
                    metodo_pago: venta.metodo_pago,
                    zapato_id: detalle.zapato_id,
                    zapato_descripcion: `${detalle.zapato.marca} ${detalle.zapato.modelo} ${detalle.zapato.material} ${detalle.zapato.color} ${detalle.zapato.talla}`,
                    cantidad: detalle.cantidad,
                    total_detalle: parseFloat(venta.total), // <-- Total real de la venta
                    folio: venta.folio,
                }))
            );

            setVentasDetalles(detallesExtendidos);
            setTotalVentas(response.total_ventas);
        } catch (error) {
            console.error("Error al obtener ventas:", error);
            setVentasDetalles([]);
            setTotalVentas(0);
        } finally {
            setLoading(false);
        }
    };

    const handleBuscar = () => {
        if (selectedDate) {
            fetchVentas(selectedDate);
        } else {
            console.log("Falta seleccionar una fecha");
        }
    };

    const handleHoy = () => {
        const today = dayjs().format("YYYY-MM-DD");
        setSelectedDate(today);
        fetchVentas(today);
    };

    const formatoMoneda = (num, withSymbol = true) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
        }).format(num);
    };

    const calcularResumenMetodoPago = () => {
        const resumen = ventasDetalles.reduce((acc, venta) => {
            const metodo = venta.metodo_pago.toLowerCase();
            const total = venta.total_detalle;
            acc[metodo] = (acc[metodo] || 0) + total;
            return acc;
        }, {});

        const resumenArray = Object.entries(resumen).map(([metodo_pago, total]) => ({
            metodo_pago,
            total,
        }));

        setResumenMetodoPago(resumenArray);
    };

    const handleMostrarCorte = () => {
        calcularResumenMetodoPago();
        setModalVisible(true);
    };

    // NUEVO: función para realizar el corte y limpiar tabla
    const handleRealizarCorte = async (data) => {
        try {
            const response = await corteCaja(data);
            message.success("Corte de caja registrado correctamente");
            console.log("Respuesta backend corte caja:", response);
            setVentasDetalles([]);  // limpia tabla
            setTotalVentas(0);      // limpia total
            setModalVisible(false); // cierra modal
        } catch (error) {
            console.error("Error al registrar corte:", error);
            message.error("Error al realizar el corte. Intenta nuevamente.");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Ventas</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 items-center">
                <ConfigProvider locale={esES}>
                    <DatePicker
                        className="h-auto"
                        onChange={onChange}
                        value={selectedDate ? dayjs(selectedDate) : null}
                        format="YYYY-MM-DD"
                    />
                </ConfigProvider>

                <button className="btn btn-outline btn-success" onClick={handleBuscar}>
                    Buscar
                </button>

                <button className="btn btn-outline btn-info" onClick={handleHoy}>
                    Hoy
                </button>
            </div>

            <div className="overflow-x-auto mt-4">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <Spin tip="Cargando ventas..." size="large" />
                    </div>
                ) : (
                    <>
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Fecha</th>
                                    <th>Folio</th>
                                    <th>Método de Pago</th>
                                    <th>Zapato</th>
                                    <th>Cantidad</th>
                                    <th>Total</th> {/* Cambiado aquí */}
                                </tr>
                            </thead>
                            <tbody>
                                {ventasDetalles.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No hay ventas para esta fecha
                                        </td>
                                    </tr>
                                ) : (
                                    ventasDetalles.map((venta, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{venta.fecha}</td>
                                            <td>{venta.folio}</td>
                                            <td>{venta.metodo_pago}</td>
                                            <td>{venta.zapato_descripcion}</td>
                                            <td>{venta.cantidad}</td>
                                            <td>{formatoMoneda(venta.total_detalle)}</td> {/* Mostrar total real */}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <div className="mt-4 font-bold text-lg">
                            Total Ventas: {formatoMoneda(totalVentas)}
                        </div>

                        <div className="mt-2">
                            <button
                                className="btn btn-warning"
                                onClick={handleMostrarCorte}
                                disabled={ventasDetalles.length === 0}
                            >
                                Corte de caja
                            </button>
                        </div>
                    </>
                )}
            </div>

            <ModalCorte
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                resumen={resumenMetodoPago}
                formatoMoneda={formatoMoneda}
                onRealizarCorte={handleRealizarCorte}
            />
        </div>
    );
}
