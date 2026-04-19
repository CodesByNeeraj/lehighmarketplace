import {useState, useEffect} from 'react';
import api from '../../api/client';
import {X} from 'lucide-react';

export default function ViewProfile({sellerId, onClose}){
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        api.get(`/profile/view-profile/${sellerId}`)
            .then(res => setProfile(res.data))
            .catch(() => setError('Could not load profile.'))
            .finally(() => setLoading(false))
    },[sellerId])

    return (
        //popup profile modal
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm mx-4 p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer">
                    <X size={18}/>
                </button>
                {loading && <p className="text-sm text-gray-400 text-center py-6">Loading...</p>}
                {error && <p className="text-sm text-red-500 text-center py-6">{error}</p>}
                {!loading && !error && profile && (
                    <>
                        {/*display name*/}
                        <h2 className="text-lg font-bold text-[#4E3629] mb-4">{profile.display_name}</h2>
                        {/*bio*/}
                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                            {profile.bio && (
                                <div>
                                    <span className="font-medium text-[#4E3629]">Bio </span>
                                    {profile.bio}
                                </div>
                            )}
                            {/*gender*/}
                            {profile.gender && (
                                <div>
                                    <span className="font-medium text-[#4E3629]">Gender </span>
                                    {profile.gender === 'prefer_not_to_say' ? 'Prefer not to say' : profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
                                </div>
                            )}
                            {/*age*/}
                            {profile.age && (
                                <div>
                                    <span className="font-medium text-[#4E3629]">Age </span>
                                    {profile.age}
                                </div>
                            )}
                            {!profile.bio && !profile.gender && !profile.age && (
                                <p className="text-gray-400">No additional details provided.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
