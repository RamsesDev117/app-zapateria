import { useState, useEffect } from "react";
import { postZapatos } from "../services/bodegaService";

export default function RegistrarZapato() {
    const [zapato, setZapato] = useState({
        tipo: "",
        marca: "",
        modelo: "",
        material: "",
        color: "",
        precio: "",
        imagen: "",
        estado: "ACTIVO"
    });

    const [tallas, setTallas] = useState([""]);
    const [loading, setLoading] = useState(false);

    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info"); // success | error | info

    useEffect(() => {
        if (alertMessage !== "") {
            const timer = setTimeout(() => {
                setAlertMessage("");
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setZapato({
            ...zapato,
            [name]: value
        });
    };

    const handleTallaChange = (index, value) => {
        const nuevasTallas = [...tallas];
        nuevasTallas[index] = value;
        setTallas(nuevasTallas);
    };

    const agregarTalla = () => {
        setTallas([...tallas, ""]);
    };

    const handleSubmit = async () => {
        const { marca, modelo, material, color } = zapato;

        const datosPorTalla = tallas.map(talla => {
            const codigo = [
                (marca.slice(0, 3) || "").toUpperCase(),
                (modelo || "").toUpperCase(),
                (material.slice(0, 3) || "").toUpperCase(),
                (color.slice(0, 3) || "").toUpperCase(),
                (talla || "")
            ].join("-");

            return {
                ...zapato,
                talla,
                codigo
            };
        });

        console.log("Payload que se enviará al backend:", datosPorTalla);

        setLoading(true);
        try {
            const response = await postZapatos(datosPorTalla);
            console.log("Respuesta del backend:", response);

            setAlertType("success");
            setAlertMessage("Zapatos registrados correctamente");

            setZapato({
                tipo: "",
                marca: "",
                modelo: "",
                material: "",
                color: "",
                precio: "",
                imagen: "",
                estado: "ACTIVO"
            });
            setTallas([""]);
        } catch (error) {
            console.error("Error al registrar zapatos:", error);

            if (error.response) {
                console.log("Respuesta del servidor:", error.response.data);
                setAlertType("error");
                setAlertMessage("Error: " + JSON.stringify(error.response.data.errors));
            } else {
                setAlertType("error");
                setAlertMessage("Ocurrió un error al registrar los zapatos");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-4 p-4">
                <h1 className="font-bold text-xl">Registrar zapatos</h1>

                <div className="flex flex-col w-52">
                    <label className="text-sm font-semibold mb-1">Tipo de zapato</label>
                    <select
                        name="tipo"
                        value={zapato.tipo}
                        onChange={handleChange}
                        className="select"
                    >
                        <option value="">Seleccione</option>
                        <option>Zapato de piso</option>
                        <option>Zapatillas</option>
                        <option>Plataformas</option>
                        <option>Sandalias</option>
                        <option>Botas</option>
                    </select>
                </div>

                <div className="flex flex-row gap-4">
                    <div className="flex flex-col w-72">
                        <label className="text-sm font-semibold mb-1">Marca</label>
                        <input
                            type="text"
                            name="marca"
                            value={zapato.marca}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col w-72">
                        <label className="text-sm font-semibold mb-1">Modelo</label>
                        <input
                            type="text"
                            name="modelo"
                            value={zapato.modelo}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col w-72">
                        <label className="text-sm font-semibold mb-1">Material</label>
                        <input
                            type="text"
                            name="material"
                            value={zapato.material}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-4">
                    <div className="flex flex-col w-72">
                        <label className="text-sm font-semibold mb-1">Color</label>
                        <input
                            type="text"
                            name="color"
                            value={zapato.color}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold mb-1">Tallas</label>
                    <div className="flex flex-wrap gap-2">
                        {tallas.map((talla, index) => (
                            <input
                                key={index}
                                type="text"
                                value={talla}
                                onChange={(e) => handleTallaChange(index, e.target.value)}
                                className="input w-32"
                            />
                        ))}
                        <button
                            onClick={agregarTalla}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 h-10"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="flex flex-col w-32">
                    <label className="text-sm font-semibold mb-1">Precio</label>
                    <input
                        type="number"
                        name="precio"
                        value={zapato.precio}
                        onChange={handleChange}
                        className="input"
                    />
                </div>

                <div className="fixed bottom-4 right-4 flex items-center gap-4">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>

                    {loading && (
                        <span className="loading loading-dots loading-lg text-blue-600"></span>
                    )}
                </div>
            </div>

            {alertMessage && (
                <div className={`alert alert-${alertType} fixed top-4 right-4 w-auto shadow-lg`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6"
                        fill="none" viewBox="0 0 24 24">
                        {alertType === "success" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M5 13l4 4L19 7" />}
                        {alertType === "error" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12" />}
                        {alertType === "info" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M12 19h.01" />}
                    </svg>
                    <span>{alertMessage}</span>
                    <button onClick={() => setAlertMessage("")} className="ml-2 btn btn-sm btn-ghost">✕</button>
                </div>
            )}
        </>
    );
}
