const bcrypt = require("bcryptjs");

(async () => {
  const plainPassword = "1234";
  const hashed = await bcrypt.hash(plainPassword, 10);
  console.log("🔐 Hashed password:", hashed);
})();
