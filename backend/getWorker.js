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





/* 

3️⃣ Hybrid Approach (Round-Robin + Load Awareness)

How it works:

  Default selection is round-robin.

  Check load before assigning; skip overloaded workers.

  If all workers busy → fallback to the least-loaded worker.

Pros:

  Balances fairness and performance.

  Low overhead (doesn’t measure every task constantly).

  Prevents overloading any single worker while still keeping distribution predictable.

Cons:

  Slightly more complex than pure round-robin, but very manageable.

Conclusion: ✅ Best choice for production at scale.


*/