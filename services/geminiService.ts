
import { GoogleGenAI, Type } from "@google/genai";

/* DO fix: Use process.env.API_KEY directly for initialization as per guidelines */
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateDesignVisual = async (prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "16:9") => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `高质量室内设计效果图，专业摄影，建筑可视化：${prompt}` }]
      },
      config: {
        imageConfig: {
          aspectRatio,
        }
      }
    });

    /* DO fix: Iterate through parts to correctly find the inlineData (image) part as per guidelines */
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Gemini 未返回图像数据");
  } catch (error) {
    console.error("设计生成失败:", error);
    throw error;
  }
};

export const getDesignAdvice = async (projectContext: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `作为一名高级室内设计师，请为这个项目提供结构化的建议：${projectContext}。
      提供关于照明、空间布局和配色方案的建议。使用清晰的 Markdown 格式返回。`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    /* DO fix: Access .text property directly (not a method) as per guidelines */
    return response.text;
  } catch (error) {
    console.error("获取设计建议失败:", error);
    return "暂时无法获取 AI 建议。";
  }
};

export const analyzeBudget = async (items: { name: string, price: number, quantity: number }[]) => {
  const ai = getAIClient();
  const list = items.map(i => `${i.name}: ${i.quantity} x ￥${i.price}`).join('\n');
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `分析以下装修预算，并建议可以在哪里节省资金或在哪里增加投入：
      ${list}
      提供3条具体的建议。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING, description: '预算整体分析' },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '具体的节省或投入建议'
            }
          },
          required: ["analysis", "suggestions"]
        }
      }
    });
    /* DO fix: Access .text property directly and parse the JSON string */
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("预算分析失败:", error);
    return null;
  }
};
