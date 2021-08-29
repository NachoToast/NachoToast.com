"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// routes
const users_1 = __importDefault(require("./routes/users"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json({ limit: '30mb' }));
app.use(express_1.default.urlencoded({ limit: '30mb', extended: true }));
app.use((0, cors_1.default)());
app.use('/users', users_1.default);
app.get('/', (req, res) => {
    res.send('API response!');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
