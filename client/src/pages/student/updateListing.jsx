import { useState, useEffect } from 'react';
import api from '../../api/client';
import { useNavigate, useParams } from 'react-router-dom';

const conditions = ['New', 'Like_New', 'Acceptable', 'Poor'];

export default function UpdateListing(){
    const navigate = useNavigate();
    const {item_id} = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [condition, setCondition] = useState('');
    const [meetupLocation, setMeetupLocation] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');

    //pre-populate form with existing listing data
    useEffect(() => {
        api.get(`/listings/view-listing/${item_id}`)
            .then(res => {
                const {title, description, price, condition, meetup_location} = res.data;
                setTitle(title);
                setDescription(description);
                setPrice(price);
                setCondition(condition);
                setMeetupLocation(meetup_location);
            })
            .catch(() => setError('Failed to load listing.'))
            .finally(() => setFetchLoading(false));
    },[item_id]);

    const handleSubmission = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try{
            let image_url = null;
            //upload new image to cloudinary if one was selected
            if(image) {
                const formData = new FormData();
                formData.append('image', image);
                const uploadRes = await api.post('/upload/upload-image', formData, {
                    headers: {'Content-Type': 'multipart/form-data'}
                });
                image_url = uploadRes.data.image_url;
            }
            
            //udate listing backend api call
            await api.put(`/listings/update-listing/${item_id}`, {
                title,
                description,
                price,
                condition,
                meetupLocation,
                ...(image_url && { image_url }),
            });

            navigate('/home/listings/own');

        }catch (err) {
            setError('Failed to update listing. Please try again.');
            console.error(err);
        }finally {
            setLoading(false);
        }
    };

    if(fetchLoading){
        return <div className="text-center text-gray-400 py-20">Loading...</div>;
    }

    return(
        <div className="min-h-screen bg-white text-[#1a1a1a]">
            <main className="max-w-2xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-[#4E3629] mb-1">Update Listing</h1>
                <p className="text-sm text-gray-500 mb-8">Edit your listing details below</p>
                {/*show listing creation form with populated values*/}
                <form onSubmit={handleSubmission} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full border border-gray-200 rounded px-4 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors"
                        />
                    </div>
                    {/*description*/}
                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-200 rounded px-4 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors resize-none"
                        />
                    </div>
                    {/*price*/}
                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Price ($)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="w-full border border-gray-200 rounded px-4 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors"
                        />
                    </div>
                    {/*condition*/}
                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Condition</label>
                        <select
                            required
                            value={condition}
                            onChange={e => setCondition(e.target.value)}
                            className="w-full border border-gray-200 rounded px-4 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors">
                            <option value="">Select condition</option>
                            {conditions.map(c => (
                                <option key={c} value={c}>{c.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>
                    {/*meetuplocation*/}
                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Meetup Location</label>
                        <input
                            type="text"
                            required
                            value={meetupLocation}
                            onChange={e => setMeetupLocation(e.target.value)}
                            className="w-full border border-gray-200 rounded px-4 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors"
                        />
                    </div>
                    {/*image*/}
                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Image <span className="text-gray-400 font-normal">(leave empty to keep existing)</span></label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setImage(e.target.files[0])}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f5f0eb] file:text-[#4E3629] file:text-sm file:font-medium hover:file:bg-[#ebe3d9]"
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {/*buttons at end of form*/}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/home/listings/own')}
                            className="border border-gray-200 hover:bg-gray-50 text-[#1a1a1a] px-6 py-2 rounded text-sm font-medium transition-colors">
                            Go Back
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#4E3629] hover:bg-[#3d2a1f] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded text-sm font-medium transition-colors">
                            {loading ? 'Updating...' : 'Update Listing'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
