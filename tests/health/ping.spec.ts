import { test } from '../../src/fixtures';
import { STATUS } from '../../src/api/status';

test('GET /ping responds @smoke', async ({ api }) => {
// the health check answers 201, not 200
await api.path('/ping').clearAuth().getRequest(STATUS.CREATED_201);
});