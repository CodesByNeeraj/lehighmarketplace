import {useState, useEffect} from 'react';
import api from '../../api/client';
import {useNavigate, useParams} from 'react-router-dom';
import {Trash} from 'lucide-react';
import Navbar from '../../components/navbar.jsx';
import ViewProfile from '../student/viewProfile.jsx';

export default function AdminViewListing() {
    const {item_id} = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleted, setDeleted] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();

    //show full details of listing
    useEffect(() => {
            api.get(`/listings/view-listing/${item_id}`)
            .then((res) => {
                setListing(res.data);
                setDeleted(res.data.is_deleted);
            })
            .catch(() => setError('Failed to load listing.'))
            .finally(() => setLoading(false));
    },[item_id]);

    const deleteListing = () => {
    api.delete(`/admin/delete-listing/${item_id}`)
        .then(() => setDeleted(true))
        .catch(() => setDeleteError('Could not delete listing.'));
    };

    if (loading){
        return <div className="text-center text-gray-400 py-20">Loading...</div>;
    }
    if (error){
        return <div className="text-center text-red-500 py-20">{error}</div>;
    }
    if (!listing){
        return null;
    }

    const {title, description, price, condition, meetup_location, image_url, seller, seller_id, deleted_at} = listing;

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a]">
            <Navbar />
            <main className="max-w-3xl mx-auto px-6 py-10">
                {/*back button*/}
                <button
                    type="button"
                    onClick={() => navigate('/admin/home/listings')}
                    className="text-sm text-[#4E3629] hover:underline mb-6 block cursor-pointer">
                    Back to listings
                </button>
                {/*image*/}
                {image_url ? (
                    <img
                        src={image_url}
                        alt={title}
                        className="w-full rounded-lg mb-6 object-contain max-h-[500px]"
                    />
                ) : (
                    <div className="w-full h-72 bg-[#f5f0eb] rounded-lg flex items-center justify-center text-[#A67C52] text-sm mb-6">
                        No image
                    </div>
                )}
                {/*deleted banner*/}
                {deleted && (
                    <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-500">
                        This listing was deleted{deleted_at ? ` on ${new Date(deleted_at).toLocaleDateString([], {month: 'short', day: 'numeric', year: 'numeric'})}` : ''}.
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
                    <span className="text-sm text-gray-400">Meetup @ {meetup_location}</span>
                </div>
                {/*seller*/}
                <p className="text-sm text-gray-500 mb-6">
                    Listed by{' '}
                    <button
                        type="button"
                        onClick={() => setShowProfile(true)}
                        className="font-medium text-[#4E3629] hover:underline cursor-pointer">
                        {seller?.profile?.display_name || seller?.email}
                    </button>
                </p>
                {showProfile && <ViewProfile sellerId={seller_id} onClose={() => setShowProfile(false)}/>}
                {/*description*/}
                <p className="text-sm text-gray-600 leading-relaxed mb-8">{description}</p>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={deleteListing}
                        disabled={deleted}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium border transition-colors ${deleted ? 'border-red-400 text-red-400 cursor-default opacity-60' : 'border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-400 cursor-pointer'}`}>
                        <Trash size={15} className={deleted ? 'fill-red-400' : ''}/>
                        {deleted ? 'Deleted' : 'Delete'}
                    </button>
                </div>
                {deleteError && <p className="text-xs text-red-500 mt-2">{deleteError}</p>}
            </main>
        </div>
    );
}
