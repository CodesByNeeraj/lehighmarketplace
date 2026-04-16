import { useState, useEffect } from 'react';
import api from '../../api/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Navbar from '../../components/navbar.jsx';
import { useAuth } from '../../context/authContext.jsx';

export default function ViewListing() {
    const { item_id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);
    const [saveError, setSaveError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            api.get(`/listings/view-listing/${item_id}`),
            api.get('/listings/get-saved-listings')
        ])
            .then(([listingRes, savedRes]) => {
                setListing(listingRes.data);
                //to show its saved upon page refresh (preserve saved state)
                setSaved(savedRes.data.some(l => l.item_id === item_id));
            })
            .catch(() => setError('Failed to load listing.'))
            .finally(() => setLoading(false));
    },[item_id]);

    if (loading){
        return <div className="text-center text-gray-400 py-20">Loading...</div>;
    }
    if (error){
        return <div className="text-center text-red-500 py-20">{error}</div>;
    }
    if (!listing){
        return null;
    }

    const {title, description, price, condition, meetup_location, image_url, seller, seller_id} = listing;
    const isOwnListing = user?.id === seller_id;

    const saveListing = () => {
        api.post(`/listings/save-listing/${item_id}`)
            .then(() => setSaved(true))
            .catch(() => setSaveError('Could not save listing.'));
    };

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a]">
            <Navbar />
            <main className="max-w-3xl mx-auto px-6 py-10">
                {/*back button*/}
                <button
                    type="button"
                    onClick={() => navigate('/home/listings')}
                    className="text-sm text-[#4E3629] hover:underline mb-6 block">
                    Back to listings
                </button>
                {/*image*/}
                {image_url ? (
                    <img
                        src={image_url}
                        alt={title}
                        className="w-full h-72 object-cover rounded-lg mb-6"
                    />
                ) : (
                    <div className="w-full h-72 bg-[#f5f0eb] rounded-lg flex items-center justify-center text-[#A67C52] text-sm mb-6">
                        No image
                    </div>
                )}

                {/*title and price*/}
                <div className="flex items-start justify-between mb-4">
                    <h1 className="text-2xl font-bold text-[#4E3629]">{title}</h1>
                    <span className="text-xl font-bold text-[#4E3629] ml-4">${price}</span>
                </div>

                {/*condition and location*/}
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs bg-[#f5f0eb] text-[#4E3629] px-2 py-1 rounded font-medium">
                        {condition.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-400">📍 {meetup_location}</span>
                </div>

                {/*seller*/}
                <p className="text-sm text-gray-500 mb-6">
                    Listed by <span className="font-medium text-[#4E3629]">{seller?.profile?.display_name || seller?.email}</span>
                </p>

                {/*description*/}
                <p className="text-sm text-gray-600 leading-relaxed mb-8">{description}</p>

                {/*action buttons.hidden if viewing own listing*/}
                {!isOwnListing && (
                    <div className="flex items-center gap-3">
                        <button
                            className="bg-[#4E3629] hover:bg-[#3d2a1f] text-white px-6 py-2 rounded text-sm font-medium transition-colors cursor-pointer">
                            Message Seller
                        </button>
                        <button
                            type="button"
                            onClick={saveListing}
                            disabled={saved}
                            title={saved ? 'Saved' : 'Save'}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium border transition-colors ${saved ? 'border-red-400 text-red-400 cursor-default' : 'border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-400 cursor-pointer'}`}>
                            <Heart size={15} className={saved ? 'fill-red-400' : ''} />
                            {saved ? 'Saved' : 'Save'}
                        </button>
                    </div>
                )}
                {saveError && <p className="text-xs text-red-500 mt-2">{saveError}</p>}
            </main>
        </div>
    );
}
