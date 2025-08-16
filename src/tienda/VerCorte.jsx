import { useState } from "react";
import { DatePicker, ConfigProvider, Spin, Table } from "antd";
import esES from "antd/locale/es_ES";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { obtenerCorteCaja } from "../services/tiendaService";
import { useUser } from "../context/UserContext";

dayjs.locale("es");

export default function VerCorte() {
    const { user } = useUser();
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [corte, setCorte] = useState(null);

    const onChange = (date, dateString) => {
        setSelectedDate(dateString);
    };

    const buscarCorte = async (fecha) => {
        if (!user || !user.usuario_id || !fecha) {
            console.log("Faltan datos para buscar el corte");
            return;
        }

        setLoading(true);
        setCorte(null);

        try {
            const data = await obtenerCorteCaja({
                usuario_id: user.usuario_id,
                fecha,
            });

            setCorte(data.corte ?? null);
        } catch (error) {
            console.error("Error al obtener corte de caja:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuscar = () => {
        if (selectedDate) {
            buscarCorte(selectedDate);
        } else {
            console.log("Falta seleccionar una fecha");
        }
    };

    const handleHoy = () => {
        const today = dayjs().format("YYYY-MM-DD");
        setSelectedDate(today);
        buscarCorte(today);
    };

    const columns = [
        { title: "Sucursal", dataIndex: ["sucursal", "nombre"], key: "sucursal" },
        { title: "Turno", dataIndex: "turno", key: "turno" },
        { title: "Fecha Inicio", dataIndex: "fecha_inicio", key: "fecha_inicio" },
        { title: "Fecha Fin", dataIndex: "fecha_fin", key: "fecha_fin" },
        {
            title: "Total Ventas",
            dataIndex: "total_ventas",
            key: "total_ventas",
            render: (value) => {
                const number = parseFloat(value);
                if (isNaN(number)) return "$0.00";
                return number.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                });
            },
        },
        {
            title: "Detalles",
            dataIndex: "detalles",
            key: "detalles",
            render: (text) => {
                // Convertir "Efectivo $$980.00, Tarjeta $$490.00" → "Efectivo $980.00, Tarjeta $490.00"
                if (!text) return "-";
                return text.replace(/\$\$/g, "$");
            },
        },
    ];


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Cortes de caja</h1>

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

            {loading ? (
                <div className="text-center mt-8">
                    <Spin tip="Cargando corte de caja..." size="large" />
                </div>
            ) : corte ? (
                <Table
                    dataSource={[corte]}
                    columns={columns}
                    pagination={false}
                    rowKey="id"
                />
            ) : (
                <div className="text-gray-500 mt-6">No hay corte registrado para esta fecha.</div>
            )}
        </div>
    );
}
