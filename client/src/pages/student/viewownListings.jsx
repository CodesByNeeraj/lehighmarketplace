import {useState, useEffect} from 'react';
import api from '../../api/client';
import {useNavigate} from 'react-router-dom';
import {Trash2, Pencil} from 'lucide-react';
import Navbar from '../../components/navbar.jsx';

export default function ViewOwnListings() {
    const navigate = useNavigate();
    const [ownListings, setOwnListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    {/*fetch own listings on every render*/}
    useEffect(() => {
        api.get('/listings/get-own-listings')
            .then(res => setOwnListings(res.data))
            .catch(() => setError('Failed to load your listings.'))
            .finally(() => setLoading(false));
    }, []);

    const deleteListing = (id)=>{
    api.delete(`/listings/delete-listing/${id}`)
    .then(()=>{
        //remove from frontend
        setOwnListings(prevListings => prevListings.filter(listing => listing.item_id !== id));
    })
    .catch(()=>{
        setError('Failed to delete listing.');
    })
    }

    const updateListing = (id)=>{
        navigate(`/home/listings/update/${id}`)
    }

    const unmarkSold = (id) => {
        api.put(`/listings/unmark-sold/${id}`)
            .then(() => setOwnListings(prev =>
                prev.map(l => l.item_id === id ? {...l, is_sold: false, buyer_id: null} : l)
            ))
            .catch(() => setError('Failed to unmark listing.'))
    }

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a]">
            <Navbar></Navbar>
            <main className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-[#4E3629] mb-1">My Listings</h1>
                <p className="text-sm text-gray-500 mb-8">Items you have listed for sale</p>
                {/*loading*/}
                {loading && (
                    <div className="text-center text-gray-400 py-20">Loading your listings...</div>
                )}
                {/*error*/}
                {error && (
                    <div className="text-center text-red-500 py-20">{error}</div>
                )}
                {/*empty state*/}
                {!loading && !error && ownListings.length === 0 && (
                    <div className="text-center text-gray-400 py-20">
                        {'No listings yet. Go to home and create one!'}
                    </div>

                )}

                {!loading && !error && ownListings.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ownListings.map(listing => (
                            <div
                                key={listing.item_id}
                                onClick={() => navigate(`/home/listings/${listing.item_id}`)}
                                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                                {/*image*/}
                                {listing.image_url ? (
                                    <img
                                        src={listing.image_url}
                                        alt={listing.title}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-[#f5f0eb] flex items-center justify-center text-[#A67C52] text-sm">
                                        No image
                                    </div>
                                )}
                                {/*details*/}
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <h2 className="font-semibold text-[#1a1a1a] text-base leading-snug">{listing.title}</h2>
                                        <div className="flex items-center gap-2 ml-3">
                                            <span className="text-[#4E3629] font-bold text-sm whitespace-nowrap">${listing.price}</span>
                                            <button
                                                type="button"
                                                onClick={e => {e.stopPropagation(); updateListing(listing.item_id);}}
                                                className="text-gray-400 hover:text-[#4E3629] transition-colors">
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={e => {e.stopPropagation(); deleteListing(listing.item_id);}}
                                                className="text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{listing.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs bg-[#f5f0eb] text-[#4E3629] px-2 py-1 rounded font-medium">
                                            {listing.condition.replace('_', ' ')}
                                        </span>
                                        {listing.is_sold ? (
                                            <button
                                                type="button"
                                                onClick={e => {e.stopPropagation(); unmarkSold(listing.item_id);}}
                                                className="text-xs text-green-600 font-medium hover:text-red-400 transition-colors cursor-pointer">
                                                Sold · Undo
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400">{listing.meetup_location}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
