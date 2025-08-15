import { useContext } from "react";
import { AccountContext } from "../../ContextApi/AccountProvide";

const Profile = () => {
    const { account, localAccount } = useContext(AccountContext);
    const profilePicture = account?.picture || localAccount?.profilePhoto;
    const profileName = account?.name || localAccount?.name;
    const profileEmail = account?.email || localAccount?.email;

    return (
        <div className="p-6 text-gray-100">
            {/* Profile Picture */}
            <div className="flex justify-center mb-6">
                <div className="relative">
                    <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500/30"
                    />
                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                </div>
            </div>

            {/* Profile Info Sections */}
            <div className="space-y-6">
                {/* Name Section */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Your name</p>
                    <p className="text-lg font-medium">{profileName}</p>
                </div>

                {/* About Section */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">About</p>
                    <p className="text-gray-300">Hey there! I'm using ChatSpark</p>
                </div>

                {/* Email Section */}
                {profileEmail && (
                    <div className="bg-gray-700 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Email</p>
                        <p className="text-gray-300">{profileEmail}</p>
                    </div>
                )}

                {/* Info Note */}
                <div className="text-xs text-gray-400 p-4 bg-gray-800/50 rounded-lg">
                    This is not your username or pin. This name will be visible to your contacts.
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                    <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;