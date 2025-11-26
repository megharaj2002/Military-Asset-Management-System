import { useState, useEffect } from 'react';
import api from '../api';

const Assignment = () => {
    const [form, setForm] = useState({
        assetType: '',
        quantity: '',
        assignedTo: '',
        type: 'assigned'
    });
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([]);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/assignments', {
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

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const res = await api.post('/assignments', form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage(res.data.message);
            setForm({ assetType: '', quantity: '', assignedTo: '', type: 'assigned' });
            fetchHistory();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Assignment failed');
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-military-900 mb-6 uppercase tracking-wide">Assign / Expend Asset</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                        <select
                            name="assetType"
                            value={form.assetType}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-military-accent outline-none"
                            required
                        >
                            <option value="">Select Asset</option>
                            <option value="Rifle">Rifle</option>
                            <option value="Ammo">Ammo</option>
                            <option value="Vehicle">Vehicle</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-military-accent outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To / Reason</label>
                        <input
                            type="text"
                            name="assignedTo"
                            placeholder="Soldier ID or Reason"
                            value={form.assignedTo}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-military-accent outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-military-accent outline-none"
                        >
                            <option value="assigned">Assign to Personnel</option>
                            <option value="expended">Mark as Expended</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 mt-4">
                        <button
                            type="submit"
                            className="w-full bg-military-accent text-white px-6 py-2 rounded font-medium hover:bg-amber-700 transition-colors shadow-sm"
                        >
                            Submit Action
                        </button>
                    </div>
                </form>
                {message && <p className={`mt-4 text-sm font-medium ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
            </div>

            <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-military-800 px-6 py-4 border-b border-military-700">
                    <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Assignment History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Asset</th>
                                <th className="px-6 py-3">Quantity</th>
                                <th className="px-6 py-3">Assigned To</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {history.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${item.type === 'assigned' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.assetType}</td>
                                    <td className="px-6 py-4 text-gray-800 font-bold">{item.quantity}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.assignedTo}</td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">No assignment history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Assignment;
