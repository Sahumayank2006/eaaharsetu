import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing text or targetLang' }, { status: 400 });
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      text
    )}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Translation API request failed');
    }

    const data = await response.json();
    
    // The response is a nested array, the translated text is in the first element.
    const translatedText = data[0].map((item: any) => item[0]).join('');

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Failed to translate text' }, { status: 500 });
  }
}
