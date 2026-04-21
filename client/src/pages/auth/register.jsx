import {useState} from 'react';
import {Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import {useAuth} from '../../context/authContext';
import lehighImg from '/ClaytonUni.jpg';

export default function Register(){
  const {login} = useAuth();
  const navigate = useNavigate();
  
  //1 = enter email, 2 = enter code + details
  const [step, setStep] = useState(1); 
  const [form, setForm] = useState({ name: '', email: '', password: '', code: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  //step 1: send the verification code
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/send-code', { email: form.email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  //step 2: submit registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try{
      const {data} = await api.post('/auth/register', form);
      //immediately login user post registration. token and student data saved to localStorage
      login(data.token, data.student);
      navigate('/home/listings');
    }catch (err){
      setError(err.response?.data?.error || 'Registration failed');
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

          {/*step by step indicators*/}
          <div className="flex items-center gap-2 mb-8">
            <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium
              ${step >= 1 ? 'bg-[#4E3629] text-white' : 'bg-gray-100 text-gray-400'}`}>
              1
            </div>
            <div className={`flex-1 h-px ${step >= 2 ? 'bg-[#4E3629]' : 'bg-gray-200'}`} />
            <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium
              ${step >= 2 ? 'bg-[#4E3629] text-white' : 'bg-gray-100 text-gray-400'}`}>
              2
            </div>
          </div>
          {/*enter email to receive verification code*/}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-1">Create account</h2>
              <p className="text-sm text-gray-500 mb-8">
                Enter your email to receive a verification code
              </p>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                  {error}
                </div>
              )}
              {/*send verification code*/}
              <form onSubmit={handleSendCode} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#4E3629] hover:bg-[#3d2a1f] text-white py-2 rounded text-sm font-medium transition-colors disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send verification code'}
                </button>
              </form>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-1">Verify & complete</h2>
              <p className="text-sm text-gray-500 mb-8">
                Enter the code sent to <span className="font-medium text-[#4E3629]">{form.email}</span>
              </p>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                  {error}
                </div>
              )}
              {/*verify verification code*/}
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value })}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors tracking-widest text-center font-medium"
                    placeholder="000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors"
                    placeholder="John Pork"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors"
                    placeholder="Min. 8 characters"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#4E3629] hover:bg-[#3d2a1f] text-white py-2 rounded text-sm font-medium transition-colors disabled:opacity-50">
                  {loading ? 'Creating account...' : 'Create account'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError('');
                  }}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  ← Back
                </button>

                {/*resend code*/}
                <p className="text-center text-sm text-gray-500">
                  Didn't receive a code?{' '}
                  <button
                    type="button"
                    onClick={handleSendCode}
                    className="text-[#4E3629] font-medium hover:underline">
                    Resend
                  </button>
                </p>
              </form>
            </>
          )}

          <p className="mt-6 text-sm text-gray-500 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-[#4E3629] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
