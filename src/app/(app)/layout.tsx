import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <Sidebar appName="FamilyHub">
                {children}
            </Sidebar>
        </div>
    );
}
