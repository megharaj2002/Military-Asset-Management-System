import { useEffect, useState } from 'react';
import api from '../api';

const Logs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await api.get('/logs', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLogs(res.data);
            } catch (err) {
                console.error('Error fetching logs:', err);
            }
        };

        fetchLogs();
    }, []);

    return (
        <div className="p-4 max-w-5xl mx-auto mt-10 bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-4">System Logs</h2>
            <div className="overflow-auto">
                <table className="w-full text-sm text-left border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Time</th>
                            <th className="p-2 border">Action</th>
                            <th className="p-2 border">User</th>
                            <th className="p-2 border">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log._id} className="border-t">
                                <td className="p-2 border">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="p-2 border">{log.action}</td>
                                <td className="p-2 border">
                                    {log.userId?.name || 'Unknown'} ({log.userId?.role})
                                </td>
                                <td className="p-2 border">
                                    <pre className="whitespace-pre-wrap break-words text-xs">
                                        {JSON.stringify(log.details, null, 2)}
                                    </pre>
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center p-4">
                                    No logs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Logs;
