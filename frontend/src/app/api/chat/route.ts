import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get the backend API URL from environment or default to localhost
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';

    // Forward the request to the FastAPI backend
    const response = await fetch(`${backendUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Proxy Error:', error);

    // Return a fallback response
    return NextResponse.json({
      response: "Désolé, le service est temporairement indisponible. Veuillez réessayer plus tard.",
      status: "error"
    }, { status: 500 });
  }
}