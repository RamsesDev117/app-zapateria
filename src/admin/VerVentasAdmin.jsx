import { useState } from "react";
import { DatePicker, ConfigProvider, notification, Spin } from "antd";
import esES from "antd/locale/es_ES";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { getVentasSucursal } from "../services/adminService";

function formatoMoneda(valor) {
    return Number(valor).toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
    });
}

export default function VerVentasAdmin() {
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [sucursalId, setSucursalId] = useState("");
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalVentas, setTotalVentas] = useState(0);

    const [paginaActual, setPaginaActual] = useState(1);
    const filasPorPagina = 6;

    // Arreglo plano combinando venta + detalle para la tabla
    const ventasDetalles = ventas.flatMap((venta) =>
        venta.detalles.map((detalle) => ({
            id: detalle.id,
            fecha: venta.fecha,
            folio: venta.folio,
            metodo_pago: venta.metodo_pago.toUpperCase(),
            zapato_descripcion: detalle.zapato
                ? `${detalle.zapato.marca} ${detalle.zapato.modelo} ${detalle.zapato.material} ${detalle.zapato.color} ${detalle.zapato.talla}`
                : "N/D",
            cantidad: detalle.cantidad,
            total_detalle: detalle.precio_unitario,
        }))
    );

    // Calcular índice inicial y final para la página actual
    const indiceUltimaFila = paginaActual * filasPorPagina;
    const indicePrimeraFila = indiceUltimaFila - filasPorPagina;

    // Datos a mostrar en la página actual
    const datosPaginados = ventasDetalles.slice(indicePrimeraFila, indiceUltimaFila);

    // Número total de páginas
    const totalPaginas = Math.ceil(ventasDetalles.length / filasPorPagina);

    const onBuscar = async () => {
        if (!sucursalId || !fechaInicio || !fechaFin) {
            notification.error({ message: "Por favor, completa todos los campos." });
            return;
        }

        setLoading(true);
        setPaginaActual(1); // resetear a primera página cuando busques

        try {
            const data = await getVentasSucursal({
                sucursal_id: sucursalId,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
            });

            setVentas(data.ventas);
            setTotalVentas(data.total_ventas ?? 0);
        } catch (error) {
            notification.error({
                message: "Error al obtener las ventas",
                description: error.message || "Intenta nuevamente.",
            });
            setVentas([]);
            setTotalVentas(0);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Ventas</h1>

            <div className="flex flex-row gap-4 mb-6">
                <select
                    className="select w-48"
                    value={sucursalId}
                    onChange={(e) => setSucursalId(e.target.value)}
                >
                    <option value="">Seleccione sucursal</option>
                    <option value="2">Tienda 1</option>
                    <option value="3">Tienda 2</option>
                </select>

                <ConfigProvider locale={esES}>
                    <DatePicker
                        className="h-auto"
                        onChange={(date, dateString) => setFechaInicio(dateString)}
                        value={fechaInicio ? dayjs(fechaInicio) : null}
                        format="YYYY-MM-DD"
                        placeholder="Fecha inicio"
                    />
                </ConfigProvider>

                <ConfigProvider locale={esES}>
                    <DatePicker
                        className="h-auto"
                        onChange={(date, dateString) => setFechaFin(dateString)}
                        value={fechaFin ? dayjs(fechaFin) : null}
                        format="YYYY-MM-DD"
                        placeholder="Fecha fin"
                    />
                </ConfigProvider>

                <button className="btn btn-outline btn-success" onClick={onBuscar}>
                    Buscar
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center">
                    <Spin tip="Cargando ventas..." />
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
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosPaginados.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No hay ventas para esta fecha
                                    </td>
                                </tr>
                            ) : (
                                datosPaginados.map((venta, index) => (
                                    <tr key={venta.id}>
                                        <td>{indicePrimeraFila + index + 1}</td>
                                        <td>{venta.fecha}</td>
                                        <td>{venta.folio}</td>
                                        <td>{venta.metodo_pago}</td>
                                        <td>{venta.zapato_descripcion}</td>
                                        <td>{venta.cantidad}</td>
                                        <td>{formatoMoneda(venta.total_detalle)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    {ventasDetalles.length > filasPorPagina && (
                        <div className="mt-4 flex justify-center gap-2">
                            <button
                                className="btn btn-sm"
                                onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                                disabled={paginaActual === 1}
                            >
                                Anterior
                            </button>

                            {[...Array(totalPaginas)].map((_, i) => (
                                <button
                                    key={i}
                                    className={`btn btn-sm ${paginaActual === i + 1 ? "btn-primary" : "btn-outline"}`}
                                    onClick={() => setPaginaActual(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                className="btn btn-sm"
                                onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
                                disabled={paginaActual === totalPaginas}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}

                    <div className="mt-4 font-bold text-lg">
                        Total Ventas: {formatoMoneda(totalVentas)}
                    </div>
                </>
            )}
        </div>
    );
}
