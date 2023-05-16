const request = require('supertest');
const assert = require('assert');
const app = require('../index');

/**
 * Testing create game endpoint
 */
describe('POST /api/games', () => {
    let data = {
        publisherId: "1234567890",
        name: "Test App",
        platform: "ios",
        storeId: "1234",
        bundleId: "test.bundle.id",
        appVersion: "1.0.0",
        isPublished: true
    }
    it('respond with 200 and an object that matches what we created', async () => {
        const { body, status } = await request(app)
            .post('/api/games')
            .set('Accept', 'application/json')
            .send(data)
        assert.strictEqual(status, 200);
        assert.strictEqual(body.publisherId, '1234567890');
        assert.strictEqual(body.name, 'Test App');
        assert.strictEqual(body.platform, 'ios');
        assert.strictEqual(body.storeId, '1234');
        assert.strictEqual(body.bundleId, 'test.bundle.id');
        assert.strictEqual(body.appVersion, '1.0.0');
        assert.strictEqual(body.isPublished, true);
    });
});

/**
 * Testing get all games endpoint
 */
describe('GET /api/games', () => {
    it('respond with json containing a list that includes the game we just created', async () => {
        const { body, status } = await request(app)
            .get('/api/games')
            .set('Accept', 'application/json')
        assert.strictEqual(status, 200);
        assert.strictEqual(body[0].publisherId, '1234567890');
        assert.strictEqual(body[0].name, 'Test App');
        assert.strictEqual(body[0].platform, 'ios');
        assert.strictEqual(body[0].storeId, '1234');
        assert.strictEqual(body[0].bundleId, 'test.bundle.id');
        assert.strictEqual(body[0].appVersion, '1.0.0');
        assert.strictEqual(body[0].isPublished, true);
    });
});


/**
 * Testing update game endpoint
 */
describe('PUT /api/games/1', () => {
    let data = {
        id : 1,
        publisherId: "999000999",
        name: "Test App Updated",
        platform: "android",
        storeId: "5678",
        bundleId: "test.newBundle.id",
        appVersion: "1.0.1",
        isPublished: false
    }
    it('respond with 200 and an updated object', async () => {
        const { body, status } = await request(app)
            .put('/api/games/1')
            .set('Accept', 'application/json')
            .send(data)
        assert.strictEqual(status, 200);
        assert.strictEqual(body.publisherId, '999000999');
        assert.strictEqual(body.name, 'Test App Updated');
        assert.strictEqual(body.platform, 'android');
        assert.strictEqual(body.storeId, '5678');
        assert.strictEqual(body.bundleId, 'test.newBundle.id');
        assert.strictEqual(body.appVersion, '1.0.1');
        assert.strictEqual(body.isPublished, false);
    });
});



/**
 * Testing update game endpoint
 */
describe('DELETE /api/games/1', () => {
    it('respond with 200', async () => {
        const { body, status } = await request(app)
            .delete('/api/games/1')
            .set('Accept', 'application/json')
        assert.strictEqual(status, 200);
        assert.strictEqual(body.id, 1);
    });
});

/**
 * Testing get all games endpoint
 */
describe('GET /api/games', () => {
    it('respond with json containing no games', async () => {
        const { body, status } = await request(app)
            .get('/api/games')
            .set('Accept', 'application/json')
        assert.strictEqual(status, 200);
        assert.strictEqual(body.length, 0);
    });
});

/**
 * Testing search game endpoint
 */
describe('POST /api/games/search', () => {
    it('respond with 200 and return a list of "test" games for android platform only', async () => {
        let data = {
            name: "Test",
            platform: "android",
        }

        await request(app)
            .post('/api/games')
            .set('Accept', 'application/json')
            .send({
                publisherId: "1234567890",
                name: "Test App",
                platform: "android",
                storeId: "1233",
                bundleId: "test.bundle.id",
                appVersion: "1.0.5",
                isPublished: true
            })

        await request(app)
            .post('/api/games')
            .set('Accept', 'application/json')
            .send({
                publisherId: "234567891",
                name: "test App",
                platform: "ios",
                storeId: "123456",
                bundleId: "test.bundle.id",
                appVersion: "2.0.0",
                isPublished: true
            });



        const { body, status } = await request(app)
            .post('/api/games/search')
            .set('Accept', 'application/json')
            .send(data)
        assert.strictEqual(status, 200);
        assert.strictEqual(body.length, 1);
        assert.strictEqual(body[0].publisherId, '1234567890');
        assert.strictEqual(body[0].name, 'Test App');
        assert.strictEqual(body[0].platform, 'android');
        assert.strictEqual(body[0].storeId, '1233');
        assert.strictEqual(body[0].bundleId, 'test.bundle.id');
        assert.strictEqual(body[0].appVersion, '1.0.5');
        assert.strictEqual(body[0].isPublished, true);
    });

    it('respond with 200 and return a list of "app" games for all platform ', async () => {
        let data = {
            name: "App",
            platform: "",
        }

        // Arrange:
        await request(app)
            .post('/api/games')
            .set('Accept', 'application/json')
            .send({
                publisherId: "234567891",
                name: "Other App",
                platform: "ios",
                storeId: "34567",
                bundleId: "test.bundle.id",
                appVersion: "2.0.0",
                isPublished: true
            });

        await request(app)
            .post('/api/games')
            .set('Accept', 'application/json')
            .send({
                publisherId: "234567891",
                name: "test",
                platform: "android",
                storeId: "45678",
                bundleId: "test.bundle.id",
                appVersion: "2.0.0",
                isPublished: true
            });

        //Assert:
        const { body, status } = await request(app)
            .post('/api/games/search')
            .set('Accept', 'application/json')
            .send(data)
        assert.strictEqual(status, 200);
        assert.strictEqual(body.length, 3);
    });
});

/**
 * Testing search game endpoint
 */
describe('POST /api/games/populate', () => {
    it('respond with 204 and populate database with new entries', async () => {
        //Assert:
        const { status } = await request(app)
            .post('/api/games/populate')
            .send();
        assert.strictEqual(status, 204);
    });
});