import assert from "node:assert/strict";
import { test } from "node:test";
import { isProductPhoto } from "./photo-url";

test("rejects the junk URLs found on the live shop", () => {
  for (const url of [
    "https://images.dzofilm.com/dzofilm-zh/dzo.ico",
    "https://www.maximummotorsports.com/App_Themes/Maximum_Responsive/images/processing.gif",
    "https://www.pellacraft.com/skin/frontend/ultimo/pellacraft/images/logo.svg",
    "https://www.stagespot.com/pub/media/logo/og/og-default.png",
    "https://punklight.com/app/uploads/2024/10/user_journey_diagram_wrapped_large-1.png",
    "not a url",
    null,
  ]) {
    assert.equal(isProductPhoto(url), false, String(url));
  }
});

test("keeps real product photos", () => {
  for (const url of [
    "https://www.arri.com/resource/image/313836/landscape_ratio1x0_38/1920/737/9d9f306891e0d68757cae8fafb1efeaa/E1A5D59AEF7CE3B1D5B74B0FF298994C/m20-skypanel-s120.jpg",
    "https://www.arri.com/resource/image/83566/x/cr-2019-alexa-mini-lf-product-image-1920x833.jpg",
    "https://example.com/products/iconic-c-stand.webp",
  ]) {
    assert.equal(isProductPhoto(url), true, url);
  }
});
