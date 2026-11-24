import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { safeRedirectPath } from "./safe-redirect";

describe("safeRedirectPath", () => {
  it("allows normal internal paths", () => {
    assert.equal(safeRedirectPath("/owner/bookings"), "/owner/bookings");
    assert.equal(safeRedirectPath("/manager?x=1"), "/manager?x=1");
  });

  it("blocks protocol-relative and scheme tricks", () => {
    assert.equal(safeRedirectPath("//evil.com"), "/");
    assert.equal(safeRedirectPath("/\\evil.com"), "/");
    assert.equal(safeRedirectPath("/https://evil.com"), "/");
    assert.equal(safeRedirectPath("https://evil.com"), "/");
    assert.equal(safeRedirectPath(""), "/");
    assert.equal(safeRedirectPath(undefined), "/");
  });

  it("uses custom fallback", () => {
    assert.equal(safeRedirectPath("//x", "/manager"), "/manager");
  });
});
