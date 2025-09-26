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
        ip: "0.0.0.0",
        announcedIp: "YOUR_PUBLIC_IP",
        port: 40000,
      },
      {
        protocol: "tcp",
        ip: "0.0.0.0",
        announcedIp: "YOUR_PUBLIC_IP",
        port: 40000,
      },
    ],
  },
};

export default mediasoupConfig;
