import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
	const token = localStorage.getItem("authToken");
	const rawUser = localStorage.getItem("userData");

	if (!token || !rawUser) {
		return <Navigate to="/login" replace />;
	}

	try {
		const user = JSON.parse(rawUser);
		// If allowedRoles is provided, only allow when role matches
		if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
			if (!allowedRoles.includes(user.role)) {
				return <Navigate to="/feed" replace />;
			}
		}

		return children;
	} catch (err) {
		return <Navigate to="/login" replace />;
	}
};

export default ProtectedRoute;

