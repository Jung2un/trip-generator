"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useSidebar } from "@/context/SidebarContext";

export default function Header() {
    const [isDark, setIsDark] = useState(true);
    const { isOpen, open, close } = useSidebar();

    const sidebarState = () => {
        if (isOpen) {
            close();
        } else {
            open();
        }
    };

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDark]);

    return (
        <header className="fixed top-0 left-0 w-full h-14 bg-white dark:bg-zinc-900 px-6 flex items-center justify-between z-50 transition-colors duration-300">
            <button onClick={sidebarState}>
                <FontAwesomeIcon icon={faBars} className="text-2xl text-gray-800 dark:text-white" />
            </button>

            <div className="flex items-center gap-4">
                <button onClick={() => setIsDark(!isDark)} className="text-xl text-gray-700 dark:text-white">
                    <FontAwesomeIcon
                        icon={isDark ? faSun : faMoon}
                        className="text-yellow-500 dark:text-blue-400 text-xl"
                    />
                </button>
            </div>
        </header>
    );
}
