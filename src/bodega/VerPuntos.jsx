import { useState, useEffect } from "react";
import { DatePicker, ConfigProvider, notification, Spin } from "antd";
import esES from "antd/locale/es_ES";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { getEmpBodega, getPuntoBodega } from "../services/bodegaService";

export default function VerPuntos() {
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [empleados, setEmpleados] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("");
    const [loadingEmpleados, setLoadingEmpleados] = useState(true);
    const [loadingPuntos, setLoadingPuntos] = useState(false);
    const [puntosData, setPuntosData] = useState([]);

    // Cargar empleados al montar
    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                setLoadingEmpleados(true);
                const data = await getEmpBodega();
                setEmpleados(data);
            } catch (error) {
                notification.error({
                    message: "Error",
                    description: "No se pudieron cargar los empleados.",
                });
            } finally {
                setLoadingEmpleados(false);
            }
        };
        fetchEmpleados();
    }, []);

    // Buscar puntos
    const handleBuscar = async () => {
        if (!fechaInicio || !fechaFin || !empleadoSeleccionado) {
            notification.warning({
                message: "Campos incompletos",
                description: "Debes seleccionar fechas y un empleado.",
            });
            return;
        }

        try {
            setLoadingPuntos(true);
            const data = await getPuntoBodega({
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                usuario_id: empleadoSeleccionado,
            });
            setPuntosData(data.data || []);
        } catch (error) {
            notification.error({
                message: "Error",
                description: "No se pudieron cargar los puntos.",
            });
        } finally {
            setLoadingPuntos(false);
        }
    };

    // Calcular total de puntos
    const totalPuntos = puntosData.reduce((acc, curr) => acc + curr.puntos, 0);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Puntos</h1>

            <div className="flex flex-row gap-4 items-center mb-6">
                {/* Select empleados */}
                <select
                    value={empleadoSeleccionado}
                    onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                    className="select w-48"
                    disabled={loadingEmpleados}
                >
                    {loadingEmpleados ? (
                        <option value="">⏳ Cargando empleados...</option>
                    ) : (
                        <>
                            <option value="">Seleccionar empleado</option>
                            {empleados.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.nombre}
                                </option>
                            ))}
                        </>
                    )}
                </select>

                {/* Fecha inicio */}
                <ConfigProvider locale={esES}>
                    <DatePicker
                        className="h-auto"
                        onChange={(date, dateString) => setFechaInicio(dateString)}
                        value={fechaInicio ? dayjs(fechaInicio) : null}
                        format="YYYY-MM-DD"
                        placeholder="Fecha inicio"
                    />
                </ConfigProvider>

                {/* Fecha fin */}
                <ConfigProvider locale={esES}>
                    <DatePicker
                        className="h-auto"
                        onChange={(date, dateString) => setFechaFin(dateString)}
                        value={fechaFin ? dayjs(fechaFin) : null}
                        format="YYYY-MM-DD"
                        placeholder="Fecha fin"
                    />
                </ConfigProvider>

                {/* Botón buscar */}
                <button
                    className="btn btn-outline btn-success"
                    onClick={handleBuscar}
                    disabled={loadingPuntos}
                >
                    {loadingPuntos ? <Spin size="small" /> : "Buscar"}
                </button>
            </div>

            {/* Tabla DaisyUI */}
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Día</th>
                            <th>Puntos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {puntosData.length > 0 ? (
                            puntosData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.fecha}</td>
                                    <td>{dayjs(item.fecha).format("dddd")}</td>
                                    <td>{item.puntos}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">
                                    {loadingPuntos ? "Cargando..." : "Sin datos"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {puntosData.length > 0 && (
                        <tfoot>
                            <tr>
                                <td colSpan="2" className="font-bold text-right">
                                    Total
                                </td>
                                <td className="font-bold">{totalPuntos}</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
}
