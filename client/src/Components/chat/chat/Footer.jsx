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
    <div className="flex items-center p-2 md:p-3 bg-gray-800 border-t border-gray-700 shadow-sm">
      {/* Left buttons */}
      <div className="flex items-center space-x-1 md:space-x-2">
        <button className="p-1 md:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors duration-200">
          <EmojiEmotions fontSize="small" />
        </button>

        <label className="p-1 md:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors duration-200 cursor-pointer">
          <AttachFile fontSize="small" className="transform rotate-45" />
          <input
            type="file"
            className="hidden"
            onChange={onFileChange}
            accept="image/*, .pdf"
          />
        </label>
      </div>

      {/* Input field */}
      <div className="flex-1 mx-1 md:mx-2">
        <div className="relative">
          <ReactTransliterate
            type="text"
            placeholder="Type a message..."
            className="w-full py-2 px-3 md:py-2.5 md:px-4 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10 md:pr-12 transition-all duration-200 border border-gray-600 text-sm md:text-base"
            value={value}
            onChangeText={(val) => {
              setValue(val);
              setIsTyping(val.length > 0);
            }}
            lang={isTransliterationOn ? "hi" : "en"}
            onKeyPress={handleKeyPress}
          />

          {/* Language toggle */}
          <button
            onClick={() => setIsTransliterationOn(!isTransliterationOn)}
            className={`absolute right-10 md:right-12 top-1/2 transform -translate-y-1/2 text-xs px-1.5 py-0.5 rounded ${
              isTransliterationOn
                ? "text-indigo-400 bg-indigo-900/30"
                : "text-gray-400"
            }`}
          >
            {isTransliterationOn ? "हिं" : "EN"}
          </button>

          {/* Send button */}
          <button
            onClick={isTyping ? sendText : null}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 ${
              isTyping ? "text-indigo-400" : "text-gray-500"
            }`}
          >
            {isTyping ? <Send fontSize="small" /> : <Mic fontSize="small" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;