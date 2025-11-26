import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role, onLogout }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'commander', 'logistics'] },
        { path: '/purchase', label: 'Purchases', icon: '🛒', roles: ['admin'] },
        { path: '/transfer', label: 'Transfers', icon: '⇄', roles: ['admin', 'logistics'] },
        { path: '/assignment', label: 'Assignments', icon: '📋', roles: ['admin', 'logistics'] },
        { path: '/logs', label: 'Audit Logs', icon: '📜', roles: ['admin'] },
    ];

    return (
        <div className="h-screen w-64 bg-military-900 text-white flex flex-col shadow-2xl fixed left-0 top-0 overflow-y-auto">
            <div className="p-6 border-b border-military-700">
                <h1 className="text-2xl font-bold tracking-wider text-military-accent uppercase">MAMS</h1>
                <p className="text-xs text-gray-400 mt-1">Military Asset Management</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    item.roles.includes(role) && (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive(item.path)
                                    ? 'bg-military-accent text-white shadow-lg'
                                    : 'text-gray-300 hover:bg-military-800 hover:text-white'
                                }`}
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                            <span className="font-medium tracking-wide">{item.label}</span>
                        </Link>
                    )
                ))}
            </nav>

            <div className="p-4 border-t border-military-700">
                <div className="mb-4 px-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Logged in as</p>
                    <p className="text-sm font-bold text-white capitalize">{role}</p>
                </div>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center space-x-2 bg-red-900/50 hover:bg-red-800 text-red-200 py-2 rounded-md transition-colors border border-red-900"
                >
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
