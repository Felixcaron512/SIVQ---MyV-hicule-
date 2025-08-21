import express from "express";
import { google } from "googleapis";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());

// 🔑 Charger les credentials du compte de service
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json", // Ton fichier de clé JSON de service
  scopes: ["https://www.googleapis.com/auth/drive.readonly"]
});

const drive = google.drive({ version: "v3", auth });

// 📂 ID du fichier JSON dans Google Drive
const FILE_ID = "TON_FILE_ID"; // ⚠️ Remplace par l’ID du fichier

// API GET /api/data
app.get("/api/data", async (req, res) => {
  try {
    const result = await drive.files.get(
      { fileId: FILE_ID, alt: "media" },
      { responseType: "stream" }
    );

    let data = "";
    result.data.on("data", (chunk) => (data += chunk));
    result.data.on("end", () => {
      res.json(JSON.parse(data));
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur de lecture Google Drive" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API SIVQ en ligne sur le port ${PORT}`);
});
