import { NextResponse } from "next/server";
import os from "os";

export const dynamic = "force-dynamic";

export async function GET() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsagePct = ((usedMem / totalMem) * 100).toFixed(1);

  const cpus = os.cpus();
  const cpuModel = cpus[0]?.model || "Unknown CPU";
  
  // os.loadavg() returns an array containing the 1, 5, and 15 minute load averages.
  // The load average is a measure of system activity calculated by the operating system and expressed as a fractional number.
  const loadAvg = os.loadavg();
  const cpuUsagePct = (loadAvg[0] * 100 / cpus.length).toFixed(1);

  const uptimeSeconds = os.uptime();
  const days = Math.floor(uptimeSeconds / (3600 * 24));
  const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);

  let uptimeStr = "";
  if (days > 0) uptimeStr += `${days}d `;
  if (hours > 0) uptimeStr += `${hours}h `;
  uptimeStr += `${minutes}m`;

  return NextResponse.json({
    memory: {
      total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + " GB",
      used: (usedMem / 1024 / 1024 / 1024).toFixed(2) + " GB",
      percent: parseFloat(memUsagePct)
    },
    cpu: {
      model: cpuModel,
      cores: cpus.length,
      usagePercent: Math.min(100, parseFloat(cpuUsagePct)) // Cap at 100% just in case
    },
    uptime: uptimeStr || "0m",
    nodeVersion: process.version,
    platform: os.platform(),
    timestamp: new Date().toISOString()
  });
}
