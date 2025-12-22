import { ReactNode } from "react";

interface AppBorderProps {
    children: ReactNode;
}

export default function AppBorder({ children }: AppBorderProps) {
    return (
        <div className="border-[#404040] border-[6px] border-solid w-screen h-screen box-border flex flex-col overflow-hidden">
            {children}
        </div>
    );
}