import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ role }) => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
            <div className="flex gap-4">
                <Link to="/dashboard">Dashboard</Link>

                {(role === 'admin') && <Link to="/purchase">Purchase</Link>}

                {(role === 'admin' || role === 'logistics') && (
                    <>
                        <Link to="/transfer">Transfer</Link>
                        <Link to="/assignment">Assignment</Link>
                    </>
                )}

                {role === 'admin' && <Link to="/logs">Logs</Link>}
            </div>

            <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 cursor-pointer px-4 py-1 rounded"
            >
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
