import app from "./src/app.js";
import { connectDB } from "./src/config/database.config.js";

const PORT = process.env.PORT || 3000;

await connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});