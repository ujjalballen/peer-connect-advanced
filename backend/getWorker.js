async function getWorker(workers) {
    // Map over workers to get their CPU usage
    const workersLoad = await Promise.all(
        workers.map(async (worker) => {
            const stats = await worker.getResourceUsage();
            const cpuUsage = stats.ru_utime + stats.ru_stime; // Example calculation
            return cpuUsage;
        })
    );

    // Find the least loaded worker
    let leastLoadedWorker = 0;
    let leastWorkerLoad = workersLoad[0]; // Initialize with the first worker's load

    for (let i = 1; i < workersLoad.length; i++) {
        if (workersLoad[i] < leastWorkerLoad) {
            leastLoadedWorker = i;
            leastWorkerLoad = workersLoad[i];
        }
    }

    return workers[leastLoadedWorker];
}

export default getWorker;
