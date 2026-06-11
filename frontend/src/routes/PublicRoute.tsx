import { Navigate } from "react-router-dom";

type PublicRouteProps = {
  children: React.ReactNode;
};

function PublicRoute({ children }: PublicRouteProps) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/pontos-turisticos " replace />;
  }

  return children;
}

export default PublicRoute;