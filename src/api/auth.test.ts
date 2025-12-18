import { describe, it, expect, beforeAll } from "vitest";
import {
  checkPasswordHash,
  getBearerToken,
  hashPassword,
  makeJWT,
  validateJWT,
} from "./auth";
import { BadRequestError, UnauthorizedError } from "./error";
import { Request } from "express";

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

  it("should return false for the incorrect password", async () => {
    const result = await checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  });

  it("should return false for the incorrect password", async () => {
    const result = await checkPasswordHash(password2, hash1);
    expect(result).toBe(false);
  });
  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password2, hash2);
    expect(result).toBe(true);
  });

  it("should return false for empty password", async () => {
    const result = await checkPasswordHash("", hash1);
    expect(result).toBe(false);
  });

  it("should throw for empty hash", async () => {
    let excep = false;
    try {
      const resullt = await checkPasswordHash(password1, "");
    } catch (err) {
      excep = true;
    }
    expect(excep).toBe(true);
  });
});

describe("JWT Functions", () => {
  const secret = "secret";
  const wrongSecret = "wrong_secret";
  const userID = "some-uuid";
  let validToken: string;

  beforeAll(() => {
    validToken = makeJWT(userID, 3600, secret);
  });

  it("should validate a valid token", () => {
    const result = validateJWT(validToken, secret);
    expect(result).toBe(userID);
  });

  it("should throw error for an invalid token string", () => {
    expect(() => validateJWT("invalid.token.string", secret)).toThrow(
      UnauthorizedError,
    );
  });

  it("should throw error when token signed by wrong secret", () => {
    expect(() => validateJWT(validToken, wrongSecret)).toThrow(
      UnauthorizedError,
    );
  });
});

// describe("JWT Functions: Bearer Token header", () => {
//   const validToken = "validToken";

//   it("should return a valid token", () => {
//     const req: Request = {
//       headers: { authorization: `Bearer ${validToken}` },
//     } as Request;
//     const result = getBearerToken(req);
//     expect(result).toBe(validToken);
//   });

//   it("should throw error for missing auth header", () => {
//     const req: Request = {
//       headers: {},
//     } as Request;
//     expect(() => getBearerToken(req)).toThrow(BadRequestError);
//   });

//   it("should throw error for empty auth header", () => {
//     const req: Request = {
//       headers: { authorization: "" },
//     } as Request;
//     expect(() => getBearerToken(req)).toThrow(BadRequestError);
//   });

//   it("should throw error for malformed auth header", () => {
//     const req: Request = {
//       headers: { authorization: "Bearer" },
//     } as Request;
//     expect(() => getBearerToken(req)).toThrow(BadRequestError);
//   });

//   it("should throw error for malformed auth header", () => {
//     const req: Request = {
//       headers: { authorization: validToken },
//     } as Request;
//     expect(() => getBearerToken(req)).toThrow(BadRequestError);
//   });

//   it("should throw error for malformed auth header", () => {
//     const req: Request = {
//       headers: { authorization: "Bearer not" },
//     } as Request;
//     expect(() => getBearerToken(req)).toThrow(BadRequestError);
//   });

//   it("should throw error for malformed auth header", () => {
//     const req: Request = {
//       headers: { authorization: `bearer ${validToken}` },
//     } as Request;
//     expect(() => getBearerToken(req)).toThrow(BadRequestError);
//   });
// });
