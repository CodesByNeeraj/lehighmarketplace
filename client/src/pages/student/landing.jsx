import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ShoppingBag, MessageCircle, Shield, Search} from 'lucide-react';
import api from '../../api/client';

export default function Landing() {
    const navigate = useNavigate();
    // const scrollTo = (id) => {
    //     document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    // }
    const [waitlistEmail, setWaitlistEmail] = useState('');
    const [waitlistStatus, setWaitlistStatus] = useState('');
    const [loading, setLoading] = useState(false);

    // handle waitlist form submission
    //now turned into a feedback form collection 
    const handleWaitlist = async (e) => {
        e.preventDefault();
        if (!waitlistEmail.endsWith('@lehigh.edu')) {
            setWaitlistStatus('error');
            setTimeout(() => setWaitlistStatus(''), 3000);
            return;
        }
        setLoading(true);
        try{
            await api.post('/waitlist/save-to-waitlist', {email: waitlistEmail});
            setWaitlistStatus('success');
            setWaitlistEmail('');
        }catch(err){
            if (err.response?.status === 409){
                setWaitlistStatus('duplicate');
            }else{
                setWaitlistStatus('error');
            }
        }finally{
            setLoading(false);
            setTimeout(() => setWaitlistStatus(''), 3000);
        }
    }

    const navigateLogin = ()=>{
        navigate(`/login`)
    }

    return(
        <div className="min-h-screen bg-white text-[#1a1a1a]">

            {/* navbar */}
            <nav className="w-full bg-[#4E3629] px-4 md:px-8 py-4 flex items-center justify-between">
                <span className="text-white font-semibold text-base md:text-lg tracking-tight">
                    Lehigh University <span className="text-[#A67C52]">Marketplace</span>
                </span>
                <button
                    onClick={navigateLogin}
                    className="bg-white text-[#4E3629] hover:bg-[#f5f0eb] transition-colors px-4 md:px-5 py-2 rounded text-sm font-medium whitespace-nowrap cursor-pointer">
                    Join Now!
                </button>
            </nav>

            {/* hero section */}
            <section className="bg-[#4E3629] text-white px-4 md:px-8 py-16 md:py-24 flex flex-col items-center text-center">
                <p className="text-[#A67C52] text-xs md:text-sm font-medium uppercase tracking-widest mb-4">
                    exclusive to lehigh university students
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-2xl leading-tight mb-6">
                    Buy and sell anything on campus
                </h1>
                <p className="text-white/70 text-sm md:text-base max-w-xl mb-10">
                    Lehigh University Marketplace is a peer to peer platform built for the Lehigh community.
                    List textbooks, electronics, study materials and more.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={navigateLogin}
                        className="bg-white text-[#4E3629] hover:bg-[#f5f0eb] transition-colors px-6 py-3 rounded text-sm font-semibold cursor-pointer">
                        Join Now!
                    </button>
                </div>
            </section>

            {/* features section */}
            <section className="px-4 md:px-8 py-16 md:py-20 max-w-5xl mx-auto">
                <h2 className="text-2xl font-semibold text-center mb-12 text-[#4E3629]">
                    Everything you need to buy and sell on campus
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* feature cards */}
                    <div className="flex flex-col items-start gap-3 p-6 border border-gray-100 rounded-xl">
                        <div className="bg-[#4E3629]/10 p-3 rounded-lg">
                            <ShoppingBag size={20} className="text-[#4E3629]" />
                        </div>
                        <h3 className="font-semibold text-sm">Create Listings</h3>
                        <p className="text-gray-500 text-sm">List your items with photos, price, condition and a campus meetup location.</p>
                    </div>

                    <div className="flex flex-col items-start gap-3 p-6 border border-gray-100 rounded-xl">
                        <div className="bg-[#4E3629]/10 p-3 rounded-lg">
                            <Search size={20} className="text-[#4E3629]" />
                        </div>
                        <h3 className="font-semibold text-sm">Search and Browse</h3>
                        <p className="text-gray-500 text-sm">Find textbooks, calculators, electronics and more with real time search filtering.</p>
                    </div>

                    <div className="flex flex-col items-start gap-3 p-6 border border-gray-100 rounded-xl">
                        <div className="bg-[#4E3629]/10 p-3 rounded-lg">
                            <MessageCircle size={20} className="text-[#4E3629]" />
                        </div>
                        <h3 className="font-semibold text-sm">Message Sellers</h3>
                        <p className="text-gray-500 text-sm">Chat directly with sellers through an internal messaging system to arrange safe meetups.</p>
                    </div>

                    <div className="flex flex-col items-start gap-3 p-6 border border-gray-100 rounded-xl">
                        <div className="bg-[#4E3629]/10 p-3 rounded-lg">
                            <Shield size={20} className="text-[#4E3629]" />
                        </div>
                        <h3 className="font-semibold text-sm">Lehigh Only</h3>
                        <p className="text-gray-500 text-sm">Only verified @lehigh.edu accounts can participate, keeping the community safe and trusted.</p>
                    </div>

                </div>
            </section>

            {/* waitlist section */}
            <section id="waitlist" className="bg-[#faf7f4] px-4 md:px-8 py-16 md:py-20 flex flex-col items-center text-center">
                <h2 className="text-2xl font-semibold text-[#4E3629] mb-2">
                    Have Feedback or Feature Requests?
                </h2>
                <p className="text-gray-500 text-sm mb-8 max-w-md">
                    Drop your email here and we will reach out to you.
                </p>

                <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    <input
                        type="email"
                        required
                        value={waitlistEmail}
                        onChange={e => setWaitlistEmail(e.target.value)}
                        placeholder="you@lehigh.edu"
                        className="flex-1 border border-gray-200 rounded px-4 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#4E3629] hover:bg-[#3d2a1f] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded text-sm font-medium transition-colors">
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </form>

                {/* waitlist feedback messages */}
                {waitlistStatus === 'success' && (
                    <p className="mt-4 text-sm text-green-600">We will reach out!</p>
                )}
                {waitlistStatus === 'error' && (
                    <p className="mt-4 text-sm text-red-500">Only @lehigh.edu emails are allowed.</p>
                )}
                {waitlistStatus === 'duplicate' && (
                    <p className="mt-4 text-sm text-red-500">This email is already on the feedback list.</p>
                )}
            </section>

            {/* footer */}
            <footer className="bg-[#4E3629] text-white/50 text-xs text-center py-6">
                Lehigh University Marketplace — not affiliated with or endorsed by Lehigh University.
            </footer>

        </div>
    );
}
