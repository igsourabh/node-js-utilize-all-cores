const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numWorkers = os.cpus().length;

  console.log(`Master process is running with PID ${process.pid} and will spawn ${numWorkers} workers`);

  // Spawn worker processes
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  // Listen for worker process exits and respawn them
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    console.log(`Respawning worker ${worker.process.pid}`);
    cluster.fork();
  });
} else {
  // Worker process code
  console.log(`Worker process with PID ${process.pid} started`);

  // start your server here
  const express = require('express');
  const app = express();
  app.get('/', (req, res) => {
    res.send(`Hello from worker ${process.pid}`);
  });
  app.listen(5000);
}
