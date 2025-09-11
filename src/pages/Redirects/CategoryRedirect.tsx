import { Navigate } from 'react-router-dom';

const CategoryRedirect = ({ to }: { to: string }) => {
  return <Navigate to={to} replace />;
};

export default CategoryRedirect;

