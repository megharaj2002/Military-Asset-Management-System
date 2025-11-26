import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');

    if (!token) return <Navigate to="/login" replace />;

    try {
        const { role } = jwtDecode(token);
        if (!allowedRoles.includes(role)) {
            return <Navigate to="/dashboard" replace />;
        }
        return children;
    } catch (err) {
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoute;
