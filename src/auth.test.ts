import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash, getBearerToken } from "./auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

    it("creates and validates a JWT", () => {
    const secret = "test-secret";
    const token = makeJWT("user123", 60, secret);
    const payload: any = validateJWT(token, secret) as any;
    expect(payload).toBe("user123");
  });

  it("rejects expired tokens", () => {
    const secret = "test-secret";
    // create a token already expired by setting negative expiresIn
    const token = makeJWT("user123", -10, secret);
    expect(() => validateJWT(token, secret)).toThrow();
  });

  it("rejects tokens signed with the wrong secret", () => {
    const secretA = "secret-A";
    const secretB = "secret-B";
    const token = makeJWT("user123", 60, secretA);
    expect(() => validateJWT(token, secretB)).toThrow();
  });

  it("hashes and verifies password hashes", async () => {
    const pw = "correct-horse-battery-staple";
    const hash = await hashPassword(pw);
    const ok = await checkPasswordHash(pw, hash);
    expect(ok).toBe(true);
    const wrong = await checkPasswordHash("nope", hash);
    expect(wrong).toBe(false);
  });
});