import axios from 'axios';

export async function translateText(text, sourceLang, targetLang) {
    try {
        const src = sourceLang.toLowerCase();
        const tgt = targetLang.toLowerCase();

        if(src === 'en' && tgt === 'hi') {
            const modelName = `Helsinki-NLP/opus-mt-${src}-${tgt}`;

            const response = await axios.post(
                `https://api-inference.huggingface.co/models/${modelName}`,
                {
                    inputs: text
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.HF_API_KEY}`
                    }
                }
            );

            if (Array.isArray(response.data) && response.data[0]?.translation_text) {
                return response.data[0].translation_text;
            } else {
                console.error("Translation failed:", response.data);
                return text; // fallback
            }
        }
        else if(src === 'hi' && tgt === 'en') {
            const encodedText = encodeURIComponent(text);
            const response = await axios.get(
                `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLang}|${targetLang}`
            );

            if(response.data && response.data.responseData && response.data.responseData.translatedText) {
                return response.data.responseData.translatedText
            }
            else {
                console.error("Translation Failed", response.data);
                return text;
            }
        }
        else return text;
    } catch (error) {
        console.error("Translation error:", error.response?.data || error.message);
        return text; 
    }
}
