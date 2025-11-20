// David Wang @david9511@gmail.com

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import verifyRouter from "./routes/verify";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/verify-signature", verifyRouter);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: "internal_server_error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
