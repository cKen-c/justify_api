import express from "express";
import { justifyText, countWords } from "./justify";
import { TOKENS, generateToken, verifyToken, resetDailyLimit, TokenData } from "./token";
import { checkQuota } from "./rateLimit";

const app = express();
app.use(express.text({ type: "text/plain" }));
app.use(express.json());

// --- Endpoint /api/token ---
app.post("/api/token", (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email manquant ou invalide" });
  }
  const token = generateToken(email);
  res.json({ token });
});


function authenticate(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Token manquant");

  const token = authHeader.split(" ")[1];
  const tokenData = verifyToken(token);
  if (!tokenData) return res.status(403).send("Token invalide");

  req.token = token;
  req.tokenData = tokenData;
  next();
}

// --- Endpoint /api/justify ---
app.post("/api/justify", authenticate, (req: any, res: any) => {
  const text: string = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).send("Aucun texte fourni");
  }

  resetDailyLimit(req.tokenData);

  const words = countWords(text);
  const allowed = checkQuota(req.tokenData, words);
  if (!allowed) return res.status(402).send("Quota quotidien de 80 000 mots atteint");

  const justified = justifyText(text);
  res.type("text/plain").send(justified);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Serveur lancé sur http://localhost:${PORT}`));

app.get("/", (req, res) => {
  res.send("API Justify en marche ✅ Utilise POST /api/token et /api/justify");
});
