import React from 'react';
import SearchIcon from '@mui/icons-material/Search';

function SearchUsers({ setText }) {
    return (
        <div className="p-4 border-b border-gray-700">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="text-gray-400" />
                </div>
                <input
                    type="text"
                    className="w-full py-2 pl-10 pr-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Search users..."
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
        </div>
    );
}

export default SearchUsers;