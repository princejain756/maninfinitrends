import { useParams, Navigate } from 'react-router-dom';

const Collection = () => {
  const { handle } = useParams();
  
  // Redirect to shop with the category
  return <Navigate to={`/shop/${handle || ''}`} replace />;
};

export default Collection;
