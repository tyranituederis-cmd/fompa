"use client";

import { QRCodeSVG } from "qrcode.react";

export function SertifikatQr({ value }: { value: string }) {
  return <QRCodeSVG value={value} size={84} bgColor="#ffffff" fgColor="#111827" level="M" />;
}
