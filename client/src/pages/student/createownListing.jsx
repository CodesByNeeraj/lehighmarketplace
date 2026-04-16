import { useState } from 'react';
import api from '../../api/client';
import { useNavigate } from 'react-router-dom';

//from prisma Condition schema
const conditions = ['New', 'Like_New', 'Acceptable', 'Poor'];

export default function CreateListing() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [condition, setCondition] = useState('');
    const [meetupLocation, setMeetupLocation] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmission = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try{
            let image_url = null;
            //upload image to cloudinary if one was selected
            if (image) {
                const formData = new FormData();
                formData.append('image', image);
                const uploadRes = await api.post('/upload/upload-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                image_url = uploadRes.data.image_url;
            }

            //post created listing to backend
            await api.post('/listings/create-listing', {
                title,
                description,
                price,
                condition,
                meetup_location: meetupLocation,
                image_url,
            });

            navigate('/home/listings');

        }catch(err){
            setError('Failed to create listing. Please try again.');
            console.error(err);
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a]">
            <main className="max-w-2xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-[#4E3629] mb-1">Create Listing</h1>
                <p className="text-sm text-gray-500 mb-8">Fill out the details for your item</p>
                {/*when submit button is clicked, triggers handleSubmission call back function*/}
                <form onSubmit={handleSubmission} className="flex flex-col gap-5">
                    {/*set title*/}
                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Scientific Calculator"
                            className="w-full border border-gray-200 rounded px-4 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors"
                        />
                    </div>
                    {/*set description */}
                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Describe your item.Keep it concise!"
                            rows={4}
                            className="w-full border border-gray-200 rounded px-4 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors resize-none"
                        />
                    </div>
                    {/*set price*/}
                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Price ($)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder="0.00"
                            className="w-full border border-gray-200 rounded px-4 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors"
                        />
                    </div>
                    {/*set condition*/}   
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
                    {/*set meetup location*/}  
                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Meetup Location</label>
                        <input
                            type="text"
                            required
                            value={meetupLocation}
                            onChange={e => setMeetupLocation(e.target.value)}
                            placeholder="e.g. Linderman Library"
                            className="w-full border border-gray-200 rounded px-4 py-2 text-sm outline-none focus:border-[#4E3629] transition-colors"
                        />
                    </div>
                    {/*set image*/}  
                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Image <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setImage(e.target.files[0])}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f5f0eb] file:text-[#4E3629] file:text-sm file:font-medium hover:file:bg-[#ebe3d9]"
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {/*buttons at the end of the form*/}  
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/home/listings')}
                            className="border border-gray-200 hover:bg-gray-50 text-[#1a1a1a] px-6 py-2 rounded text-sm font-medium transition-colors">
                            Go Back
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#4E3629] hover:bg-[#3d2a1f] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded text-sm font-medium transition-colors">
                            {loading ? 'Creating...' : 'Create Listing'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
