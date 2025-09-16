import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { arucoToSVGString } from "aruco-marker";
import btoa from "btoa";
import { createCanvas, loadImage } from "canvas";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const boxId = searchParams.get("boxId") ?? "0";
  const boxCode = searchParams.get("boxCode") ?? "0";

  // Canvas setup
  const canvasSize = 512;
  const canvas = createCanvas(canvasSize, canvasSize);
  const ctx = canvas.getContext("2d");

  // Draw white background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw black border (like your generateQrBase)
  const whiteMargin = 0.1;
  ctx.fillStyle = "black";
  ctx.fillRect(
    whiteMargin * canvas.width,
    whiteMargin * canvas.width,
    canvas.width * (1 - 2 * whiteMargin),
    canvas.width * (1 - 2 * whiteMargin)
  );

  // Draw Aruco marker in the center
  const iconBounds = 369;
  const svgImage = arucoToSVGString(Number(boxCode), `${iconBounds}px`);
  const svgBase64 = btoa(svgImage);
  const svgImg = await loadImage(`data:image/svg+xml;base64,${svgBase64}`);
  ctx.drawImage(
    svgImg,
    canvas.width / 2 - iconBounds / 2,
    canvas.height / 2 - iconBounds / 2,
    iconBounds,
    iconBounds
  );

  // Draw QR code in the center
  const qrUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/box/?boxId=${boxId}&boxCode=${boxCode}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl);
  const qrImg = await loadImage(qrDataUrl);
  const qrSize = 104;
  ctx.drawImage(
    qrImg,
    canvas.width / 2 - qrSize / 2,
    canvas.height / 2 - qrSize / 2,
    qrSize,
    qrSize
  );

  // Output PNG
  const buffer = canvas.toBuffer("image/png");

  // Convert Node.js Buffer to Uint8Array for NextResponse
  const uint8Array = new Uint8Array(buffer);

  return new NextResponse(uint8Array, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
