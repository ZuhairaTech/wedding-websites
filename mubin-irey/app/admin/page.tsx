"use client";

import { useEffect, useMemo, useState } from "react";

type GuestWish = {
  timestamp: string;
  attendance: string;
  name: string;
  pax: string;
  wish: string;
};

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8PYAw87bSgiUPN1flygDlaQuPn3fB7BEPVJtGuxJDSwj8JmAZHAAjN0PcDPhjceyd1JKBAORxHMAb/pub?gid=1547346854&single=true&output=csv";

function parseCSV(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (cell || row.length) {
        row.push(cell.trim());
        rows.push(row);
      }
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell.trim());
    rows.push(row);
  }

  return rows;
}

export default function AdminPage() {
  const [data, setData] = useState<GuestWish[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("Semua");
  const [sortBy, setSortBy] = useState("latest");

  const loadData = async () => {
    setLoading(true);

    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const rows = parseCSV(text);

    const result = rows.slice(1).map((row) => ({
      timestamp: row[0] || "-",
      attendance: row[1] || "-",
      name: row[2] || "Tetamu",
      pax: row[3] || "0",
      wish: row[4] || "",
    }));

    setData(result.reverse());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (search.trim()) {
      const keyword = search.toLowerCase();

      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) ||
          item.timestamp.toLowerCase().includes(keyword) ||
          item.wish.toLowerCase().includes(keyword) ||
          item.pax.toLowerCase().includes(keyword)
      );
    }

    if (attendanceFilter !== "Semua") {
      result = result.filter(
        (item) => item.attendance.toLowerCase() === attendanceFilter.toLowerCase()
      );
    }

    if (sortBy === "oldest") {
      result = [...result].reverse();
    }

    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === "pax") {
      result = [...result].sort((a, b) => Number(b.pax || 0) - Number(a.pax || 0));
    }

    return result;
  }, [data, search, attendanceFilter, sortBy]);

  const summary = useMemo(() => {
    const attending = data.filter((item) => item.attendance.toLowerCase() === "ya");
    const totalPax = attending.reduce((sum, item) => {
      const match = item.pax.match(/\d+/);
      const paxNumber = match ? Number(match[0]) : 0;

      return sum + paxNumber;
    }, 0);
    
    return {
      totalResponses: data.length,
      totalAttending: attending.length,
      totalPax,
      totalWishes: data.filter((item) => item.wish).length,
    };
  }, [data]);

  return (
    <main className="min-h-screen bg-[#3b0d17] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl rounded-[34px] bg-[#fffdfb] p-6 md:p-10">
        <div className="text-center mb-8">
          <p className="uppercase tracking-[0.35em] text-xs text-[#c8a390] mb-3">
            Admin
          </p>

          <h1 className="font-serif text-3xl md:text-5xl text-[#3b0d17]">
            Senarai Ucapan & Kehadiran
          </h1>

          <p className="mt-4 text-sm md:text-base leading-8 text-[#7d5c55]">
            Ringkasan RSVP dan ucapan daripada tetamu.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          <SummaryCard title="Jumlah Respon" value={summary.totalResponses} />
          <SummaryCard title="Hadir" value={summary.totalAttending} />
          <SummaryCard title="Jumlah Pax" value={summary.totalPax} />
          <SummaryCard title="Ucapan" value={summary.totalWishes} />
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, tarikh, pax atau ucapan..."
            className="rounded-full border border-[#ead7ca] bg-[#fff8f3] px-5 py-3 text-sm text-[#3b0d17] outline-none placeholder:text-[#c8a390]"
          />

          <select
            value={attendanceFilter}
            onChange={(e) => setAttendanceFilter(e.target.value)}
            className="rounded-full border border-[#ead7ca] bg-[#fff8f3] px-5 py-3 text-sm text-[#3b0d17] outline-none"
          >
            <option>Semua</option>
            <option>Ya</option>
            <option>Tidak</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-full border border-[#ead7ca] bg-[#fff8f3] px-5 py-3 text-sm text-[#3b0d17] outline-none"
          >
            <option value="latest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="name">Nama A-Z</option>
            <option value="pax">Pax Tertinggi</option>
          </select>

        </div>

        <div className="flex flex-wrap gap-3 justify-start md:justify-end">
        <button
            onClick={loadData}
            className="inline-flex items-center gap-2 rounded-full 
                    bg-[#3b0d17] text-[#fff8f3] 
                    px-5 py-3 text-sm 
                    hover:opacity-90 transition shadow-sm"
        >
            Muat Semula
        </button>

        <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full 
                    border border-[#ead7ca] 
                    bg-[#fff8f3] text-[#3b0d17] 
                    px-5 py-3 text-sm 
                    hover:bg-[#f4e5db] transition shadow-sm"
        >
            Cetak Jadual
        </button>
        </div>

        
        <p className="mb-4 text-sm text-[#7d5c55]">
          Paparan: <strong>{filteredData.length}</strong> daripada{" "}
          <strong>{data.length}</strong> respon
        </p>

        {loading ? (
          <p className="text-center text-[#7d5c55]">Sedang memuatkan data...</p>
        ) : (
        <div className="print-area overflow-hidden rounded-[1.5rem] border border-[#ead7ca] bg-[#fff8f3]">
            <div className="hidden print:block mb-4 text-center">
                <h1 className="text-2xl font-serif text-[#3b0d17]">
                Senarai Kehadiran & Ucapan
                </h1>
                <p className="mt-2 text-sm text-[#7d5c55]">
                Jumlah Hadir: <strong>{summary.totalAttending}</strong> orang
                </p>
            </div>
            <div className="max-h-[680px] overflow-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="sticky top-0 z-10 bg-[#3b0d17] text-[#fff8f3]">
                  <tr>
                    <th className="px-5 py-4 text-xs uppercase tracking-[0.2em]">
                      Nama
                    </th>
                    <th className="px-5 py-4 text-xs uppercase tracking-[0.2em]">
                      Pax
                    </th>
                    <th className="px-5 py-4 text-xs uppercase tracking-[0.2em]">
                      Hadir
                    </th>
                    <th className="px-5 py-4 text-xs uppercase tracking-[0.2em]">
                      Tarikh
                    </th>
                    <th className="px-5 py-4 text-xs uppercase tracking-[0.2em]">
                      Ucapan
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#ead7ca] last:border-b-0 align-top"
                    >
                      <td className="px-5 py-4">
                        <p className="font-serif text-sm text-[#3b0d17]">
                          {item.name}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex min-w-10 justify-center rounded-full border border-[#d9b7a5] bg-white px-3 py-1 text-sm text-[#3b0d17]">
                          {item.pax}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs ${
                            item.attendance.toLowerCase() === "ya"
                              ? "bg-[#3b0d17] text-[#fff8f3]"
                              : "bg-white text-[#7d5c55] border border-[#d9b7a5]"
                          }`}
                        >
                          {item.attendance}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm leading-6 text-[#7d5c55] whitespace-nowrap">
                        {item.timestamp}
                      </td>

                      <td className="px-5 py-4 text-sm md:text-base leading-8 text-[#7d5c55]">
                        {item.wish ? `“${item.wish}”` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredData.length === 0 && (
                <p className="p-8 text-center text-[#7d5c55]">
                  Tiada data dijumpai.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-[1.5rem] border border-[#ead7ca] bg-[#fff8f3] p-4 text-center">
      <p className="font-serif text-3xl md:text-4xl text-[#3b0d17]">{value}</p>
      <p className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#c8a390]">
        {title}
      </p>
    </div>
  );
}