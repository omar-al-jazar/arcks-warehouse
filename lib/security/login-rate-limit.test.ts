import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  _resetLoginRateLimitForTests,
  allowLoginAttempt,
  clearLoginFailures,
  recordLoginFailure,
} from "./login-rate-limit";

describe("login rate limit", () => {
  beforeEach(() => {
    _resetLoginRateLimitForTests();
  });

  it("allows under the failure cap", () => {
    for (let i = 0; i < 7; i++) recordLoginFailure("1.2.3.4");
    assert.equal(allowLoginAttempt("1.2.3.4"), true);
  });

  it("blocks after too many failures", () => {
    for (let i = 0; i < 8; i++) recordLoginFailure("9.9.9.9");
    assert.equal(allowLoginAttempt("9.9.9.9"), false);
  });

  it("clears on success path", () => {
    for (let i = 0; i < 8; i++) recordLoginFailure("5.5.5.5");
    clearLoginFailures("5.5.5.5");
    assert.equal(allowLoginAttempt("5.5.5.5"), true);
  });

  it("buckets empty IP as unknown", () => {
    for (let i = 0; i < 8; i++) recordLoginFailure("");
    assert.equal(allowLoginAttempt(""), false);
    assert.equal(allowLoginAttempt("unknown"), false);
  });
});
