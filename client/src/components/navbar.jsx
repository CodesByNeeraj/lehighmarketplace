import {Link, useNavigate, useLocation} from 'react-router-dom';
import {useAuth} from '../context/authContext';

export default function Navbar() {
  const {user, logout, isStudent, isAdmin} = useAuth();
  const navigate = useNavigate();
  const {pathname} = useLocation();

  const navLink = (to) =>
    `transition-colors ${pathname === to ? 'text-white font-semibold border-b-2 border-[#A67C52] pb-0.5' : 'text-white/70 hover:text-white'}`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-[#4E3629] text-white px-8 py-4 flex items-center justify-between">
      <Link to={isStudent ? '/home/listings' : '/admin'} className="flex items-center gap-3">
        <span className="text-white font-semibold text-lg tracking-tight">
          Lehigh University <span className="text-[#A67C52]">Marketplace</span>
        </span>
      </Link>

      {/*navbar links*/}
      <div className="flex items-center gap-8 text-sm font-medium">
        {isStudent && (
          <>
            <Link to="/home/listings" className={navLink('/home/listings')}>Home</Link>
            <Link to="/home/listings/saved" className={navLink('/home/listings/saved')}>Saved Listings</Link>
            <Link to="/home/listings/own" className={navLink('/home/listings/own')}>My Listings</Link>
            <Link to="/home/listings/purchased" className={navLink('/home/listings/purchased')}>Purchased</Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link to="/admin/listings" className={navLink('/admin/listings')}>Home</Link>
            <Link to="/admin/listings/removed" className={navLink('/admin/listings/removed')}>Removed</Link>
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