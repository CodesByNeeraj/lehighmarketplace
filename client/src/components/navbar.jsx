import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function Navbar() {
  const { user, logout, isStudent, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-[#4E3629] text-white px-8 py-4 flex items-center justify-between">
      <Link to={isStudent ? '/listings' : '/admin'} className="flex items-center gap-3">
        <span className="text-white font-semibold text-lg tracking-tight">
          Lehigh University <span className="text-[#A67C52]">Marketplace</span>
        </span>
      </Link>

      {/*navbar links*/}
      <div className="flex items-center gap-8 text-sm font-medium">
        {isStudent && (
          <>
            <Link to="/listings"
              className="text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/listings/saved"
              className="text-white/80 hover:text-white transition-colors">
              Saved Listings
            </Link>
            <Link to="/listings/own"
              className="text-white/80 hover:text-white transition-colors">
              My Listings
            </Link>
            <Link to="/listings/purchased"
              className = "text-white/80 hover:text-white transition-colors">
              Purchased
            </Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link to="/admin/listings"
              className="text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/admin/listings/removed"
              className="text-white/80 hover:text-white transition-colors">
              Removed
            </Link>
          </>
        )}
      </div>

      {/*logout*/}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-white/60">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="bg-white/10 hover:bg-white/20 transition-colors px-4 py-1.5 rounded text-white text-sm">
          Logout
        </button>
      </div>
    </nav>
  );
}