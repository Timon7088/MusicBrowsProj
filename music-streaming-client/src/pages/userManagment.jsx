import { useEffect, useState } from 'react';
import { authClient } from '../clients/auth-client';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

export default function UserManagment() {
  const { data, isLoading } = authClient.useSession();
  const user = data?.user;
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({role: '' });
  const [newUser, setNewUser] = useState({
    email: '',
    username: '',
    password: '',
    role: 'user'
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('create'); // 'create', 'edit', 'delete'
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      console.log("Attempting to fetch users...");
      authClient.admin.listUsers({ query: { limit: 100 } })
        .then(res => {
          console.log("Users fetched successfully:", res);
          setUsers(res.data.users);
        })
        .catch(err => {
          console.error("Error fetching users:", err);
          toast.error("שגיאה בטעינת משתמשים: " + err.message);
        });
    } else {
      console.log("User is not admin:", user);
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק משתמש זה?")) {
      try {
        await authClient.admin.removeUser({ userId: id });
        setUsers(users.filter(u => u.id !== id));
        toast.success("המשתמש נמחק בהצלחה!");
        console.log(users);
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error('שגיאה במחיקת המשתמש: ' + err.message);
      }
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setForm({
      email: user.email || '',
      name: user.name || '',
      role: user.role || 'user'
    });
    setActiveTab('edit');
  };

  const handleSave = async () => {
    try {
      await authClient.admin.setRole({
        userId: selectedUser.id,
        role: form.role, 
      });
      setEditId(null);
      setUsers(users.map(u => (u.id === editId ? { ...u, ...form } : u)));
      toast.success("המשתמש עודכן בהצלחה!");
      setActiveTab('create');
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error('שגיאה בעדכון המשתמש: ' + err.message);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const res = await authClient.admin.createUser({
        email: newUser.email,
        name: newUser.username,
        password: newUser.password,
        role: newUser.role
      });

      if (res?.error) throw res.error;

      if (res?.data?.user) {
        setUsers([...users, res.data.user]);
        setNewUser({ email: '', username: '', password: '', role: 'user' });
        toast.success("המשתמש נוסף בהצלחה!");
      } else {
        setErrorMessage("הוספת המשתמש נכשלה - נסה שוב.");
      }
    } catch (err) {
      if (err?.status === 422) {
        setErrorMessage("האימייל הזה כבר קיים במערכת, נסה מייל אחר.");
      } else {
        setErrorMessage("שגיאה בהוספת המשתמש: " + err.message);
      }
    }
  };

  if (isLoading) return <p>טוען...</p>;

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-4 text-center text-red-600 font-bold text-xl">
        אין לך הרשאה לגשת לדף זה.
      </div>
    );
  }

  const renderCreateUserForm = () => (
    <div className="mb-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-400">הוספת משתמש חדש</h2>
      
      {errorMessage && (
        <div className="w-full bg-red-600 text-white px-4 py-3 rounded mb-6 text-center font-medium shadow-md">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleAddUser} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            אימייל
          </label>
          <input
            type="email"
            id="email"
            placeholder="אימייל"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
            שם משתמש
          </label>
          <input
            type="text"
            id="username"
            placeholder="שם משתמש"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            סיסמה
          </label>
          <input
            type="password"
            id="password"
            placeholder="סיסמה"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
            תפקיד
          </label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2 space-x-reverse">
              <input
                type="radio"
                name="role"
                value="user"
                checked={newUser.role === 'user'}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 focus:ring-green-400"
              />
              <span className="text-gray-300">משתמש</span>
            </label>
            <label className="flex items-center space-x-2 space-x-reverse">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={newUser.role === 'admin'}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 focus:ring-green-400"
              />
              <span className="text-gray-300">מנהל</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-400 text-black font-bold rounded hover:bg-green-500 transition"
        >
          הוסף משתמש
        </button>
      </form>
    </div>
  );

  const renderEditUserForm = () => (
    <div className="mb-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-400">עריכת משתמש</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
        <div>
          <label htmlFor="edit-role" className="block text-sm font-medium text-gray-300 mb-2">
            תפקיד
          </label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2 space-x-reverse">
              <input
                type="radio"
                name="edit-role"
                value="user"
                checked={form.role === 'user'}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 focus:ring-green-400"
              />
              <span className="text-gray-300">משתמש</span>
            </label>
            <label className="flex items-center space-x-2 space-x-reverse">
              <input
                type="radio"
                name="edit-role"
                value="admin"
                checked={form.role === 'admin'}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 focus:ring-green-400"
              />
              <span className="text-gray-300">מנהל</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 py-3 bg-green-400 text-black font-bold rounded hover:bg-green-500 transition"
          >
            שמור שינויים
          </button>
          <button
            type="button"
            onClick={() => setEditId(null)}
            className="flex-1 py-3 bg-gray-600 text-white font-bold rounded hover:bg-gray-700 transition"
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );

  const renderEditUserTab = () => (
    <div className="mb-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-400">עריכת המשתמשים</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">בחר משתמש לעריכה</label>
        <select
          className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          value={selectedUser?.id || ''}
          onChange={e => {
            const user = users.find(u => u.id === e.target.value);
            setSelectedUser(user);
            setForm({
              email: user?.email || '',
              name: user?.name || '',
              role: user?.role || 'user'
            });
          }}
        >
          <option value="">בחר משתמש...</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
          ))}
        </select>
      </div>
      {selectedUser && renderEditUserForm()}
    </div>
  );

  const renderUsersList = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-400">כל המשתמשים</h2>
      <div className="overflow-x-auto">
        <table className="w-full border text-right">
          <thead>
            <tr className="bg-gray-700 text-gray-200">
              <th className="p-2">שם משתמש</th>
              <th className="p-2">אימייל</th>
              <th className="p-2">תפקיד</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-gray-600 hover:bg-gray-700">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsersDelete = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-400">מחיקת משתמשים</h2>
      <div className="overflow-x-auto">
        <table className="w-full border text-right">
          <thead>
            <tr className="bg-gray-700 text-gray-200">
              <th className="p-2">שם משתמש</th>
              <th className="p-2">אימייל</th>
              <th className="p-2">תפקיד</th>
              <th className="p-2">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-gray-600 hover:bg-gray-700">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                  >
                    מחק
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-6xl mx-auto text-white mb-10" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-green-400 text-center">ניהול משתמשים</h1>

      {/* טאבים */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border border-gray-700 p-1 bg-gray-800">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'create'
                ? 'bg-green-500 text-black'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            יצירת משתמש
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'edit'
                ? 'bg-green-500 text-black'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            עריכת משתמשים
          </button>
          <button
            onClick={() => setActiveTab('delete')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'delete'
                ? 'bg-green-500 text-black'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            מחיקת משתמשים
          </button>
        </div>
      </div>

      {/* תוכן לפי טאב נבחר */}
      {activeTab === 'create' && renderCreateUserForm()}
      {activeTab === 'edit' && renderEditUserTab()}
      {activeTab === 'delete' && renderUsersDelete()}

      {/* רשימת משתמשים תמיד מוצגת בתחתית */}
      <div className="mt-8">
        {renderUsersList()}
      </div>
    </div>
  );
}
