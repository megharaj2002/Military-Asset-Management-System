import { useEffect, useState } from 'react';
import api from '../api';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState([]);
    const [filters, setFilters] = useState({ startDate: '', endDate: '', assetType: '' });
    const [showModal, setShowModal] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState(null);

    const fetchDashboard = async () => {
        try {
            const params = new URLSearchParams(filters);
            const res = await api.get(`/dashboard?${params.toString()}`);
            setDashboardData(res.data.dashboard);
        } catch (err) {
            console.error('Dashboard fetch failed:', err.message);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const getTotal = (key) => dashboardData.reduce((acc, item) => acc + (item[key] || 0), 0);

    const openModal = (metric) => {
        setSelectedMetric(metric);
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-military-900 uppercase tracking-wide">Command Dashboard</h2>

                <div className="flex space-x-4 mt-4 md:mt-0">
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-military-accent outline-none"
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-military-accent outline-none"
                    />
                    <select
                        name="assetType"
                        value={filters.assetType}
                        onChange={handleFilterChange}
                        className="p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-military-accent outline-none"
                    >
                        <option value="">All Assets</option>
                        <option value="Rifle">Rifle</option>
                        <option value="Ammo">Ammo</option>
                        <option value="Vehicle">Vehicle</option>
                    </select>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Opening Balance" value={getTotal('openingBalance')} icon="📦" />
                <Card
                    title="Net Movement"
                    value={getTotal('netMovement')}
                    icon="⇄"
                    onClick={() => openModal('netMovement')}
                    isActionable
                />
                <Card title="Assigned" value={getTotal('assigned')} icon="🛡️" />
                <Card title="Closing Balance" value={getTotal('closingBalance')} icon="🏁" />
            </div>

            {/* Detailed Table */}
            <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-military-800 px-6 py-4 border-b border-military-700">
                    <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Inventory Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-3">Asset Type</th>
                                <th className="px-6 py-3">Opening</th>
                                <th className="px-6 py-3 text-green-600">Purchases (+)</th>
                                <th className="px-6 py-3 text-blue-600">Transfer In (+)</th>
                                <th className="px-6 py-3 text-orange-600">Transfer Out (-)</th>
                                <th className="px-6 py-3">Assigned</th>
                                <th className="px-6 py-3">Expended</th>
                                <th className="px-6 py-3 font-bold">Closing</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {dashboardData.map((item) => (
                                <tr key={item.assetType} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.assetType}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.openingBalance}</td>
                                    <td className="px-6 py-4 text-green-600 font-semibold">{item.purchases}</td>
                                    <td className="px-6 py-4 text-blue-600">{item.transferIn}</td>
                                    <td className="px-6 py-4 text-orange-600">{item.transferOut}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.assigned}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.expended}</td>
                                    <td className="px-6 py-4 font-bold text-military-900">{item.closingBalance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-xl font-bold text-military-900">Net Movement Details</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-100">
                                <span className="text-green-800 font-medium">Total Purchases</span>
                                <span className="text-xl font-bold text-green-700">+{getTotal('purchases')}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-100">
                                <span className="text-blue-800 font-medium">Total Transfers In</span>
                                <span className="text-xl font-bold text-blue-700">+{getTotal('transferIn')}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-orange-50 rounded border border-orange-100">
                                <span className="text-orange-800 font-medium">Total Transfers Out</span>
                                <span className="text-xl font-bold text-orange-700">-{getTotal('transferOut')}</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between items-center">
                                <span className="font-bold text-gray-700">Net Change</span>
                                <span className={`text-2xl font-bold ${getTotal('netMovement') >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {getTotal('netMovement') > 0 ? '+' : ''}{getTotal('netMovement')}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 text-right">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Card = ({ title, value, icon, onClick, isActionable }) => (
    <div
        onClick={onClick}
        className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between transition-all duration-200 ${isActionable ? 'cursor-pointer hover:shadow-md hover:border-military-accent group' : ''}`}
    >
        <div>
            <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">{title}</p>
            <h3 className={`text-3xl font-bold mt-1 ${isActionable ? 'group-hover:text-military-accent' : 'text-military-900'}`}>{value}</h3>
        </div>
        <div className={`text-4xl opacity-20 ${isActionable ? 'group-hover:opacity-40 group-hover:scale-110 transition-all' : ''}`}>
            {icon}
        </div>
    </div>
);

export default Dashboard;
