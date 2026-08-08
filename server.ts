import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Safe __dirname resolution for both ESM (dev) and CJS (prod build)
const getDirname = () => {
  if (typeof __dirname !== "undefined") {
    return __dirname;
  }
  if (typeof import.meta !== "undefined" && import.meta.url) {
    return path.dirname(fileURLToPath(import.meta.url));
  }
  return process.cwd();
};

const currentDir = getDirname();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Skill Deconstruction
  app.post("/api/ai-deconstruct-skill", async (req, res) => {
    try {
      const { goal, timeframe, category } = req.body;

      if (!goal || typeof goal !== "string") {
        return res.status(400).json({ error: "請提供想達成的目標或技能名稱" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "未設定 GEMINI_API_KEY，請在 Secrets 面板中設定。",
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `你是一位專業的個人技能規劃教練與技能樹設計師。
使用者希望在【${timeframe || "近階段"}】達成目標：【${goal}】 (類別：${category || "綜合技能"})。

請將這個目標拆解成 4 到 6 個具體且漸進式的「技能任務節點 (Skill Nodes)」，並且為其設計類似 RPG 技能樹的前後置關聯關係，以及對應的「預先獎勵 (Reward)」。

請嚴格返回 JSON 格式（不要包含 markdown \`\`\`json 標籤之外的其他文字），結構如下：
{
  "treeTitle": "目標技能樹名稱",
  "suggestedReward": "完成整棵樹大目標後的終極大獎勵",
  "nodes": [
    {
      "id": "node_1",
      "title": "基礎技能名稱",
      "category": "類別",
      "description": "簡短說明與學習重點",
      "prerequisites": [],
      "difficulty": "Easy" | "Medium" | "Hard",
      "estimatedDays": 7,
      "reward": "小獎勵說明",
      "x": 200,
      "y": 400
    },
    ...
  ]
}

注意事項：
1. 節點之間要具有合理的邏輯遞進（第一階段 1-2 個基礎節點，第二階段進階，第三階段實戰或大成）。
2. prerequisites 陣列放置前置節點的 id，基礎節點的 prerequisites 為空陣列 []。
3. x, y 請提供建議的 2D 視覺位置 layout（x 範圍在 100 到 700 之間，y 範圍在 80 到 500 之間，從下往上生長，根部位於較大的 y 值如 450，頂端部位於小 y 值如 100）。
4. 所有內容請使用 Traditional Chinese (繁體中文)。`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Gemini 沒有返回內容");
      }

      const parsedData = JSON.parse(responseText);
      return res.json({ success: true, data: parsedData });
    } catch (err: any) {
      console.error("AI Deconstruct Error:", err);
      return res.status(500).json({
        error: err.message || "產生技能樹時發生錯誤，請重試",
      });
    }
  });

  // Vite middleware or static server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
