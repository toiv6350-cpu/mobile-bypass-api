const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

async function performBypass(url) {
    try {
        const apiUrl = `https://bypass.vip{encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.result) {
            return data.result; 
        } else if (data && data.destination) {
            return data.destination;
        }
        return "Không thể giải mã link này hoặc API bảo trì.";
    } catch (error) {
        return "Lỗi kết nối đến máy chủ giải mã.";
    }
}

app.post('/api/bypass', async (req, res) => {
    try {
        const targetUrl = req.body.url;
        if (!targetUrl) {
            return res.status(400).json({ success: false, message: "Vui lòng cung cấp URL" });
        }
        const result = await performBypass(targetUrl);
        res.json({ success: true, key: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi hệ thống" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
