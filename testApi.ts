import fs from "fs";
import fetch from "node-fetch";

const API_URL = "http://localhost:3000"; // ou 3001 si tu as changé de port
const EMAIL = "test@example.com"; // ton email pour générer un token

async function main() {
  try {
    // --- 1️⃣ Récupérer un token ---
    console.log("🔑 Récupération du token...");
    const tokenResponse = await fetch(`${API_URL}/api/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: EMAIL }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Erreur /api/token: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }

    const tokenData = (await tokenResponse.json()) as { token: string };
    const token = tokenData.token;

    console.log("✅ Token reçu :", token);

    // --- 2️⃣ Lire le fichier input.txt ---
    const inputText = fs.readFileSync("input.txt", "utf-8");
    console.log("📖 Texte à justifier lu depuis input.txt");

    // --- 3️⃣ Envoyer le texte à /api/justify ---
    console.log("⚙️ Envoi du texte pour justification...");
    const justifyResponse = await fetch(`${API_URL}/api/justify`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: inputText,
    });

    if (!justifyResponse.ok) {
      throw new Error(`Erreur /api/justify: ${justifyResponse.status} ${justifyResponse.statusText}`);
    }

    const justifiedText = await justifyResponse.text();

    // --- 4️⃣ Sauvegarder le résultat dans output.txt ---
    fs.writeFileSync("output.txt", justifiedText);
    console.log("✅ Texte justifié enregistré dans output.txt");
  } catch (err) {
    console.error("❌ Erreur:", err);
  }
}

main();
