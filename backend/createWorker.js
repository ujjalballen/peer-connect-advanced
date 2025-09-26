import os from "os";
import * as mediasoup from "mediasoup";
import mediasoupConfig from "./config/mediasoupConfig.js";

export default async function createWorker() {
  let lenght = os.cpus().length;

  let mediasoupWorkers = [];

  for (i = 0; i < lenght; i++) {
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

    console.log(webRtcServerOptions)

    // // Create a WebRtcServer for this worker
    // const webRtcServer = await worker.createWebRtcServer({

    // })
  }

  return workers;
}
