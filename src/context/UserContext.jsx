import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Cargar datos del usuario desde localStorage al iniciar la app
        const token = localStorage.getItem('token');
        const rol_id = localStorage.getItem('rol_id');
        const sucursal_id = localStorage.getItem('sucursal_id');
        const usuario_id = localStorage.getItem('usuario_id');
        const nombre_usuario = localStorage.getItem('nombre');

        if (token && rol_id) {
            setUser({
                token,
                rol_id: parseInt(rol_id),
                sucursal_id: parseInt(sucursal_id),
                usuario_id: parseInt(usuario_id),
                nombre_usuario,
            });
        }
    }, []);

    const loginUser = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario_id', data.usuario.id);
        localStorage.setItem('rol_id', data.usuario.rol_id);
        localStorage.setItem('sucursal_id', data.usuario.sucursal_id);
        localStorage.setItem('nombre', data.usuario.nombre);

        setUser({
            token: data.token,
            rol_id: data.usuario.rol_id,
            sucursal_id: data.usuario.sucursal_id,
            usuario_id: data.usuario.id,
            nombre_usuario: data.usuario.nombre,
        });
    };

    const logoutUser = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
