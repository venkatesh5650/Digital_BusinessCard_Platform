import { db } from "../lib/db";
import dotenv from "dotenv";
dotenv.config();

async function promote() {
  const email = "karthanvenkateshvenkatesh@gmail.com";
  try {
    const user = await db.user.update({
      where: { email },
      data: { role: "ADMIN" }
    });
    console.log("Successfully promoted:", user.email, "to ADMIN role.");
  } catch (error) {
    console.error("Failed to promote user:", error);
  }
}

promote();
