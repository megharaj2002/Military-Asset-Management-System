import Sidebar from './Sidebar';

const Layout = ({ children, role, onLogout }) => {
    return (
        <div className="flex min-h-screen bg-military-bg">
            <Sidebar role={role} onLogout={onLogout} />
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
