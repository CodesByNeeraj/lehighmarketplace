import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import api from '../../api/client';
import {useAuth} from '../../context/authContext';
import lehighImg from '/ClaytonUni.jpg';

export default function Login(){
  const {login} = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({email: '', password: ''});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try{
      //admin login (admin option selected)
      if (isAdmin){
        const {data} = await api.post('/admin/admin-login', form);
        login(data.token, data.admin);
        navigate('/admin/home/listings');
        //student login
      }else{
        const {data} = await api.post('/auth/login', form);
        login(data.token, data.student);
        navigate('/home/listings');
      }
    }catch (err){
      setError(err.response?.data?.error || 'Invalid credentials');
    }finally{
      setLoading(false);
    }
  };

  return(
    <div className="min-h-screen bg-white flex">
      {/*left panel*/}
      <div className="hidden lg:flex w-1/2 bg-[#4E3629] flex-col justify-between p-12">
        <div>
          <h1 className="text-white text-2xl font-semibold tracking-tight">
            Lehigh University Marketplace
            <br></br>
            <span className="text-[#A67C52]">Sell what you can. Buy what you want.</span>
          </h1>
          <div className="mt-8 rounded-xl overflow-hidden shadow-2xl">
            <img
              src={lehighImg}
              alt="Lehigh University"
              className="w-full object-cover"
            />
          </div>
        </div>
        <div>
          <p className="text-white/50 text-sm">
            Lehigh University Marketplace - not affiliated with or endorsed by Lehigh University.
          </p>
        </div>
      </div>
      {/*right panel*/}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

          {/*admin toggle*/}
          <div className="flex items-center gap-2 mb-6">
            <button
              type="button"
              onClick={() => setIsAdmin(false)}
              className={`flex-1 py-1.5 rounded text-sm font-medium border transition-colors ${!isAdmin ? 'bg-[#4E3629] text-white border-[#4E3629]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#4E3629]'}`}>
              Student
            </button>
            <button
              type="button"
              onClick={() => setIsAdmin(true)}
              className={`flex-1 py-1.5 rounded text-sm font-medium border transition-colors ${isAdmin ? 'bg-[#4E3629] text-white border-[#4E3629]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#4E3629]'}`}>
              Admin
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
              {error}
            </div>
          )}
          {/*login form*/}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors"
                placeholder="you@lehigh.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4E3629] hover:bg-[#3d2a1f] text-white py-2 rounded text-sm font-medium transition-colors disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          {/*student registration / reset password*/}
          {!isAdmin && (
            <>
              <p className="mt-6 text-sm text-gray-500 text-center">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#4E3629] font-medium hover:underline">
                  Register
                </Link>
              </p>
              <p className="mt-3 text-sm text-gray-500 text-center">
                <Link to="/reset-password" className="text-[#4E3629] font-medium hover:underline">
                  Forget Password?
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
