const mediasoupConfig = {
  workerSettings: {
    rtcMinPort: 40000,
    rtcMaxPort: 49999,
    logLevel: "warn",
    logTags: [
      "info",
      "ice",
      "dtls",
      "rtp",
      "srtp",
      "rtcp",
      "rtx",
      "bwe",
      "score",
      "simulcast",
      "svc",
      "sctp",
    ],
  },

  webRtcServerOptions: {
    listenInfos: [
      {
        protocol: "udp",
        ip: "127.0.0.1", // for deploy need to used: 0.0.0.0 ; for run local: 127.0.0.1
        // announcedIp: "YOUR_PUBLIC_IP", // only for deploy PUBLIC IP or DOMAIN NAME
        port: 20000,
      },
      {
        protocol: "tcp",
        ip: "127.0.0.1",
        // announcedIp: "YOUR_PUBLIC_IP",
        port: 20000,
      },
    ],
  },
};

export default mediasoupConfig;
