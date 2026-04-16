import { useState, useEffect } from 'react';
import api from '../../api/client';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar.jsx';

export default function ViewSaved(){
    const [listings,setListings] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query,setQuery]=useState('')
    const navigate = useNavigate();

    const viewListing = (id)=>{
        navigate(`/home/listings/${id}`)
    }

    //search bar
    const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(query.toLowerCase()) ||
    listing.description.toLowerCase().includes(query.toLowerCase()))

    //run on render (get saved listings)
    useEffect(() => {
    api.get('/listings/get-saved-listings')
        .then(res => setListings(res.data))
        .catch(() => setError('Failed to load listings.'))
        .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a]">
            <Navbar/>
            <main className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-[#4E3629]">Saved Listings</h1>
                <p className="text-sm text-gray-500 mb-6">View Saved</p>
                {/*search bar*/}
                <input
                    type="text"
                    placeholder="Search listings by title or description..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E3629]"
                />
                {/*loading*/}
                {loading && (
                    <div className="text-center text-gray-400 py-20">Loading listings...</div>
                )}

                {/*error*/}
                {error && (
                    <div className="text-center text-red-500 py-20">{error}</div>
                )}
                {/*empty state*/}
                {!loading && !error && filteredListings.length === 0 && (
                    <div className="text-center text-gray-400 py-20">
                        {query ? 'No listings match your search.' : 'No listings yet. Be the first to create one!'}
                    </div>
                )}
                {/*3 column grid*/}
                {!loading && !error && filteredListings.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredListings.map(listing => (
                            <div
                                key={listing.item_id}
                                onClick={() => viewListing(listing.item_id)}
                                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                                {/* image */}
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
                                        <span className="text-[#4E3629] font-bold text-sm ml-3 whitespace-nowrap">${listing.price}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{listing.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs bg-[#f5f0eb] text-[#4E3629] px-2 py-1 rounded font-medium">
                                            {listing.condition.replace('_', ' ')}
                                        </span>
                                        <span className="text-xs text-gray-400">{listing.meetup_location}</span>
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



