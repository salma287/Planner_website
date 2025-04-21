const pool = require("./db");

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Database connected successfully at:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Error connecting to the database:", err);
  } finally {
    await pool.end(); // Close the pool
  }
})();
