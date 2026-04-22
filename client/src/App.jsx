import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {AuthProvider} from './context/authContext.jsx';
import Landing from './pages/student/landing.jsx';
import Homepage from './pages/student/homepage.jsx';
import Login from './pages/auth/login.jsx'
import Register from './pages/auth/register.jsx';
import CreateListing from './pages/student/createownListing.jsx';
import ViewListing from './pages/student/individualListing.jsx'
import ViewOwnListings from './pages/student/viewownListings.jsx'
import UpdateListing from './pages/student/updateListing.jsx'
import ViewSaved from './pages/student/viewSavedListings.jsx'
import UpdateProfile from './pages/student/updateProfile.jsx'
import Messages from './pages/student/messages.jsx'
import MessagesTab from './pages/student/messagesTab.jsx'
import ViewPurchased from './pages/student/viewPurchased.jsx'
import ResetPassword from './pages/auth/forgetPassword.jsx'
import AdminHomepage from './pages/admin/homepage.jsx'
import AdminViewListing from './pages/admin/individualListings.jsx'
import AdminDeletedListings from './pages/admin/deletedListings.jsx'


export default function App() {
  return (
    //we let all components here (as they are within AuthProvider) to call useAuth() and get the token & user
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/landing" element={<Landing/>}/>
          <Route path="/" element={<Navigate to="/landing" replace/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>
          <Route path="/home/profile" element={<UpdateProfile/>}/>
          <Route path="/home/messages" element={<MessagesTab/>}/>
          <Route path="/home/messages/:listing_id" element={<Messages/>}/>
          <Route path="/home/listings" element={<Homepage/>}/>
          <Route path="/home/listings/create" element={<CreateListing/>}/>
          <Route path="/home/listings/own" element={<ViewOwnListings/>}/>
          <Route path="/home/listings/saved" element={<ViewSaved/>}/>
          <Route path="/home/listings/purchased" element={<ViewPurchased/>}/>
          <Route path="/home/listings/update/:item_id" element={<UpdateListing/>}/>
          <Route path="/home/listings/:item_id" element={<ViewListing/>}/>
          <Route path="/admin/home/listings" element={<AdminHomepage/>}/>
          <Route path="/admin/listings/deleted" element={<AdminDeletedListings/>}/>
          <Route path="/admin/listings/:item_id" element={<AdminViewListing/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
