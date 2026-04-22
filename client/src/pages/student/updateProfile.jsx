import {useState, useEffect} from 'react';
import api from '../../api/client';
import {useNavigate} from 'react-router-dom';
import Navbar from '../../components/navbar.jsx';

export default function UpdateProfile(){
    const navigate = useNavigate()
    const [display_name, setDisplayName] = useState('')
    const [bio, setBio] = useState('')
    const [gender, setGender] = useState('')
    const [age, setAge] = useState('')
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(true)
    const [error, setError] = useState('')

    //pre-populate form with existing profile data
    useEffect(() => {
        api.get('/profile/get-profile')
            .then(res => {
                const {display_name, bio, gender, age} = res.data
                setDisplayName(display_name || '')
                setBio(bio || '')
                setGender(gender || '')
                setAge(age || '')
            })
            .catch(() => setError('Failed to load profile details.'))
            .finally(() => setFetchLoading(false))
    }, [])

    //update profile call back function
    const updateProfile = async(e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        await api.put('/profile/update-profile',{display_name, bio, gender, age})
            .then(() => navigate('/home/listings'))
            .catch((err) => {
                setError('Failed to update profile')
                console.error(err)
            })
            .finally(() => setLoading(false))
    }

    if (fetchLoading){
        return <div className="text-center text-gray-400 py-20">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a]">
            <Navbar/>
            <main className="max-w-xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-[#4E3629] mb-1">Update Profile</h1>
                <p className="text-sm text-gray-500 mb-8">Edit your profile details</p>
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                <form onSubmit={updateProfile} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#4E3629]">Display Name</label>
                        {/*display name*/}
                        <input
                            type="text"
                            value={display_name}
                            onChange={e => setDisplayName(e.target.value)}
                            required
                            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E3629]"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#4E3629]">Bio <span className="text-gray-400 font-normal">(optional)</span></label>
                        {/*bio*/}
                        <textarea
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            rows={3}
                            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E3629] resize-none"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#4E3629]">Gender <span className="text-gray-400 font-normal">(optional)</span></label>
                        {/*gender*/}
                        <select
                            value={gender}
                            onChange={e => setGender(e.target.value)}
                            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E3629]">
                            <option value="">Prefer not to say</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {/*age*/}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#4E3629]">Age <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input
                            type="number"
                            value={age}
                            onChange={e => setAge(e.target.value)}
                            min={16}
                            max={100}
                            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E3629]"
                        />
                    </div>
                    {/*buttons at end of form*/}
                    <div className="flex items-center gap-3 mt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#4E3629] hover:bg-[#3d2a1f] text-white px-6 py-2 rounded text-sm font-medium transition-colors cursor-pointer disabled:opacity-50">
                            {loading ? 'Saving...' : 'Update'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/home/listings')}
                            className="border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 px-6 py-2 rounded text-sm font-medium transition-colors cursor-pointer">
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}
