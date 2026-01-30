import React, { memo, useState, useCallback } from 'react';
import { EditIcon, SettingsIcon } from '../visuals/Icons';
import { updateUserProfile, type UserProfile } from '../../lib/userService';

interface DashboardSettingsProps {
  userProfile: UserProfile | null;
  onProfileUpdate?: (profile: UserProfile) => void;
  onLogout?: () => void;
}

export const DashboardSettings: React.FC<DashboardSettingsProps> = memo(({ 
  userProfile, 
  onProfileUpdate,
  onLogout 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setDisplayName(userProfile?.displayName || '');
    setBio(userProfile?.bio || '');
  }, [userProfile]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setDisplayName(userProfile?.displayName || '');
    setBio(userProfile?.bio || '');
  }, [userProfile]);

  const handleSave = useCallback(async () => {
    if (!userProfile) return;
    
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedProfile = updateUserProfile(userProfile.privyId, {
      displayName: displayName.trim() || userProfile.username,
      bio: bio.trim(),
    });
    
    if (updatedProfile && onProfileUpdate) {
      onProfileUpdate(updatedProfile);
    }
    
    setIsSaving(false);
    setIsEditing(false);
  }, [userProfile, displayName, bio, onProfileUpdate]);

  const handleDeleteAccount = useCallback(() => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement account deletion
      alert('Account deletion feature coming soon!');
    }
  }, []);

  const initials = userProfile?.displayName 
    ? userProfile.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : userProfile?.username?.slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-chocolate-dark">Settings</h1>
        <p className="text-chocolate-dark/60 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-chocolate-dark">Profile</h2>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 text-chocolate-dark/70 hover:text-chocolate-dark transition-colors"
            >
              <EditIcon className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-glaze-pink to-glaze-orange flex items-center justify-center text-white text-xl font-bold">
            {initials}
          </div>
          {isEditing && (
            <button className="text-sm text-glaze-pink hover:underline">
              Change avatar
            </button>
          )}
        </div>

        {/* Profile Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-chocolate-dark/70 mb-1">Username</label>
            <p className="text-chocolate-dark">@{userProfile?.username || 'username'}</p>
            <p className="text-xs text-chocolate-dark/50 mt-1">Username cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm text-chocolate-dark/70 mb-1">Display Name</label>
            {isEditing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="w-full px-4 py-2 rounded-xl border border-chocolate/10 focus:border-glaze-pink focus:ring-2 focus:ring-glaze-pink/20 outline-none transition-all"
              />
            ) : (
              <p className="text-chocolate-dark">{userProfile?.displayName || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-chocolate-dark/70 mb-1">Bio</label>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell your supporters about yourself"
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-chocolate/10 focus:border-glaze-pink focus:ring-2 focus:ring-glaze-pink/20 outline-none transition-all resize-none"
              />
            ) : (
              <p className="text-chocolate-dark">{userProfile?.bio || 'No bio yet'}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-glaze-pink text-white font-semibold rounded-full hover:bg-glaze-pink/90 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-chocolate/5 text-chocolate-dark font-semibold rounded-full hover:bg-chocolate/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        <h2 className="text-lg font-semibold text-chocolate-dark mb-4">Connected Accounts</h2>
        <p className="text-chocolate-dark/60 text-sm mb-4">
          Manage the accounts linked to your Donuts Me profile via Privy.
        </p>
        <div className="p-4 bg-cream rounded-xl text-center text-chocolate-dark/60 text-sm">
          Account connections are managed through Privy authentication.
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        <h2 className="text-lg font-semibold text-chocolate-dark mb-4">Notifications</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-chocolate-dark">Email notifications</p>
              <p className="text-sm text-chocolate-dark/60">Receive emails when you get a new supporter</p>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                emailNotifications ? 'bg-glaze-pink' : 'bg-chocolate/20'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  emailNotifications ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-chocolate-dark">Marketing emails</p>
              <p className="text-sm text-chocolate-dark/60">Receive updates about new features</p>
            </div>
            <button
              onClick={() => setMarketingEmails(!marketingEmails)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                marketingEmails ? 'bg-glaze-pink' : 'bg-chocolate/20'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  marketingEmails ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl p-6 border border-red-200">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
        <p className="text-chocolate-dark/60 text-sm mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-6 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
});

DashboardSettings.displayName = 'DashboardSettings';
