const WebSocket = require('ws');
const config = require('./config');

const wsUrl = `ws://${config.server.host}:${config.server.port}`;

const testConfig = {
    wsUrl,
    numViewers: 2,
    numDirectors: 1,
    testDuration: 10000 // 10 sekuntia
};

console.log('Starting WebSocket connection test with config:', testConfig);

function createWebSocket(role) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(testConfig.wsUrl);
        
        ws.on('open', () => {
            console.log(`${role} connected to ${testConfig.wsUrl}`);
            ws.send(JSON.stringify({ type: 'register', role }));
            resolve(ws);
        });

        ws.on('message', (data) => {
            const message = JSON.parse(data);
            console.log(`${role} received:`, message);
        });

        ws.on('error', (error) => {
            console.error(`${role} error:`, error);
            reject(error);
        });

        ws.on('close', () => {
            console.log(`${role} connection closed`);
        });
    });
}

async function runTest() {
    try {
        // Luo katsojat
        const viewers = await Promise.all(
            Array(testConfig.numViewers).fill().map(() => createWebSocket('viewer'))
        );

        // Luo ohjaajat
        const directors = await Promise.all(
            Array(testConfig.numDirectors).fill().map(() => createWebSocket('director'))
        );

        // Odota testauksen ajan
        await new Promise(resolve => setTimeout(resolve, testConfig.testDuration));

        // Sulje yhteydet
        [...viewers, ...directors].forEach(ws => ws.close());
        
        console.log('Test completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

runTest(); 