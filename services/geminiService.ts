
import { GoogleGenAI, Type } from "@google/genai";
import { MonthlyInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMonthlyInsight(monthName: string, year: number): Promise<MonthlyInsight> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera una breve reflexión profesional mensual para ${monthName} de ${year}. Incluye una frase motivadora, un enfoque estratégico para el mes y un breve dato histórico interesante. Todo el contenido debe estar en español.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            focus: { type: Type.STRING },
            historicalNote: { type: Type.STRING },
          },
          required: ["quote", "focus", "historicalNote"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    return {
      quote: "La eficiencia es hacer las cosas bien; la efectividad es hacer las cosas correctas.",
      focus: "Planificación Estratégica y Ejecución",
      historicalNote: `${monthName} marca una transición importante en el ciclo trimestral.`
    };
  }
}
