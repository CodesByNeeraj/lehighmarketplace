import {useState, useEffect, useRef} from 'react';
import api from '../../api/client';
import {useNavigate, useParams} from 'react-router-dom';
import Navbar from '../../components/navbar.jsx';
import {useAuth} from '../../context/authContext.jsx';
import {Send} from 'lucide-react';

export default function Messages(){
    const navigate = useNavigate()
    const {listing_id} = useParams()
    const {user} = useAuth()
    const [messages, setMessages] = useState([])
    const [conversation, setConversation] = useState(null)
    const [messageText, setMessageText] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [sold, setSold] = useState(false)
    const [listingTitle, setListingTitle] = useState('')
    const [error, setError] = useState('')
    const bottomRef = useRef(null)

    useEffect(() => {
        Promise.all([
            api.get(`/messages/get-messages/${listing_id}`),
            api.get(`/listings/view-listing/${listing_id}`)
        ])
            .then(([msgRes, listingRes]) => {
                setConversation(msgRes.data)
                setMessages(msgRes.data.messages)
                setSold(listingRes.data.is_sold)
                setListingTitle(listingRes.data.title)
            })
            .catch(err => {
                if (err.response?.status !== 404) setError('Failed to load messages.')
            })
            .finally(() => setLoading(false))
    },[listing_id])

    const isSeller = conversation?.seller_id === user?.id

    const markAsSold = () => {
        api.put(`/listings/mark-sold/${listing_id}`)
            .then(() => setSold(true))
            .catch(() => setError('Failed to mark as sold.'))
    }

    //scroll to bottom whenever new messages come in
    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'})
    },[messages])

    const sendMessage = (e) => {
        e.preventDefault()
        setSending(true)
        api.post(`/messages/send-message/${listing_id}`,{message_text: messageText})
            .then(res => {
                //we add new messages to the current array of messages
                setMessages(prev => [...prev, res.data])
                //clear input box
                setMessageText('')
            })
            .catch(() => setError('Failed to send message.'))
            .finally(() => setSending(false))
    }

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a] flex flex-col">
            <Navbar/>
            <main className="max-w-6xl w-full mx-auto px-6 py-8 flex flex-col flex-1">
                {/*when convo is opened, user has option to go back to messages*/}
                <button
                    type="button"
                    onClick={() => navigate(`/home/messages`)}
                    className="text-sm text-[#4E3629] hover:underline mb-4 self-start">
                    Back to Messages
                </button>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-[#4E3629]">Messages</h1>
                        {listingTitle && <p className="text-sm text-gray-500 mt-0.5">Re: {listingTitle}</p>}
                    </div>
                    {isSeller && (
                        <button
                            type="button"
                            onClick={markAsSold}
                            disabled={sold}
                            className="text-sm px-4 py-1.5 rounded border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-default border-green-500 text-green-600 hover:bg-green-50">
                            {sold ? 'Marked as Sold' : 'Mark as Sold'}
                        </button>
                    )}
                </div>
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                {/*messages area*/}
                <div className="flex-1 border border-gray-200 rounded-lg p-4 overflow-y-auto flex flex-col gap-3 min-h-[400px] max-h-[500px]">
                    {loading && <p className="text-sm text-gray-400 text-center m-auto">Loading messages...</p>}
                    {!loading && messages.length === 0 && (
                        <p className="text-sm text-gray-400 text-center m-auto">Send a message to start chat with seller!</p>
                    )}
                    {!loading && messages.map(msg => {
                        const isOwn = msg.sender_id === user?.id
                        return (
                            <div key={msg.message_id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${isOwn ? 'bg-[#4E3629] text-white rounded-br-sm' : 'bg-[#f5f0eb] text-[#1a1a1a] rounded-bl-sm'}`}>
                                    <p>{msg.message_text}</p>
                                    <p className={`text-xs mt-1 ${isOwn ? 'text-white/60' : 'text-gray-400'}`}>
                                        {new Date(msg.sent_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={bottomRef}/>
                </div>
                {/*input*/}
                <form onSubmit={sendMessage} className="flex items-center gap-3 mt-4">
                    <input
                        type="text"
                        value={messageText}
                        onChange={e => setMessageText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E3629]"
                    />
                    {/*button disabled when message is currently being sent or empty inputs*/}
                    <button
                        type="submit"
                        disabled={sending || !messageText.trim()}
                        className="bg-[#4E3629] hover:bg-[#3d2a1f] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer">
                        <Send size={16}/>
                    </button>
                </form>
            </main>
        </div>
    )
}
