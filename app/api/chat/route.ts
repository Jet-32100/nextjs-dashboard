import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    
    // Use the entire conversation history for context
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: history // Use the full history array
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({ 
      response: response
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Error processing request' }, 
      { status: 500 }
    );
  }
}