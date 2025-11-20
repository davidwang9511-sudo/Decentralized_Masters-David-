// David Wang @david9511@gmail.com

import express from "express";
import request from "supertest";
import verifyRouter from "../routes/verify";
import { Wallet } from "ethers";

const app = express();
app.use(express.json());
app.use("/verify-signature", verifyRouter);

describe("POST /verify-signature", () => {
  it("verifies a valid signature", async () => {
    const wallet = Wallet.createRandom();
    const message = "test message";
    const signature = await wallet.signMessage(message);

    const res = await request(app)
      .post("/verify-signature")
      .send({ message, signature })
      .expect(200);

    expect(res.body.isValid).toBe(true);
    expect(res.body.signer.toLowerCase()).toBe(wallet.address.toLowerCase());
    expect(res.body.originalMessage).toBe(message);
  });

  it("returns 400 on missing fields", async () => {
    await request(app).post("/verify-signature").send({}).expect(400);
  });
});
