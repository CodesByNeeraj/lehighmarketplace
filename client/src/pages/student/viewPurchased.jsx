import {useState, useEffect} from 'react';
import api from '../../api/client';
import {useNavigate} from 'react-router-dom';
import Navbar from '../../components/navbar.jsx';

export default function ViewPurchased(){
    const navigate = useNavigate()
    const [purchased, setPurchased] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        api.get('/listings/get-purchased')
            .then(res => setPurchased(res.data))
            .catch(() => setError('Failed to load purchased listings.'))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a]">
            <Navbar/>
            <main className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-[#4E3629] mb-1">Purchased</h1>
                <p className="text-sm text-gray-500 mb-8">Items you have bought</p>
                {loading && <div className="text-center text-gray-400 py-20">Loading...</div>}
                {error && <div className="text-center text-red-500 py-20">{error}</div>}
                {!loading && !error && purchased.length === 0 && (
                    <div className="text-center text-gray-400 py-20">No purchases yet.</div>
                )}
                {/*render purchased listings same away as how we do in homepage*/}
                {!loading && !error && purchased.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {purchased.map(listing => (
                            <div
                                key={listing.item_id}
                                onClick={() => navigate(`/home/listings/${listing.item_id}`)}
                                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                                {listing.image_url ? (
                                    <img src={listing.image_url} alt={listing.title} className="w-full h-48 object-cover"/>
                                ) : (
                                    <div className="w-full h-48 bg-[#f5f0eb] flex items-center justify-center text-[#A67C52] text-sm">No image</div>
                                )}
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <h2 className="font-semibold text-[#1a1a1a] text-base leading-snug">{listing.title}</h2>
                                        <span className="text-[#4E3629] font-bold text-sm ml-3 whitespace-nowrap">${listing.price}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{listing.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs bg-[#f5f0eb] text-[#4E3629] px-2 py-1 rounded font-medium">
                                            {listing.condition.replace('_', ' ')}
                                        </span>
                                        <span className="text-xs text-green-600 font-medium">Purchased</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
