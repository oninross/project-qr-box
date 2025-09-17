import { arucoToSVGString } from "aruco-marker";
import btoa from "btoa";
import { createCanvas, loadImage } from "canvas";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const boxId = searchParams.get("boxId") ?? "0";
  const boxCode = searchParams.get("boxCode") ?? "0";

  // Draw Aruco marker on canvas
  const canvas = createCanvas(370, 370);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 370, 370);

  const svgImage = arucoToSVGString(Number(boxCode), "370px");
  const svgBase64 = btoa(svgImage);
  const svgImg = await loadImage(`data:image/svg+xml;base64,${svgBase64}`);
  ctx.drawImage(svgImg, 0, 0, 370, 370);

  // Draw QR code on top
  const qrUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/box/?boxId=${boxId}&boxCode=${boxCode}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl);
  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(qrImg, 133, 133, 104, 104);

  // Prepare pattern file string
  const smallCanvas = createCanvas(16, 16);
  const smallCtx = smallCanvas.getContext("2d");
  let pattern = "";

  for (let angle = 0; angle > -2 * Math.PI; angle -= Math.PI / 2) {
    smallCtx.save();
    smallCtx.clearRect(0, 0, 16, 16);
    smallCtx.translate(8, 8);
    smallCtx.rotate(angle);
    smallCtx.drawImage(canvas, -8, -8, 16, 16);
    smallCtx.restore();

    const imgData = smallCtx.getImageData(0, 0, 16, 16);
    if (angle !== 0) pattern += "\n";
    for (let c = 2; c >= 0; c--) {
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          if (x !== 0) pattern += " ";
          const idx = y * 16 * 4 + x * 4 + c;
          pattern += String(imgData.data[idx]).padStart(3);
        }
        pattern += "\n";
      }
    }
  }

  return NextResponse.json(
    { pattern },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
