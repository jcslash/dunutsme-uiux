import React, { memo, useState, useCallback, useMemo } from 'react';
import { EditIcon } from '../visuals/Icons';
import { updateUserProfile, type UserProfile } from '../../lib/userService';

interface DashboardSettingsProps {
  userProfile: UserProfile | null;
  onProfileUpdate?: (profile: UserProfile) => void;
  onLogout?: () => void;
}

// Static JSX hoisted outside component (Rule 6.3: Hoist Static JSX Elements)
const ConnectedAccountsPlaceholder = (
  <div className="p-4 bg-cream rounded-xl text-center text-chocolate-dark/60 text-sm">
    Account connections are managed through Privy authentication.
  </div>
);

// Memoized Toggle component (Rule 5.5: Extract to Memoized Components)
const Toggle = memo<{
  enabled: boolean;
  onToggle: () => void;
}>(({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative w-12 h-6 rounded-full transition-colors ${
      enabled ? 'bg-glaze-pink' : 'bg-chocolate/20'
    }`}
    role="switch"
    aria-checked={enabled}
  >
    <span
      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
        enabled ? 'left-7' : 'left-1'
      }`}
    />
  </button>
));
Toggle.displayName = 'Toggle';

// Memoized NotificationSetting component (Rule 5.5)
const NotificationSetting = memo<{
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}>(({ title, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium text-chocolate-dark">{title}</p>
      <p className="text-sm text-chocolate-dark/60">{description}</p>
    </div>
    <Toggle enabled={enabled} onToggle={onToggle} />
  </div>
));
NotificationSetting.displayName = 'NotificationSetting';

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

  // Derive initials during render (Rule 5.1: Calculate Derived State During Rendering)
  const initials = useMemo(() => {
    if (userProfile?.displayName) {
      return userProfile.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return userProfile?.username?.slice(0, 2).toUpperCase() || 'U';
  }, [userProfile?.displayName, userProfile?.username]);

  // Derive button text during render (Rule 5.1)
  const saveButtonText = isSaving ? 'Saving...' : 'Save Changes';

  // Event handlers with useCallback (Rule 5.7)
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setDisplayName(userProfile?.displayName || '');
    setBio(userProfile?.bio || '');
  }, [userProfile?.displayName, userProfile?.bio]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setDisplayName(userProfile?.displayName || '');
    setBio(userProfile?.bio || '');
  }, [userProfile?.displayName, userProfile?.bio]);

  const handleSave = useCallback(async () => {
    // Early return (Rule 7.8)
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
      alert('Account deletion feature coming soon!');
    }
  }, []);

  // Input handlers
  const handleDisplayNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  }, []);

  const handleBioChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  }, []);

  // Functional setState for toggles (Rule 5.9)
  const handleToggleEmailNotifications = useCallback(() => {
    setEmailNotifications(prev => !prev);
  }, []);

  const handleToggleMarketingEmails = useCallback(() => {
    setMarketingEmails(prev => !prev);
  }, []);

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
          {/* Explicit conditional rendering (Rule 6.8) */}
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 text-chocolate-dark/70 hover:text-chocolate-dark transition-colors"
            >
              <EditIcon className="w-4 h-4" />
              Edit
            </button>
          ) : null}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-glaze-pink to-glaze-orange flex items-center justify-center text-white text-xl font-bold">
            {initials}
          </div>
          {isEditing ? (
            <button className="text-sm text-glaze-pink hover:underline">
              Change avatar
            </button>
          ) : null}
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
                onChange={handleDisplayNameChange}
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
                onChange={handleBioChange}
                placeholder="Tell your supporters about yourself"
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-chocolate/10 focus:border-glaze-pink focus:ring-2 focus:ring-glaze-pink/20 outline-none transition-all resize-none"
              />
            ) : (
              <p className="text-chocolate-dark">{userProfile?.bio || 'No bio yet'}</p>
            )}
          </div>

          {isEditing ? (
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-glaze-pink text-white font-semibold rounded-full hover:bg-glaze-pink/90 transition-colors disabled:opacity-50"
              >
                {saveButtonText}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-chocolate/5 text-chocolate-dark font-semibold rounded-full hover:bg-chocolate/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        <h2 className="text-lg font-semibold text-chocolate-dark mb-4">Connected Accounts</h2>
        <p className="text-chocolate-dark/60 text-sm mb-4">
          Manage the accounts linked to your Donuts Me profile via Privy.
        </p>
        {ConnectedAccountsPlaceholder}
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        <h2 className="text-lg font-semibold text-chocolate-dark mb-4">Notifications</h2>
        
        <div className="space-y-4">
          <NotificationSetting
            title="Email notifications"
            description="Receive emails when you get a new supporter"
            enabled={emailNotifications}
            onToggle={handleToggleEmailNotifications}
          />
          <NotificationSetting
            title="Marketing emails"
            description="Receive updates about new features"
            enabled={marketingEmails}
            onToggle={handleToggleMarketingEmails}
          />
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
