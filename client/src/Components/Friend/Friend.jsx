import React, { useState } from 'react';
import SearchUsers from './SearchUsers';
import SendrequestUI from './SendrequestUI';

function Friend() {
    const [text, setText] = useState('');

    return (
        <div className="flex flex-col h-full bg-gray-900">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Add Friends</h2>
            </div>
            <SearchUsers setText={setText} />
            <SendrequestUI text={text} />
        </div>
    );
}

export default Friend;