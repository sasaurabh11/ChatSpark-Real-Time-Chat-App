import { useContext } from "react";
import { GetApp as GetAppIcon } from "@mui/icons-material";
import { AccountContext } from "../../../ContextApi/AccountProvide";
import { downloadMedia, formatDate } from "../../../Utills/commonUtills";

const MessageSingle = ({ message }) => {
  const { account, localAccount, person } = useContext(AccountContext);
  const accountValue = account?.sub || localAccount?._id;
  const isOwnMessage = accountValue === message.senderId;

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`flex max-w-xs md:max-w-md lg:max-w-lg ${
          isOwnMessage ? "flex-row-reverse" : ""
        }`}
      >
        {/* Profile Picture */}
        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden m-1">
          <img
            src={
              isOwnMessage
                ? account?.picture || localAccount?.profilePhoto
                : person?.picture || person?.profilePhoto
            }
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Message Content */}
        <div
          className={`rounded-lg px-4 py-2 ${
            isOwnMessage ? "bg-indigo-600" : "bg-gray-700"
          }`}
        >
          {message.type === "file" ? (
            <FileMessage message={message} />
          ) : (
            <TextMessage message={message} isOwnMessage={isOwnMessage} />
          )}
        </div>
      </div>
    </div>
  );
};

const TextMessage = ({ message, isOwnMessage }) => (
  <div className="text-white">
    {isOwnMessage ? (
      <p className="text-sm">{message.text}</p>
    ) : message.translatedText ? (
      <p className="text-sm">{message.translatedText}</p>
    ) : (
      <p className="text-sm">{message.text}</p>
    )}
    <p className="text-xs text-gray-300 text-right mt-1">
      {formatDate(message.createdAt)}
    </p>
  </div>
);

const FileMessage = ({ message }) => {
  const isPDF = message?.text?.includes(".pdf");

  return (
    <div className="relative">
      {isPDF ? (
        <div className="flex items-center bg-gray-800 p-2 rounded">
          <span className="text-white text-sm">PDF File</span>
          <button
            onClick={(e) => downloadMedia(e, message.text)}
            className="ml-2 text-gray-300 hover:text-white"
          >
            <GetAppIcon fontSize="small" />
          </button>
        </div>
      ) : (
        <div className="relative group">
          <img
            src={message.text}
            alt="Media"
            className="max-h-60 rounded-lg object-cover"
          />
          <button
            onClick={(e) => downloadMedia(e, message.text)}
            className="absolute bottom-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GetAppIcon fontSize="small" />
          </button>
        </div>
      )}
      <p className="text-xs text-gray-300 text-right mt-1">
        {formatDate(message.createdAt)}
      </p>
    </div>
  );
};

export default MessageSingle;
