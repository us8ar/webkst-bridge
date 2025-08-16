import net from "net";
import WebSocket, { WebSocketServer } from "ws";

const TELNET_HOST = "141.94.171.16";  // твой сервер
const TELNET_PORT = 23001;

const PORT = process.env.PORT || 10000; // Render сам даст порт
const wss = new WebSocketServer({ port: PORT });

console.log(`✅ WebSocket мост слушает на порту ${PORT}`);

wss.on("connection", (ws) => {
  console.log("🌐 Браузер подключился");

  const client = new net.Socket();
  client.connect(TELNET_PORT, TELNET_HOST, () => {
    console.log("🔗 Соединение с Telnet установлено");
  });

  client.on("data", (data) => ws.send(data.toString("utf8")));
  client.on("close", () => ws.close());

  ws.on("message", (msg) => client.write(msg.toString()));
  ws.on("close", () => client.end());
});
