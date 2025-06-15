
// File: src/pages/AdminShareAnalytics.jsx (with time filter + export CSV)
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BD4"];

function AdminShareAnalytics() {
  const [shares, setShares] = useState([]);
  const [range, setRange] = useState("all");

  const getRangeQuery = () => {
    if (range === "day") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return where("createdAt", ">=", Timestamp.fromDate(today));
    }
    if (range === "week") {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      return where("createdAt", ">=", Timestamp.fromDate(date));
    }
    return null;
  };

  useEffect(() => {
    const fetchShares = async () => {
      const base = collection(db, "shares");
      const condition = getRangeQuery();
      const q = condition ? query(base, condition) : base;
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => doc.data());
      setShares(list);
    };
    fetchShares();
  }, [range]);

  const byPlatform = shares.reduce((acc, s) => {
    acc[s.platform] = (acc[s.platform] || 0) + 1;
    return acc;
  }, {});

  const platformData = Object.entries(byPlatform).map(([platform, value]) => ({ name: platform, value }));

  const byVideo = shares.reduce((acc, s) => {
    acc[s.videoId] = (acc[s.videoId] || 0) + 1;
    return acc;
  }, {});

  const videoData = Object.entries(byVideo).map(([videoId, count]) => ({ name: videoId.slice(0, 6) + "...", count }));

  const exportCSV = () => {
    const csv = ["videoId,platform,date"];
    shares.forEach(s => {
      csv.push(`${s.videoId},${s.platform},${s.createdAt?.toDate().toISOString() || ""}`);
    });
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shares-${range}.csv`;
    a.click();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin - Share Analytics</h1>
        <select value={range} onChange={(e) => setRange(e.target.value)} className="border p-1">
          <option value="all">Duk lokaci</option>
          <option value="week">Makon nan</option>
          <option value="day">Yau</option>
        </select>
      </div>
      <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-1 mb-3 rounded">Export CSV</button>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Shares by Platform</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={platformData} dataKey="value" nameKey="name" outerRadius={80}>
                {platformData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Shares by Video</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={videoData} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminShareAnalytics;
