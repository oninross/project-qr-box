import { arucoToSVGString } from "aruco-marker";
import btoa from "btoa";
import { createCanvas, loadImage } from "canvas";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

const CANVAS_SIZE = 512;
const WHITE_MARGIN = 0.1;
const ICON_BOUNDS = 369;
const QR_SIZE = 104;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const boxId = searchParams.get("boxId") ?? "0";
  const boxCode = searchParams.get("boxCode") ?? "0";

  // Set up canvas
  const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  const ctx = canvas.getContext("2d");

  // Draw white background and black border
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = "black";
  ctx.fillRect(
    WHITE_MARGIN * CANVAS_SIZE,
    WHITE_MARGIN * CANVAS_SIZE,
    CANVAS_SIZE * (1 - 2 * WHITE_MARGIN),
    CANVAS_SIZE * (1 - 2 * WHITE_MARGIN)
  );
  ctx.setLineDash([5, 3]);
  ctx.strokeStyle = "#c0c0c0";
  ctx.strokeRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Draw Aruco marker
  const svgImage = arucoToSVGString(Number(boxCode), `${ICON_BOUNDS}px`);
  const svgBase64 = btoa(svgImage);

  const svgImg = await loadImage(`data:image/svg+xml;base64,${svgBase64}`);
  ctx.drawImage(
    svgImg,
    (CANVAS_SIZE - ICON_BOUNDS) / 2,
    (CANVAS_SIZE - ICON_BOUNDS) / 2,
    ICON_BOUNDS,
    ICON_BOUNDS
  );

  // Draw QR code
  const qrUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/box/?boxId=${boxId}&boxCode=${boxCode}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl);
  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(qrImg, (CANVAS_SIZE - QR_SIZE) / 2, (CANVAS_SIZE - QR_SIZE) / 2, QR_SIZE, QR_SIZE);

  // Return PNG
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
