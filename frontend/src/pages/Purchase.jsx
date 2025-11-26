import { useState, useEffect } from 'react';
import api from "../api";

const Purchase = () => {
    const [assetType, setAssetType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([]);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/purchases', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch history");
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handlePurchase = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await api.post(
                '/purchases',
                { assetType, quantity: Number(quantity) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage(res.data.message);
            setAssetType('');
            setQuantity('');
            fetchHistory(); // Refresh history
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error occurred');
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-military-900 mb-6 uppercase tracking-wide">Record Purchase</h2>
                <form onSubmit={handlePurchase} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-1/3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                        <select
                            value={assetType}
                            onChange={(e) => setAssetType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-military-accent outline-none"
                            required
                        >
                            <option value="">Select Asset</option>
                            <option value="Rifle">Rifle</option>
                            <option value="Ammo">Ammo</option>
                            <option value="Vehicle">Vehicle</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                            type="number"
                            placeholder="Enter quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-military-accent outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full md:w-auto bg-military-accent text-white px-6 py-2 rounded font-medium hover:bg-amber-700 transition-colors shadow-sm"
                    >
                        Record Purchase
                    </button>
                </form>
                {message && <p className={`mt-4 text-sm font-medium ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
            </div>

            <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-military-800 px-6 py-4 border-b border-military-700">
                    <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Purchase History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Asset Type</th>
                                <th className="px-6 py-3">Quantity</th>
                                <th className="px-6 py-3">Base ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {history.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.assetType}</td>
                                    <td className="px-6 py-4 text-green-600 font-bold">+{item.quantity}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm font-mono">{item.baseId}</td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">No purchase history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Purchase;
