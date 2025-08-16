import { Modal, Button, DatePicker, ConfigProvider, message, Spin } from "antd";
import { useUser } from "../context/UserContext";
import esES from "antd/locale/es_ES";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useState } from "react";

dayjs.locale("es");

export default function ModalCorte({ visible, onClose, resumen, formatoMoneda, onRealizarCorte }) {
    const { user } = useUser();

    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaSalida, setFechaSalida] = useState(null);
    const [turno, setTurno] = useState("");
    const [loading, setLoading] = useState(false);

    const nombresSucursales = {
        2: "Tienda 1",
        3: "Tienda 2",
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const handleRealizarCorte = async () => {
        if (!fechaInicio || !fechaSalida) {
            message.warning("Por favor selecciona ambas fechas.");
            return;
        }

        if (!turno || turno === "Turno") {
            message.warning("Por favor selecciona un turno válido.");
            return;
        }

        let totalVentas = 0;
        const detalles = resumen.length > 0
            ? resumen.map(item => {
                totalVentas += parseFloat(item.total);
                return `${capitalize(item.metodo_pago)} $${formatoMoneda(item.total, false)}`;
            }).join(", ")
            : "Sin detalles";

        const data = {
            usuario_id: user?.usuario_id,
            corte_sucursal_id: user?.sucursal_id,
            turno: turno.toUpperCase(),
            fecha_inicio: fechaInicio.format("YYYY-MM-DD HH:mm"),
            fecha_fin: fechaSalida.format("YYYY-MM-DD HH:mm"),
            detalles,
            total_ventas: totalVentas
        };

        try {
            setLoading(true);
            await onRealizarCorte(data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Corte de Caja"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            {resumen.length === 0 ? (
                <p>No hay ventas para mostrar.</p>
            ) : (
                <>
                    <div className="mb-4 text-sm text-gray-500">
                        <p><strong>Usuario:</strong> {user?.nombre_usuario}</p>
                        <p><strong>Sucursal:</strong> {nombresSucursales[user?.sucursal_id] || "Sucursal desconocida"}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                        <select value={turno} onChange={(e) => setTurno(e.target.value)} className="select">
                            <option>Turno</option>
                            <option>Matutino</option>
                            <option>Vespertino</option>
                        </select>
                    </div>

                    <ConfigProvider locale={esES}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Fecha y hora de inicio:</label>
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                value={fechaInicio}
                                onChange={setFechaInicio}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Fecha y hora de salida:</label>
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                value={fechaSalida}
                                onChange={setFechaSalida}
                            />
                        </div>
                    </ConfigProvider>

                    <ul className="space-y-2 mb-4">
                        {resumen.map((item, index) => (
                            <li key={index} className="flex justify-between border-b pb-1">
                                <span className="capitalize">{item.metodo_pago}</span>
                                <span>{formatoMoneda(item.total)}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="text-right">
                        <Button 
                            type="primary" 
                            onClick={handleRealizarCorte} 
                            disabled={loading}
                        >
                            {loading ? <Spin size="small" /> : "Realizar corte de caja"}
                        </Button>
                    </div>
                </>
            )}
        </Modal>
    );
}
