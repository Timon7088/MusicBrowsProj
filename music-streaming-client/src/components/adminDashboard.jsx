import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authClient } from '../clients/auth-client';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = authClient.useSession();
  const user = data?.user;
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, isLoading]);

  const renderSection = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/admin/songs-management')}
          className="bg-gray-800 hover:bg-green-700 border border-green-500 text-white text-lg py-4 px-6 rounded-xl shadow-md transition duration-200"
        >
          ניהול שירים
        </button>
        <button
          onClick={() => navigate('/admin/artists-management')}
          className="bg-gray-800 hover:bg-green-700 border border-green-500 text-white text-lg py-4 px-6 rounded-xl shadow-md transition duration-200"
        >
          ניהול אמנים
        </button>
        <button
          onClick={() => navigate('/auth/admin/users')}
          className="bg-gray-800 hover:bg-green-700 border border-green-500 text-white text-lg py-4 px-6 rounded-xl shadow-md transition duration-200"
        >
          ניהול משתמשים
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">
            עריכת אדמין
          </h1>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
