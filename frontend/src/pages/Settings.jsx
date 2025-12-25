import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiBell, FiGlobe, FiImage } from "react-icons/fi";

const SettingsPage = () => {
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profilePic") || null
  );
  const [emailNotifications, setEmailNotifications] = useState(
    JSON.parse(localStorage.getItem("emailNotifications")) ?? true
  );
  const [pushNotifications, setPushNotifications] = useState(
    JSON.parse(localStorage.getItem("pushNotifications")) ?? true
  );
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "English"
  );

  // Save settings automatically
  useEffect(() => {
    localStorage.setItem("profilePic", profilePic);
    localStorage.setItem("emailNotifications", emailNotifications);
    localStorage.setItem("pushNotifications", pushNotifications);
    localStorage.setItem("language", language);
  }, [profilePic, emailNotifications, pushNotifications, language]);

  // Upload Profile Picture
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setProfilePic(reader.result);
    reader.readAsDataURL(file);
  };

  // Delete Account
  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure? This will remove all your data!")) {
      localStorage.clear();
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center bg-slate-900 text-white">
      <div className="w-full max-w-3xl space-y-6">
        {/* Profile Section */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4 shadow-lg">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FiImage /> Profile Settings
          </h2>

          <div className="flex items-center gap-6">
            <img
              src={profilePic || "https://via.placeholder.com/80"}
              alt="Profile"
              className="h-20 w-20 rounded-full object-cover border-2 border-white/20"
            />
            <label className="bg-indigo-500 px-3 py-1 rounded-xl cursor-pointer text-sm">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 shadow-lg">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FiBell /> Notifications
          </h2>

          <label className="flex justify-between items-center">
            Email Notifications
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
            />
          </label>

          <label className="flex justify-between items-center">
            Push Notifications
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={() => setPushNotifications(!pushNotifications)}
            />
          </label>
        </div>

        {/* Language Preferences */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 shadow-lg">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FiGlobe /> Language
          </h2>

          <select
            className="bg-slate-800 p-2 rounded-xl border border-white/10 text-sm"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>English</option>
            <option>Tamil</option>
            <option>Hindi</option>
          </select>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/50 p-5 shadow-lg">
          <h2 className="text-lg font-semibold text-rose-300">Danger Zone</h2>
          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 mt-3 px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-xl text-white"
          >
            <FiTrash2 /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
