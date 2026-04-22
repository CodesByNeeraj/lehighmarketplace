import {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import api from '../../api/client';
import lehighImg from '/ClaytonUni.jpg';

export default function ForgetPassword(){
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    //clear error messages after 3 seconds
    useEffect(() => {
        if (!error){
            return
        }
        const timer = setTimeout(() => setError(''), 3000)
        return () => clearTimeout(timer)
    },[error])

    //send code to email that requested password reset
    const sendResetCode = async(e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try{
            await api.post('/auth/send-reset-code',{email})
            setStep(2)
        }catch(err){
            setError(err.response?.data?.error || 'Failed to send reset code')
        }finally{
            setLoading(false)
        }
    }
    //call backend api to update password
    const updatePassword = async(e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try{
            await api.put('/auth/update-password',{email_add: email, otp, new_password: newPassword})
            navigate('/login')
        }catch(err){
            setError(err.response?.data?.error || 'Failed to reset password')
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex">
            {/*left panel*/}
            <div className="hidden lg:flex w-1/2 bg-[#4E3629] flex-col justify-between p-12">
                <div>
                    <h1 className="text-white text-2xl font-semibold tracking-tight">
                        Lehigh University Marketplace
                        <br/>
                        <span className="text-[#A67C52]">Sell what you can. Buy what you want.</span>
                    </h1>
                    <div className="mt-8 rounded-xl overflow-hidden shadow-2xl">
                        <img src={lehighImg} alt="Lehigh University" className="w-full object-cover"/>
                    </div>
                </div>
                <p className="text-white/50 text-sm">
                    Lehigh University Marketplace - not affiliated with or endorsed by Lehigh University.
                </p>
            </div>
            {/*right panel*/}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-sm">
                    <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-1">Reset Password</h2>
                    <p className="text-sm text-gray-500 mb-8">
                        {step === 1 ? 'Enter your email to receive a reset code' : `Code sent to ${email}`}
                    </p>
                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                            {error}
                        </div>
                    )}
                    {step === 1 && (
                        <form onSubmit={sendResetCode} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    placeholder="you@lehigh.edu"
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#4E3629] hover:bg-[#3d2a1f] text-white py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer">
                                {loading ? 'Sending...' : 'Send Reset Code'}
                            </button>
                        </form>
                    )}
                    {step === 2 && (
                        <form onSubmit={updatePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reset Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    required
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#4E3629] hover:bg-[#3d2a1f] text-white py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer">
                                {loading ? 'Updating...' : 'Reset Password'}
                            </button>
                            {/*if user entered wrong email they can go back*/}
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-sm text-gray-400 hover:text-gray-600 text-center cursor-pointer">
                                Use a different email
                            </button>
                        </form>
                    )}

                    <p className="mt-6 text-sm text-gray-500 text-center">
                        Remember your password?{' '}
                        <Link to="/login" className="text-[#4E3629] font-medium hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
