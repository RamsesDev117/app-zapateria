import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {
    FaUserPlus,
    FaChartLine,
    FaCashRegister,
    FaBookmark,
    FaFire,
    FaBoxOpen,
    FaPlus,
    FaEye,
    FaCalculator,
    FaWarehouse,
    FaStar,
    FaStore,
    FaUser,
    FaSignOutAlt
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../css/sidebar.css';

export default function SideBar() {
    const navigate = useNavigate();
    const { user, logoutUser } = useUser();

    return (
        <Sidebar
            backgroundColor="#2c3e50"
            rootStyles={{
                height: '100vh',
                color: '#FFFFFF',
                position: 'relative',
            }}
        >
            {/* Encabezado */}
            <div className="sidebar-header">
                <FaStore size={24} />
                <span>Zapatería Truth</span>
            </div>

            {/* Menú principal */}
            <Menu
                menuItemStyles={{
                    button: ({ level }) => ({
                        color: '#FFFFFF',
                        backgroundColor: level === 0 ? 'transparent' : '#34495e',
                        '&:hover': {
                            backgroundColor: level === 0 ? '#2C2C40' : '#3c5a72'
                        }
                    }),
                    label: {
                        fontSize: '16px',
                        paddingLeft: '10px'
                    }
                }}
            >
                {/* ADMINISTRADOR */}
                {(user?.rol_id === 1 || user?.rol_id === 2) && (
                    <>
                        <div className="sidebar-category">ADMINISTRADOR</div>
                        <SubMenu label="Usuarios" icon={<FaUser />}>
                            <MenuItem icon={<FaUserPlus />} component={<Link to="/dashboard/usuarios/registrar" />}>Registrar usuarios</MenuItem>
                            <MenuItem icon={<FaEye />} component={<Link to="/dashboard/usuarios/ver" />}>Ver usuarios</MenuItem>
                        </SubMenu>
                        <SubMenu label="Reportes" icon={<FaChartLine />}>
                            <MenuItem icon={<FaCashRegister />} component={<Link to="/dashboard/admin/ver-ventas" />}> Ventas </MenuItem>
                            <MenuItem icon={<FaBoxOpen />} component={<Link to="/dashboard/admin/ver-inventario" />}> Inventario </MenuItem>
                        </SubMenu>
                    </>
                )}

                {/* EMPLEADO DE TIENDA */}
                {(user?.rol_id === 1 || user?.rol_id === 2 || user?.rol_id === 3) && (
                    <>
                        <div className="sidebar-category">EMPLEADO DE TIENDA</div>
                        <SubMenu label="Ventas" icon={<FaCashRegister />}>
                            <MenuItem icon={<FaPlus />} component={<Link to="/dashboard/tienda/registar-venta" />}> Registrar venta </MenuItem>
                            <MenuItem icon={<FaEye />} component={<Link to="/dashboard/tienda/ver-ventas" />}> Ver ventas </MenuItem>
                        </SubMenu>
                        <SubMenu label="Apartados" icon={<FaBookmark />}>
                            <MenuItem icon={<FaPlus />} component={<Link to="/dashboard/tienda/registrar-apartado" />}> Registrar apartado </MenuItem>
                            <MenuItem icon={<FaEye />} component={<Link to="/dashboard/tienda/ver-apartados" />}> Ver apartados </MenuItem>
                        </SubMenu>
                        <SubMenu label="Corte de caja" icon={<FaCalculator />}>
                            <MenuItem icon={<FaEye />} component={<Link to="/dashboard/tienda/ver-corte" />}> Ver cortes </MenuItem>
                        </SubMenu>
                    </>
                )}

                {/* EMPLEADO DE BODEGA */}
                {(user?.rol_id === 1 || user?.rol_id === 2 || user?.rol_id === 4) && (
                    <>
                        <div className="sidebar-category">EMPLEADO DE BODEGA</div>
                        <SubMenu label="Inventario" icon={<FaWarehouse />}>
                            <MenuItem icon={<FaPlus />} component={<Link to="/dashboard/bodega/registar-zapatos" />}> Registrar zapatos </MenuItem>
                            <MenuItem icon={<FaPlus />} component={<Link to="/dashboard/bodega/registrar-inventario" />} > Registrar inventario </MenuItem>
                            <MenuItem icon={<FaEye />} component={<Link to="/dashboard/bodega/ver-inventario" />}> Ver Inventario </MenuItem>
                        </SubMenu>
                        <SubMenu label="Puntos" icon={<FaStar />}>
                            <MenuItem icon={<FaEye />} component={<Link to="/dashboard/bodega/ver-puntos" />}> Ver puntos </MenuItem>
                        </SubMenu>
                    </>
                )}
            </Menu>

            {/* Footer */}
            <div className="sidebar-footer">
                <Menu
                    menuItemStyles={{
                        button: {
                            color: '#FFFFFF',
                            '&:hover': {
                                backgroundColor: '#2C2C40'
                            }
                        },
                        label: {
                            fontSize: '16px',
                            paddingLeft: '10px'
                        }
                    }}
                >
                    <MenuItem icon={<FaUser />}> Perfil </MenuItem>
                    <MenuItem
                        icon={<FaSignOutAlt />}
                        onClick={() => {
                            logoutUser(); // limpia el contexto y localStorage
                            navigate("/"); // o a "/login"
                        }}
                    >
                        Cerrar sesión
                    </MenuItem>
                </Menu>
            </div>
        </Sidebar >
    );
}
