import axios from "axios";

async function translateText(text, sourceLang, targetLang) {
  try {
    const encodedText = encodeURIComponent(text);

    const response = await axios.get(
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLang}|${targetLang}`
    );

    return {
      original: text,
      translated: response.data.responseData.translatedText,
      quality: response.data.responseData.match,
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function testIndianLanguages() {
  // Common Indian languages with codes supported by MyMemory
  const tests = [
    { text: "Hello world", from: "en", to: "hi" },  // Hindi
    // { text: "नमस्ते दुनिया", from: "hi", to: "en" },  // Hindi
    // { text: "হ্যালো ওয়ার্ল্ড", from: "bn", to: "en" }, // Bengali
    // { text: "வணக்கம் உலகம்", from: "ta", to: "en" }, // Tamil
    // { text: "హలో వరల్డ్", from: "te", to: "en" },   // Telugu
    // { text: "ಹಲೋ ವರ್ಲ್ಡ್", from: "kn", to: "en" },  // Kannada
    // { text: "ഹലോ വേൾഡ്", from: "ml", to: "en" }, // Malayalam
    // { text: "હેલો વર્લ્ડ", from: "gu", to: "en" }, // Gujarati
    // { text: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਦੁਨੀਆ", from: "pa", to: "en" }, // Punjabi
    // { text: "ନମସ୍କାର ବିଶ୍ୱ", from: "or", to: "en" }, // Odia
    // { text: "हॅलो वर्ल्ड", from: "mr", to: "en" }, // Marathi
    // { text: "আসসালামু আলাইকুম দুনিয়া", from: "ur", to: "en" }, // Urdu
  ];

  for (const t of tests) {
    const result = await translateText(t.text, t.from, t.to);
    console.log(`\n${t.from} → ${t.to}`);
    console.log("Original:", result.original);
    console.log("Translated:", result.translated);
    console.log("Quality:", result.quality);
  }
}

testIndianLanguages();
