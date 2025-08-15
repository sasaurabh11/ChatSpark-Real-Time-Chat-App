import { useEffect, useState } from 'react';
import { EmojiEmotions, AttachFile, Mic, Send } from '@mui/icons-material';

import { uploadFile } from '../../../Service/api';

const Footer = ({ sendText, value, setValue, setFile, setImage, file }) => {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const handleImageUpload = async () => {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        try {
          const response = await uploadFile(data);
          setImage(response.data);
          setValue(''); // Clear text input when file is selected
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    };
    handleImageUpload();
  }, [file]);

  const onFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendText(e);
    }
  };

  return (
    <div className="flex items-center p-2 bg-gray-700 border-t border-gray-600">
      {/* Emoji Button */}
      <button className="p-2 text-gray-400 hover:text-indigo-400 rounded-full hover:bg-gray-600 transition-colors">
        <EmojiEmotions />
      </button>

      {/* File Attachment Button */}
      <label className="p-2 text-gray-400 hover:text-indigo-400 rounded-full hover:bg-gray-600 transition-colors cursor-pointer">
        <AttachFile className="transform rotate-45" />
        <input
          type="file"
          className="hidden"
          onChange={onFileChange}
          accept="image/*, .pdf"
        />
      </label>

      {/* Message Input */}
      <div className="flex-1 mx-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full py-3 px-4 bg-gray-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setIsTyping(e.target.value.length > 0);
            }}
            onKeyPress={handleKeyPress}
          />
          {isTyping ? (
            <button 
              onClick={sendText}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-indigo-400 hover:text-indigo-300"
            >
              <Send />
            </button>
          ) : (
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-300">
              <Mic />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;