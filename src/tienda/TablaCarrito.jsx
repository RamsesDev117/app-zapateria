import { useState } from "react";
import { useUser } from "../context/UserContext";
import { notification } from "antd";
import { registrarVentas } from "../services/tiendaService";
import dayjs from "dayjs";

export default function TablaCarrito({ carrito, totalVenta, eliminarDelCarrito, limpiarCarrito }) {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    if (!carrito || carrito.length === 0) return null;

    const generarFolio = () => {
        return `VN-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    };

    const fechaActual = () => {
        return dayjs().format('YYYY-MM-DD'); // 👈 Usa fecha local correctamente
    };

    const registrarVenta = async () => {
        if (carrito.length === 0) {
            console.log("Carrito vacío");
            return;
        }

        try {
            setLoading(true);

            const ventasPorMetodo = carrito.reduce((acc, item) => {
                const metodo = item.metodoPago.toLowerCase();
                if (!acc[metodo]) acc[metodo] = [];
                acc[metodo].push(item);
                return acc;
            }, {});

            const ventas = Object.keys(ventasPorMetodo).map(metodo => {
                const items = ventasPorMetodo[metodo];
                return {
                    folio: generarFolio(),
                    fecha: fechaActual(),
                    usuario_id: user?.usuario_id,
                    venta_sucursal_id: user?.sucursal_id,
                    zapato_sucursal_id: Number(items[0].sucursalId),
                    metodo_pago: metodo,
                    empleado_id: Number(items[0].empleadoId),
                    detalles: items.map(item => ({
                        zapato_id: item.id,
                        cantidad: item.cantidad,
                        precio_unitario: Number(item.precio)
                    }))
                };
            });

            console.log("Ventas a enviar:", JSON.stringify(ventas, null, 2));

            const data = await registrarVentas(ventas);

            notification.success({
                message: 'Ventas registradas',
                description: data.message
            });

            if (typeof limpiarCarrito === "function") {
                limpiarCarrito();
            }

        } catch (error) {
            console.error("Error al registrar ventas:", error);

            if (error.response) {
                const data = error.response.data;
                if (data.error) {
                    notification.error({
                        message: 'Error',
                        description: data.error
                    });
                } else {
                    notification.error({
                        message: 'Error',
                        description: JSON.stringify(data, null, 2)
                    });
                }
            } else {
                notification.error({
                    message: 'Error',
                    description: error.message
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-xl font-bold mt-8 mb-4">Carrito de venta</h2>
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Calzado</th>
                        <th>Talla</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                        <th>De dónde</th>
                        <th>Quién lo trajo</th>
                        <th>Método de pago</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {carrito.map((item, idx) => (
                        <tr key={idx}>
                            <td>{item.id}</td>
                            <td>{item.marca} - {item.modelo} - {item.material} - {item.color}</td>
                            <td>{item.talla}</td>
                            <td>{item.cantidad}</td>
                            <td>${item.precio}</td>
                            <td>${item.precio * item.cantidad}</td>
                            <td>{item.sucursalNombre}</td>
                            <td>{item.empleadoNombre}</td>
                            <td>{item.metodoPago}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-outline btn-error"
                                    onClick={() => eliminarDelCarrito(idx)}
                                    disabled={loading}
                                >
                                    Quitar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-right mt-4">
                <strong>Total: ${totalVenta}</strong>
            </div>
            <div className="flex justify-end mt-4">
                <button
                    className="btn btn-success flex items-center"
                    onClick={registrarVenta}
                    disabled={loading}
                >
                    {loading && <span className="loading loading-spinner loading-sm mr-2"></span>}
                    {loading ? "Registrando..." : "Registrar venta"}
                </button>
            </div>
        </>
    );
}
