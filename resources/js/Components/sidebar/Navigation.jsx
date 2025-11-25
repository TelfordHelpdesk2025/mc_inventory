import Dropdown from "@/Components/sidebar/Dropdown";
import SidebarLink from "@/Components/sidebar/SidebarLink";
import { usePage } from "@inertiajs/react";

export default function NavLinks() {
    const { emp_data } = usePage().props;
    return (
        <nav
            className="flex flex-col flex-grow space-y-1 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
        >
            <SidebarLink
                href={route("dashboard")}
                label="Dashboard"
                icon={
                    <i className="fas fa-tachometer-alt"></i>
                }
               
            />
            <SidebarLink
                href={route("machine.list")}
                label="Machine List"
                icon={
                   <i className="fas fa-gear"></i>
                }
                        // notifications={5}
            />

            <SidebarLink
                href={route("harddown.index")}
                label="Hard Down List"
                icon={
                   <i className="fa-solid fa-down-left-and-up-right-to-center"></i>
                }
                        // notifications={5}
            />

            <SidebarLink
                href={route("writeoff.index")}
                label="Write Off Machines"
                icon={
                   <i className="fa-solid fa-ban"></i>
                }
                        // notifications={5}
            />
            

            {["superadmin", "admin"].includes(emp_data?.emp_system_role) && (
                <div>
                    <SidebarLink
                        href={route("admin")}
                        label="Administrators"
                        icon={<i className="fa-solid fa-user-tie"></i>}
                        // notifications={5}
                    />
                </div>
            )}
        </nav>
    );
}
