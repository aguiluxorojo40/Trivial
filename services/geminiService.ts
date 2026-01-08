
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestion = async (
  category: Category, 
  history: string[] = [], 
  difficulty: string = "desafiante"
): Promise<Question> => {
  try {
    const historyContext = history.length > 0 
      ? `Evita preguntas relacionadas con estos temas o respuestas: ${history.join(', ')}.` 
      : "";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Eres un maestro de trivia experto. Genera una pregunta de ${category} de nivel ${difficulty}.
      ${historyContext}
      Asegúrate de que la pregunta sea original, no trivial (evita obviedades como capitales básicas) y proporcione un dato curioso en la explicación.
      El idioma debe ser Español de España.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "La pregunta de trivial única." },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              minItems: 4,
              maxItems: 4,
              description: "4 opciones de respuesta plausibles."
            },
            correctAnswer: { type: Type.STRING, description: "La respuesta correcta exacta." },
            explanation: { type: Type.STRING, description: "Dato curioso y breve de por qué es la respuesta correcta." }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    return result;
  } catch (error) {
    console.error("Error generating question:", error);
    return {
      question: "¿Qué elemento químico tiene el símbolo 'Au'?",
      options: ["Plata", "Oro", "Cobre", "Hierro"],
      correctAnswer: "Oro",
      explanation: "El símbolo Au proviene del latín 'aurum', que significa 'amanecer brillante'."
    };
  }
};
