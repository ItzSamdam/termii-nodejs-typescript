import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import NodeTermii from '../src/termiiClient';

describe('NodeTermii', () => {
    let client: NodeTermii;
    let mock: MockAdapter;

    beforeEach(() => {
        client = new NodeTermii('test-api-key');
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    it('should return balance data on successful request', async () => {
        mock.onGet('https://api.ng.termii.com/api/get-balance?api_key=test-api-key').reply(200, { balance: 100 });

        const result = await client.balance();
        expect(result).toEqual({ balance: 100 });
    });

    it('should return error message on failed balance request', async () => {
        mock.onGet('https://api.ng.termii.com/api/get-balance?api_key=test-api-key').reply(400);

        const result = await client.balance();
        expect(result).toBe('Bad Request: Indicates that the server cannot process the request due to a client error.');
    });

    it('should return history data on successful request', async () => {
        mock.onGet('https://api.ng.termii.com/api/sms/inbox?api_key=test-api-key').reply(200, { messages: [] });

        const result = await client.history();
        expect(result).toEqual({ messages: [] });
    });

    it('should return error message on failed history request', async () => {
        mock.onGet('https://api.ng.termii.com/api/sms/inbox?api_key=test-api-key').reply(401);

        const result = await client.history();
        expect(result).toBe('Unauthorized: No valid API key provided.');
    });

    it('should return phone status on successful request', async () => {
        mock.onGet('https://api.ng.termii.com/api/insight/number/query?api_key=test-api-key&phone_number=1234567890&country_code=NG').reply(200, { status: 'active' });

        const result = await client.status(1234567890, 'NG');
        expect(result).toEqual({ status: 'active' });
    });

    it('should return error message on failed phone status request', async () => {
        mock.onGet('https://api.ng.termii.com/api/insight/number/query?api_key=test-api-key&phone_number=1234567890&country_code=NG').reply(404);

        const result = await client.status(1234567890, 'NG');
        expect(result).toBe('Not Found: The requested resource doesn\'t exist.');
    });

    it('should return DND status on successful search request', async () => {
        mock.onGet('https://api.ng.termii.com/api/check/dnd?api_key=test-api-key&phone_number=1234567890').reply(200, { is_dnd: false });

        const result = await client.search(1234567890);
        expect(result).toEqual({ is_dnd: false });
    });

    it('should return error message on failed search request', async () => {
        mock.onGet('https://api.ng.termii.com/api/check/dnd?api_key=test-api-key&phone_number=1234567890').reply(429);

        const result = await client.search(1234567890);
        expect(result).toBe('Too Many Requests: User has sent too many requests in a given amount of time.');
    });

    it('should return all sender IDs on successful request', async () => {
        mock.onGet('https://api.ng.termii.com/api/sender-id?api_key=test-api-key').reply(200, { sender_ids: [] });

        const result = await client.allSenderId();
        expect(result).toEqual({ sender_ids: [] });
    });

    it('should return error message on failed sender ID request', async () => {
        mock.onGet('https://api.ng.termii.com/api/sender-id?api_key=test-api-key').reply(403);

        const result = await client.allSenderId();
        expect(result).toBe('Forbidden: The API key doesn\'t have permissions to perform the request.');
    });

    it('should return sender ID submission response on successful request', async () => {
        mock.onPost('https://api.ng.termii.com/api/sender-id/request').reply(200, { message: 'Sender ID submitted' });

        const result = await client.submitSenderId('TestSender', 'Marketing', 'TestCompany');
        expect(result).toEqual({ message: 'Sender ID submitted' });
    });

    it('should return error message on failed sender ID submission', async () => {
        mock.onPost('https://api.ng.termii.com/api/sender-id/request').reply(422);

        const result = await client.submitSenderId('TestSender', 'Marketing', 'TestCompany');
        expect(result).toBe('Unprocessable Entity: Server understands the content but couldn\'t process the request.');
    });

    it('should return message sent response on successful sendMessage request', async () => {
        mock.onPost('https://api.ng.termii.com/api/sms/send').reply(200, { message_id: 'abc123' });

        const result = await client.sendMessage(1234567890, 'TestSender', 'Hello, this is a test message');
        expect(result).toEqual({ message_id: 'abc123' });
    });

    it('should return error message on failed sendMessage request', async () => {
        mock.onPost('https://api.ng.termii.com/api/sms/send').reply(405);

        const result = await client.sendMessage(1234567890, 'TestSender', 'Hello, this is a test message');
        expect(result).toBe('Method Not Allowed: The selected HTTP method is not allowed.');
    });
});
