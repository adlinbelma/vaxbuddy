export default async (request, response) => {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = request.body;

    if (!imageBase64) {
      return response.status(400).json({ error: 'No image provided' });
    }

    const grokApiKey = process.env.GROK_API_KEY;
    if (!grokApiKey) {
      console.error('GROK_API_KEY not configured');
      return response.status(500).json({ error: 'Server not configured for vaccine extraction' });
    }

    const grokResponse = await fetch('https://api.x.ai/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Extract vaccine information from this image and return ONLY a valid JSON object with these fields. Use null for fields that are not visible or unclear:
{
  "name": "injection/vaccine name (e.g., Pentaxim, Rotasil RTC, Covaxin)",
  "batch": "batch number or lot number",
  "expiry": "expiry date in MM/YYYY or DD/MM/YYYY format",
  "manufacturer": "manufacturer or company name",
  "dateManufactured": "manufacturing date in MM/YYYY or DD/MM/YYYY format"
}

Return ONLY the JSON object, no additional text or explanation.`
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64
              }
            }
          ]
        }],
        max_tokens: 500
      })
    });

    let data;
    const responseText = await grokResponse.text();
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error('Grok API response is not JSON:', responseText);
      return response.status(400).json({ error: 'Grok API error: ' + responseText });
    }

    console.log('Grok response status:', grokResponse.status);
    console.log('Grok response data:', JSON.stringify(data, null, 2));

    if (!grokResponse.ok) {
      console.error('Grok API error - Status:', grokResponse.status, 'Data:', JSON.stringify(data, null, 2));
      return response.status(400).json({ error: 'Grok API failed: ' + (data.error?.message || JSON.stringify(data)) });
    }

    // Extract text content from Grok response (handles both response formats)
    let content = '';
    if (data.choices?.[0]?.message?.content) {
      // OpenAI format
      content = data.choices[0].message.content.trim();
    } else if (data.content && Array.isArray(data.content)) {
      // Grok format - content is an array with thinking and text objects
      const textContent = data.content.find(item => item.type === 'text');
      if (textContent) {
        content = textContent.text.trim();
      }
    }

    if (!content) {
      console.error('No content found in Grok response');
      return response.status(400).json({ error: 'Failed to extract vaccine data from image' });
    }

    // Parse JSON from response
    let extractedData;
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return response.status(400).json({ error: 'No vaccine data found in image', raw: content });
      }
      extractedData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content);
      return response.status(400).json({ error: 'Could not parse vaccine data', raw: content });
    }

    // Validate extracted data
    const validatedData = {
      name: extractedData.name || null,
      batch: extractedData.batch || null,
      expiry: extractedData.expiry || null,
      manufacturer: extractedData.manufacturer || null,
      dateManufactured: extractedData.dateManufactured || null
    };

    return response.status(200).json({ success: true, data: validatedData });
  } catch (error) {
    console.error('Vaccine extraction error:', error);
    return response.status(500).json({ error: 'Server error: ' + error.message });
  }
};
