import fsPromises from 'node:fs/promises';
import {
    AutojoinRoomsMixin,
    LogLevel,
    LogService,
    MatrixClient,
    MessageEvent,
    RichConsoleLogger,
    RustSdkCryptoStorageProvider,
    SimpleFsStorageProvider,
} from "matrix-bot-sdk";

LogService.setLogger(new RichConsoleLogger());
LogService.setLevel(LogLevel.ERROR);
LogService.muteModule("Metrics");
LogService.trace = LogService.debug;

let creds = null;
try {
    creds = require("../config.json");
} catch (e) {
    // ignore
}

const dmTarget = creds?.['dmTarget'] ?? "@admin:localhost";
const homeserverUrl = creds?.['homeserverUrl'] ?? "http://localhost:8008";
const accessToken = creds?.['accessToken'] ?? 'YOUR_TOKEN';
const storage = new SimpleFsStorageProvider("./storage/bot.json");
const crypto = new RustSdkCryptoStorageProvider("./storage/bot_sled");

const client = new MatrixClient(homeserverUrl, accessToken, storage, crypto);
AutojoinRoomsMixin.setupOnClient(client);

let targetRoomId: string | undefined;

(async function() {
    await client.dms.update(); // should update in `start()`, but we're earlier than that here
    targetRoomId = await client.dms.getOrCreateDm(dmTarget);

    client.on("room.message", async (roomId: string, event: any) => {
        if (roomId !== targetRoomId) return;

        const message = new MessageEvent(event);

        if (message.messageType !== "m.text") return;
        if (/^(a|b|up?|d(own)?|l(eft)?|r(ight)?)$/i.test(message.textBody)) {
            emuClient.write(`B:${message.textBody[0].toUpperCase()}`);
        }
        if (/^(start|select)$/i.test(message.textBody)) {
            emuClient.write(`B:${message.textBody.toUpperCase()}`);
        }
        if (/^(s(creenshot)?)$/i.test(message.textBody)) {
            emuClient.write('screenshot');
            setTimeout(async() => {
                const imgBuffer = await fsPromises.readFile('../current.png');
                const img = await client.uploadContent(imgBuffer);
                // await client.replyNotice(roomId, event, "Pong from DM");
                await client.sendMessage(roomId, {
                    body: "current.png",
                    url: img,
                    info: {
                        "h": 160,
                        "mimetype": "image/png",
                        "size": imgBuffer.length,
                        "w": 240
                    },
                    msgtype: "m.image",
                });
            }, 1000);
        }
    });

    LogService.info("index", "Starting bot...");
    await client.start();
})();

// Include Nodejs' net module.
import net from 'node:net';
// The port number and hostname of the server.
const port = 8889;
const host = '127.0.0.1';

// Create a new TCP client.
const emuClient = new net.Socket();
// Send a connection request to the server.
emuClient.connect({ port: port, host: host }, function () {
    // If there is no error, the server has accepted the request and created a new 
    // socket dedicated to us.
    console.log('TCP connection established with the server.');

    // The emuClient can now send data to the server by writing to its socket.
});

// The emuClient can also receive data from the server by reading from its socket.
emuClient.on('data', function (chunk) {
    console.log(`Data received from the server: ${chunk.toString()}.`);

    if (!targetRoomId) {
        return;
    }
    const data = chunk.toString();
    if (data.startsWith('party:')) {
        const partyString = data.substring(6);
        client.sendNotice(targetRoomId, partyString).catch(console.warn);
    }

    // Request an end to the connection after the data has been received.
    // emuClient.end();
});

emuClient.on('end', function () {
    console.log('Requested an end to the TCP connection');
});

