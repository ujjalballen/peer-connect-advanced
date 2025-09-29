import os from "os";
import * as mediasoup from "mediasoup";
import mediasoupConfig from "./config/mediasoupConfig.js";

export default async function createWorker() {
  let lenght = os.cpus().length;

  let mediasoupWorkers = [];

  for (let i = 0; i < lenght; i++) {
    const worker = await mediasoup.createWorker({
      rtcMinPort: mediasoupConfig.workerSettings.rtcMinPort,
      rtcMaxPort: mediasoupConfig.workerSettings.rtcMaxPort,
      logLevel: mediasoupConfig.workerSettings.logLevel,
      logTags: mediasoupConfig.workerSettings.logTags,
    });

    worker.on("died", () => {
      console.log(
        `Mediasoup Worker died, exiting  in 5 seconds... [pid:%d]', worker.pid)`
      );
      setTimeout(() => process.exit(1), 5000);
    });

    // Clone base WebRtcServer options
    const webRtcServerOptions = JSON.parse(
      JSON.stringify(mediasoupConfig.webRtcServerOptions)
    );

    // console.log("webRtcServerOptions", webRtcServerOptions);

    // Increment port manually for each worker
    for (const listenInfo of webRtcServerOptions.listenInfos) {
      listenInfo.port += i;

      // console.log("webRtcServerOptions", webRtcServerOptions);
    }

    // Create WebRtcServer with unique ports
    const webRtcServer = await worker.createWebRtcServer(webRtcServerOptions);

    // console.log("webRtcServer: ", webRtcServer);

    // Attach the server to the worker's appData for reference
    worker.appData.webRtcServer = webRtcServer;

    mediasoupWorkers.push(worker);

    console.log(`Worker ${i} created. WebRtcServer UDP/TCP port: ${webRtcServerOptions.listenInfos[0].port}`);
  }

  return mediasoupWorkers;
}
