import {useState, useEffect} from 'react';
import api from '../../api/client';
import {useNavigate} from 'react-router-dom';
import Navbar from '../../components/navbar.jsx';

export default function DeletedListings(){
    const navigate = useNavigate();
    const [deletedListings, setDeletedListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    //render deleted listings
    useEffect(() => {
        api.get('/admin/get-deleted-listings')
            .then(res => setDeletedListings(res.data))
            .catch(() => setError('Failed to load deleted listings.'))
            .finally(() => setLoading(false))
    },[])

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a]">
            <Navbar/>
            <main className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-[#4E3629] mb-1">Removed Listings</h1>
                <p className="text-sm text-gray-500 mb-8">Listings that have been deleted by admins or sellers</p>

                {loading && <p className="text-center text-gray-400 py-20">Loading...</p>}
                {error && <p className="text-center text-red-500 py-20">{error}</p>}
                {!loading && !error && deletedListings.length === 0 && (
                    <p className="text-center text-gray-400 py-20">No deleted listings yet.</p>
                )}

                {!loading && !error && deletedListings.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/*show deleted listings just like how we display listings card on homepage*/}
                        {deletedListings.map(listing => (
                            <div
                                key={listing.item_id}
                                onClick={() => navigate(`/admin/listings/${listing.item_id}`)}
                                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer opacity-70">
                                {listing.image_url ? (
                                    <img
                                        src={listing.image_url}
                                        alt={listing.title}
                                        className="w-full h-48 object-cover grayscale"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-[#f5f0eb] flex items-center justify-center text-[#A67C52] text-sm">
                                        No image
                                    </div>
                                )}
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <h2 className="font-semibold text-[#1a1a1a] text-base leading-snug">{listing.title}</h2>
                                        <span className="text-[#4E3629] font-bold text-sm ml-3 whitespace-nowrap">${listing.price}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{listing.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs bg-red-50 text-red-400 border border-red-200 px-2 py-1 rounded font-medium">Deleted</span>
                                        {listing.deleted_at && (
                                            <span className="text-xs text-gray-400">
                                                {new Date(listing.deleted_at).toLocaleDateString([], {month: 'short', day: 'numeric', year: 'numeric'})}
                                            </span>
                                        )}
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
