import { GoogleGenAI } from "@google/genai";



export async function callGeminiForImageOcr(base64ImageData, apiKey) {
  console.log('API Key recibida en callGeminiForImageOcr:', apiKey);
  if (!apiKey) {
    const errorMessage = "Error Crítico: La clave de API no fue pasada a la función de OCR. Revisa el componente que la llama.";
    console.error(errorMessage);
    return errorMessage;
  }

  const pureBase64 = base64ImageData.split(',')[1];
  if (!pureBase64) {
    return "Error: El formato de la imagen para la IA no es válido.";
  }

  try {
    const genAI = new GoogleGenAI({apiKey: apiKey});
    const contents = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: pureBase64,
        },
      },
      { text: "Extrae todo el texto visible de esta imagen como si fueras el mega OCR avanzado. Funciona en inglés y en español tambien, si no hay tetxo legible realmente  indicalo" },
    ];
    
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });
    console.log(response.text);
    
    return `IA: ${response.text}`;

  } catch (error) {

    console.error("Error al llamar a la API de Gemini:", error);
    if (error.message.includes('API key not valid')) {
        return "Error: La API key de Gemini no es válida. Revísala en tu archivo .env y reinicia el servidor.";
    }
    return "La IA avanzada no pudo procesar la imagen.";
  }
}