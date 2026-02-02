import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <h1 className="text-center">Loading...</h1>;

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div>Unauthorized</div>;
  }

  return children;
}
