import { Outlet } from 'react-router-dom';
import SideBar from "../components/Sidebar"

export default function Dashboard() {
    return (
        <>
            <div className="flex flex-row gap-5">
                <div>
                    <SideBar />
                </div>
                <div className="m-4">
                    <Outlet />
                </div>
            </div>
        </>
    )
}