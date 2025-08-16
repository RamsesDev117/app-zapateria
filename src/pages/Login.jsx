import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, notification } from "antd";
import { login } from "../services/authService";
import { useUser } from "../context/UserContext";

export default function Login() {
    const navigate = useNavigate();
    const { loginUser } = useUser();

    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    const handleLogin = async () => {
        if (!usuario.trim() || !password.trim()) {
            setMostrarAlerta(true);
            return;
        }

        setMostrarAlerta(false);
        setLoading(true);

        try {
            const data = await login(usuario, password);

            loginUser(data);

            notification.success({
                message: 'Sesión iniciada',
                description: `Bienvenido, ${data.usuario.nombre}`,
                placement: 'topRight',
            });

            navigate("/dashboard");
        } catch (error) {
            notification.error({
                message: 'Error de autenticación',
                description:
                    error.response?.data?.message || 'Credenciales inválidas o error del servidor.',
                placement: 'topRight',
                duration: 4,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fdf2f5] via-white to-[#f6dfe4] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 border border-[#e7c3cb]">
                <div className="flex flex-col items-center mb-4">
                    <h1 className="text-3xl font-bold text-[#9F2241]">Bienvenido</h1>
                    <p className="text-sm text-gray-600 mt-1">Inicia sesión para continuar</p>
                </div>

                {mostrarAlerta && (
                    <Alert
                        message="Campos vacíos"
                        description="Por favor, completa todos los campos antes de continuar."
                        type="warning"
                        showIcon
                        closable
                        className="mb-4"
                        onClose={() => setMostrarAlerta(false)}
                    />
                )}

                <fieldset className="fieldset">
                    <label className="font-bold">Usuario</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />

                    <label className="font-bold mt-2">Contraseña</label>
                    <input
                        type="password"
                        className="input input-bordered w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        disabled={loading}
                        onClick={handleLogin}
                        className={`w-full py-2 mt-4 rounded-lg font-semibold text-white transition shadow ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#9F2241] hover:bg-[#7d1b34]"
                            }`}
                    >
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                </fieldset>
            </div>
        </div>
    );
}
