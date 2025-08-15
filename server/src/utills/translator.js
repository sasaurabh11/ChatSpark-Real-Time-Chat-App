import axios from 'axios';

const supportedPairs = new Set([
    'en-hi', 'hi-en', 'en-fr', 'fr-en', 'en-es', 'es-en', 'en-de', 'de-en',
    'en-ar', 'ar-en', 'en-ru', 'ru-en', 'en-zh', 'zh-en',
    'en-ja', 'ja-en', 'en-ko', 'ko-en',
]);

export async function translateText(text, sourceLang, targetLang) {
    try {
        const src = sourceLang.toLowerCase();
        const tgt = targetLang.toLowerCase();
        const pairKey = `${src}-${tgt}`;

        if (!supportedPairs.has(pairKey)) {
            console.error(`No direct model for ${pairKey}`);
            return text; 
        }

        const modelName = `Helsinki-NLP/opus-mt-${src}-${tgt}`;
        console.log(`Translating using: ${modelName}`);

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
    } catch (error) {
        console.error("Translation error:", error.response?.data || error.message);
        return text; 
    }
}
