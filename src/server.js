import express from "express";

const PORT = process.env.PORT || 6000
const app = express();
app.use(express.json());


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))