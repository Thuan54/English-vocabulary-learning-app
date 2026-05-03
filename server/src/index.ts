import { startServer } from "./server";

startServer().catch(console.error);
import app from "./server";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});