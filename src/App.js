import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import TrackingForm from './components/TrackingForm';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import './App.css';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = React.useContext(AuthContext);
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<TrackingForm />} />
                        <Route path="/login" element={<AdminLogin />} />
                        <Route 
                            path="/admin" 
                            element={
                                <PrivateRoute>
                                    <AdminPanel />
                                </PrivateRoute>
                            } 
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;