import React from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Unauthorized({ emp_data }) {

    const logout = () => {
        const token = localStorage.getItem("authify-token");
        localStorage.removeItem("authify-token");
        router.get(route("logout"));
        window.location.href = `http://192.168.2.221/authify/public/logout?key=${encodeURIComponent(
            token
        )}&redirect=${encodeURIComponent(route("dashboard"))}`;
    };

    return (
        <>
            <Head title="Unauthorized" />
             <nav className="">
            <div className="px-4 mx-auto sm:px-6 lg:px-8">
                <div className="flex justify-end h-[50px] ">
                    <div className="items-center hidden mr-5 space-x-1 font-semibold md:flex">
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="flex items-center m-1 space-x-2 cursor-pointer select-none"
                            >
                                </div>
                                    <button onClick={logout}>
                                        <span className="mt-[3px] mr-2  text-sky-400">
                                            Log out
                                        </span>
                                        <i className="fa fa-sign-out text-[15pt] text-sky-400"></i>
                                    </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

            <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                    <h1 className="text-[20pt] text-gray-800 dark:text-red-100 mb-0">
                         Hello, {emp_data?.emp_firstname} Your are
                    </h1>
                    <h1 className="text-[60pt] font-bold text-gray-800 dark:text-red-400 mb-0">
                        Access denied !
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-red-100 mb-6">
                        You do not have the necessary authorization to access this system.
                    </p>
                </div>
            </div>
        </>
    );
}
