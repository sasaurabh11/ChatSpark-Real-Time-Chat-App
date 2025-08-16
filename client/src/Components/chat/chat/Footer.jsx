import { useEffect, useState } from "react";
import { EmojiEmotions, AttachFile, Mic, Send } from "@mui/icons-material";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";

import { uploadFile } from "../../../Service/api";

const Footer = ({ sendText, value, setValue, setFile, setImage, file }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [isTransliterationOn, setIsTransliterationOn] = useState(false);
  const [isHoveringSend, setIsHoveringSend] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleImageUpload = async () => {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        try {
          const response = await uploadFile(data);
          setImage(response.data);
          setValue("");
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    };
    handleImageUpload();
  }, [file, setImage, setValue]);

  const onFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendText(e);
    }
  };

  return (
    <div className="flex items-center p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Emoji Button */}
      <button
        className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label="Emoji picker"
      >
        <EmojiEmotions fontSize="small" />
      </button>

      {/* File Attachment Button */}
      <label className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
        <AttachFile fontSize="small" className="transform rotate-45" />
        <input
          type="file"
          className="hidden"
          onChange={onFileChange}
          accept="image/*, .pdf"
          aria-label="Attach file"
        />
      </label>

      {/* Language Toggle Button - Moved outside input */}
      <button
        onClick={() => setIsTransliterationOn(!isTransliterationOn)}
        className={`p-2 mx-1 text-xs font-medium rounded-full ${
          isTransliterationOn
            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        } transition-colors duration-200 min-w-[36px]`}
        aria-label={isTransliterationOn ? "Switch to English" : "Switch to Hindi"}
      >
        {isTransliterationOn ? "हिं" : "EN"}
      </button>

      {/* Message Input */}
      <div className="flex-1 mx-2">
        <div className="relative">
          <ReactTransliterate
            type="text"
            placeholder="Type a message..."
            className="w-full py-2.5 px-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12 transition-all duration-200 border border-gray-200 dark:border-gray-600"
            value={value}
            onChangeText={(val) => {
              setValue(val);
              setIsTyping(val.length > 0);
            }}
            lang={isTransliterationOn ? "hi" : "en"}
            onKeyPress={handleKeyPress}
            containerClassName="transliterate-container relative"
            dropdownClassName="react-transliterate-dropdown w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50 max-h-60 overflow-y-auto"
            
          />

          <button
            onClick={isTyping ? sendText : null}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 transition-all duration-200 ${
              isTyping
                ? "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
            }`}
            onMouseEnter={() => setIsHoveringSend(true)}
            onMouseLeave={() => setIsHoveringSend(false)}
            aria-label={isTyping ? "Send message" : "Voice message"}
          >
            {isTyping ? (
              <Send
                fontSize="small"
                className={`transition-transform duration-200 ${
                  isHoveringSend ? "scale-110" : "scale-100"
                }`}
              />
            ) : (
              <Mic fontSize="small" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;