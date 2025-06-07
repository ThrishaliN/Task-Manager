import React, { useState } from 'react';
import { User, Mail, LogOut } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/auth';
import { userApi } from '../lib/api';

const Settings: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      await userApi.updateProfile({ name });
      setSuccess('Profile updated!');
    } catch (err: any) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <PageLayout>
        <div className="page-header">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Settings
          </h1>
        </div>
        <div className="mt-6 rounded-md bg-warning-50 p-4 text-warning-700">
          <p className="font-medium">User not found</p>
          <p className="mt-1 text-sm">Please log in again to view your profile</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="page-header">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Settings
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage your account and preferences
        </p>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <div className="flex flex-col items-center justify-center py-4">
              <img
                src={user.picture}
                alt={user.name}
                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              
              <Button
                variant="danger"
                className="mt-6 flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <Card.Title>Profile Information</Card.Title>
            </Card.Header>
            
            <Card.Content className="mt-4">
              <div className="space-y-6">
                <div>
                  <label className="form-label">Name</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={user.name}
                      readOnly
                      className="form-input rounded-l-none bg-gray-50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Email</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="form-input rounded-l-none bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
          
          <div className="mt-6">
            <Card>
              <Card.Header>
                <Card.Title>Account Settings</Card.Title>
              </Card.Header>
              
              <Card.Content className="mt-4">
                <form onSubmit={handleSave} className="space-y-4 max-w-md">
                  <div>
                    <label className="form-label">Update Name</label>
                    <input
                      type="text"
                      className="form-input w-full"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <Button type="submit" isLoading={saving} variant="primary">
                    Save Changes
                  </Button>
                  {success && <div className="text-green-600 text-sm">{success}</div>}
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                </form>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;