import React, { useEffect, useState } from "react";
import axios from "axios";

const DatabaseDashboard = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await axios.get("/api/system/db-health"); // relative path
        setHealth(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const fastInterval = setInterval(fetchHealth, 8000); // poll every 8s for fast metrics
    return () => clearInterval(fastInterval);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!health) return <p>Failed to load health</p>;

  const hours = Math.floor(health.uptime / 3600);
  const minutes = Math.floor((health.uptime % 3600) / 60);

  // color indicator for connection usage
  const usage = Number(health.connectionUsage || 0);
  const usageColor = usage < 60 ? "text-green-600" : usage < 85 ? "text-yellow-600" : "text-red-600";

  const topTables = (health.perTableSizes || []).slice(0, 8);

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-2xl">
      <h2 className="text-2xl font-bold">Gradify Classroom Database Health</h2>

      <div className="mt-3">
        <p><strong>Connections:</strong> {health.connections} / {health.maxConnections} <span className={usageColor}>({usage}%)</span></p>
        <p><strong>Total Database Size:</strong> {health.totalDatabaseSize}</p>
        <p><strong>Uptime:</strong> {hours}h {minutes}m</p>
        <p><strong>Slow Queries:</strong> {health.slowQueries}</p>
        <p className="text-sm text-gray-500">Last metrics update: {new Date(health.lastUpdated).toLocaleString()}</p>
        <p className="text-sm text-gray-500">Last table-size update: {new Date(health.lastTableSizeUpdate).toLocaleString()}</p>
      </div>

      <h3 className="mt-4 font-semibold">Top Tables by Size</h3>
      <ul className="mt-2">
        {topTables.map(t => (
          <li key={t.table}>
            <strong>{t.table}</strong>: {t.size} ({t.rows} rows)
          </li>
        ))}
      </ul>
      {(health.perTableSizes || []).length > topTables.length && (
        <p className="mt-2 text-sm text-blue-600">Show more… (implement on-click to expand)</p>
      )}
    </div>
  );
};

export default DatabaseDashboard;
