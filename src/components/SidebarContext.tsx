import { createContext, useContext, useState } from "react";

type ChatItem = {
    id: string;
    title: string;
};

type SidebarContextType = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export default function SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <SidebarContext.Provider
            value={{
                isOpen,
                open: () => setIsOpen(true),
                close: () => setIsOpen(false),
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error("sidebar 에러");
    return ctx;
};
