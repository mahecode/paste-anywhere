import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: 'https://wired-jaybird-58995.upstash.io',
    token: 'AeZzAAIncDIxNDUyMjNmMjZmM2Q0M2EzYjQyY2NmNzUxZGVhM2YwMHAyNTg5OTU',
});

async function testConnection() {
    try {
        console.log('Testing connection...');
        await redis.set('test-key', 'Hello from script');
        const value = await redis.get('test-key');
        console.log('Success! Retrieved:', value);
        await redis.del('test-key');
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

testConnection();
