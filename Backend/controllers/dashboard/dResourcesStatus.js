// controllers/dashboard/dResourcesStatus.js
import db from "../../config/db.js";

// Simple in-memory cache (for demonstration). In prod consider Redis.
const cache = {
  fast: { ts: 0, ttl: 8 * 1000, value: null },          // for connections/uptime/slow queries
  tableSizes: { ts: 0, ttl: 5 * 60 * 1000, value: null } // for per-table sizes & totals
};

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Example placeholder for auth middleware -- implement properly in your app
export const checkAdmin = (req, res, next) => {
  // if (!req.user || !req.user.isAdmin) return res.status(403).json({ error: 'Forbidden' });
  return next();
};

export const databaseHealth = async (req, res) => {
  try {
    // ---- fast metrics (cached short) ----
    const now = Date.now();
    if (!cache.fast.value || now - cache.fast.ts > cache.fast.ttl) {
      const [threads] = await db.query("SHOW STATUS LIKE 'Threads_connected'");
      const [uptimeRows] = await db.query("SHOW STATUS LIKE 'Uptime'");
      const [slowQueriesRows] = await db.query("SHOW STATUS LIKE 'Slow_queries'");
      const [maxConnRows] = await db.query("SHOW VARIABLES LIKE 'max_connections'");

      const connections = threads?.[0]?.Value ? Number(threads[0].Value) : 0;
      const uptime = uptimeRows?.[0]?.Value ? Number(uptimeRows[0].Value) : 0;
      const slowQueries = slowQueriesRows?.[0]?.Value ? Number(slowQueriesRows[0].Value) : 0;
      const maxConnections = maxConnRows?.[0]?.Value ? Number(maxConnRows[0].Value) : 0;
      const connectionUsage = maxConnections > 0 ? Number(((connections / maxConnections) * 100).toFixed(1)) : 0;

      cache.fast = {
        ts: now,
        ttl: cache.fast.ttl,
        value: { connections, uptime, slowQueries, maxConnections, connectionUsage, lastUpdated: new Date().toISOString() }
      };
    }

    // ---- table sizes (cached longer) ----
    if (!cache.tableSizes.value || now - cache.tableSizes.ts > cache.tableSizes.ttl) {
      // Get current DB name reliably
      const [currentDb] = await db.query("SELECT DATABASE() as current_db");
      const databaseName = currentDb?.[0]?.current_db || "gradifyclassroom";

      // Query existing tables in that DB
      const [allTables] = await db.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = ?`,
        [databaseName]
      );
      const allTableNames = allTables.map(r => r.table_name || r.TABLE_NAME);

      const myTables = [
        "announcement", "assignment", "assignment_feedback", "assignmentsubmission", "calendarevent",
        "class_enrollment", "classroom", "classroom_members", "comment", "enrollment",
        "material", "milestone", "milestonesubmission", "notification", "project",
        "projectfile", "team", "teammember", "user"
      ];

      const existingTables = allTableNames.filter(t => myTables.includes(t));
      let perTableSizes = [];
      let totalRows = 0;
      let totalSizeRaw = 0;

      if (existingTables.length > 0) {
        // create placeholders for safe parameter binding
        const placeholders = existingTables.map(_ => "?").join(",");
        const params = [databaseName, ...existingTables];

        const [tableSizesRows] = await db.query(
          `
            SELECT table_name,
                   COALESCE(data_length,0) + COALESCE(index_length,0) AS size,
                   COALESCE(table_rows,0) AS table_rows
            FROM information_schema.tables
            WHERE table_schema = ?
              AND table_name IN (${placeholders})
            ORDER BY size DESC
          `,
          params
        );

        perTableSizes = tableSizesRows.map(r => ({
          table: r.table_name,
          size: formatBytes(Number(r.size || 0)),
          rawSize: Number(r.size || 0),
          rows: Number(r.table_rows || 0)
        }));

        // compute totals
        totalRows = perTableSizes.reduce((s, p) => s + p.rows, 0);
        totalSizeRaw = perTableSizes.reduce((s, p) => s + p.rawSize, 0);
      }

      cache.tableSizes = {
        ts: now,
        ttl: cache.tableSizes.ttl,
        value: {
          perTableSizes,
          totalRows,
          totalDatabaseSize: formatBytes(totalSizeRaw),
          lastTableSizeUpdate: new Date().toISOString()
        }
      };
    }

    // Compose response from cached parts
    const fast = cache.fast.value;
    const tbl = cache.tableSizes.value;

    const response = {
      connections: fast.connections,
      maxConnections: fast.maxConnections,
      connectionUsage: fast.connectionUsage,
      uptime: fast.uptime,
      slowQueries: fast.slowQueries,
      totalDatabaseSize: tbl.totalDatabaseSize,
      totalRows: tbl.totalRows,
      perTableSizes: tbl.perTableSizes,
      lastUpdated: fast.lastUpdated,
      lastTableSizeUpdate: tbl.lastTableSizeUpdate
    };

    return res.json(response);

  } catch (err) {
    console.error("Error fetching database health:", err);
    // DO NOT include err.stack in production responses
    return res.status(500).json({
      error: "Failed to fetch database health",
      timestamp: new Date().toISOString()
    });
  }
};

// export default as needed
