"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDark]);

    return (
        <header className="fixed top-0 left-0 w-full h-14 bg-white dark:bg-zinc-900 px-6 flex items-center justify-between z-50 transition-colors duration-300">
            <button aria-label="채팅 목록 열기">
                <FontAwesomeIcon icon={faBars} className="text-2xl text-gray-800 dark:text-white" />
            </button>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsDark(!isDark)}
                    className="text-xl text-gray-700 dark:text-white"
                    aria-label="다크모드"
                >
                    <FontAwesomeIcon
                        icon={isDark ? faSun : faMoon}
                        className="text-yellow-500 dark:text-blue-400 text-xl"
                    />
                </button>

            </div>
        </header>
    );
}
