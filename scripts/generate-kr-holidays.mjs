import fs from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";

const BASE =
  "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo";

const parser = new XMLParser({ ignoreAttributes: false });

function pad2(n) {
  return String(n).padStart(2, "0");
}

function yyyymmddToIso(yyyymmdd) {
  const s = String(yyyymmdd);
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

async function fetchMonth({ serviceKey, year, month }) {
  const url = new URL(BASE);
  url.searchParams.set("serviceKey", serviceKey);
  url.searchParams.set("solYear", String(year));
  url.searchParams.set("solMonth", pad2(month));
  url.searchParams.set("numOfRows", "100");
  url.searchParams.set("pageNo", "1");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);

  const xml = await res.text();
  const json = parser.parse(xml);

  const items = json?.response?.body?.items?.item;
  if (!items) return [];

  return Array.isArray(items) ? items : [items];
}

async function main() {
  const year = Number(process.argv[2] || "2025");
  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY;
  if (!serviceKey) throw new Error("Missing env: DATA_GO_KR_SERVICE_KEY");

  const map = {}; // { "YYYY-MM-DD": "공휴일명" }

  for (let m = 1; m <= 12; m++) {
    const items = await fetchMonth({ serviceKey, year, month: m });

    for (const it of items) {
      // 공휴일만 필터
      if (String(it?.isHoliday || "").toUpperCase() !== "Y") continue;

      const iso = yyyymmddToIso(it.locdate);
      const name = String(it.dateName || "").trim();
      if (!name) continue;

      map[iso] = name;
    }
  }

  const outDir = path.join(process.cwd(), "public", "holidays");
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, `${year}.json`);
  fs.writeFileSync(outPath, JSON.stringify(map, null, 2), "utf-8");

  console.log(`✅ wrote ${outPath} (${Object.keys(map).length} holidays)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
