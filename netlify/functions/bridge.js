import net from "net";

export async function handler(event, context) {
  return new Promise((resolve) => {
    const { callsign, password, chatId } = JSON.parse(event.body || "{}");

    if (!callsign || !password || !chatId) {
      resolve({
        statusCode: 400,
        body: "Missing callsign, password or chatId"
      });
      return;
    }

    const serverHost = "141.94.171.16";
    const serverPort = 23001;

    const client = new net.Socket();
    let responseData = "";

    client.connect(serverPort, serverHost, () => {
      console.log("Connected to chat server");

      const loginFrame = `LOGIN|${callsign}|${password}|${chatId}|WebKSTChat|1|1|1|0|0|\n`;
      client.write(loginFrame);
    });

    client.on("data", (data) => {
      responseData += data.toString();
    });

    client.on("end", () => {
      resolve({
        statusCode: 200,
        body: responseData,
      });
    });

    client.on("error", (err) => {
      console.error("Bridge error:", err);
      resolve({
        statusCode: 500,
        body: "Error: " + err.message,
      });
    });
  });
}
