import {useState, useEffect} from 'react';
import api from '../../api/client';
import {useNavigate} from 'react-router-dom';
import Navbar from '../../components/navbar.jsx';
import {useAuth} from '../../context/authContext.jsx';

export default function MessagesTab(){
    const navigate = useNavigate()
    const {user} = useAuth()
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    //show all messages with different buyers
    useEffect(() => {
        api.get('/messages/get-conversations')
            .then(res => setConversations(res.data))
            .catch(() => setError('Failed to load conversations.'))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a]">
            <Navbar/>
            <main className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-[#4E3629] mb-1">Messages</h1>
                <p className="text-sm text-gray-500 mb-6">Your conversations</p>
                {loading && <p className="text-center text-gray-400 py-20">Loading...</p>}
                {error && <p className="text-center text-red-500 py-20">{error}</p>}
                {!loading && !error && conversations.length === 0 && (
                    <p className="text-center text-gray-400 py-20">No conversations yet.</p>
                )}
                {!loading && !error && conversations.length > 0 && (
                    <div className="flex flex-col divide-y divide-gray-100">
                        {conversations.map(convo => {
                            const isbuyer = convo.buyer_id === user?.id
                            const otherPerson = isbuyer ? convo.seller : convo.buyer
                            const otherName = otherPerson?.profile?.display_name || 'Unknown'
                            const lastMessage = convo.messages[0]
                            return (
                                <div
                                    key={convo.conversation_id}
                                    //will go to full chat interface when clicked on a message
                                    onClick={() => navigate(`/home/messages/${convo.listing.item_id}`)}
                                    className="flex items-center justify-between py-4 cursor-pointer hover:bg-[#faf8f6] px-2 rounded-lg transition-colors">
                                    {/*ig style dms. other person's name and product name in brown will be visible + date on right*/}
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-semibold text-[#1a1a1a]">{otherName}</span>
                                        <span className="text-xs text-[#A67C52]">{convo.listing.title}</span>
                                        {lastMessage && (
                                            <span className="text-xs text-gray-400 mt-0.5 line-clamp-1">{lastMessage.message_text}</span>
                                        )}
                                    </div>
                                    {lastMessage && (
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                            {new Date(lastMessage.sent_at).toLocaleDateString([], {month: 'short', day: 'numeric'})}
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
