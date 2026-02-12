import { Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import New from './pages/New';
import Edit from './pages/Edit';
import Signout from './pages/Signout';
import Pdf from './components/Pdf';
import ProtectedRoute from './components/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchUser } from './store/reducers/userReducer';
import Login from './pages/Login';
import Register from './pages/Register';
import "./api/axiosInterceptors";
import Profile from './pages/Profile';
import OAuth2Redirect from './pages/OAuth2Redirect';


function App() {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchUser())
  },[dispatch])
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/pdf' element={<Pdf />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/oauth2/redirect' element={<OAuth2Redirect />} />


      {/*  Protected routes */}
      <Route element={<ProtectedRoute />}>
      <Route path='/profile' element={<Profile />} />

        <Route path='/dashboard' element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='new' element={<New />} />
          <Route path='edit/:id' element={<Edit />} />
        </Route>
      </Route>

      <Route path='/sign-out' element={<Signout />} />
    </Routes>
  );
}

export default App;
