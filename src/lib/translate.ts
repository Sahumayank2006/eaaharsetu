/**
 * Translates a given text to a target language using the backend API.
 * @param text The text to translate.
 * @param targetLang The target language code (e.g., 'hi', 'en').
 * @returns The translated text.
 */
export async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, targetLang }),
    });

    if (!response.ok) {
      throw new Error('Translation request failed');
    }

    const data = await response.json();
    return data.translatedText || text; // Fallback to original text on error
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Fallback to original text on error
  }
}
