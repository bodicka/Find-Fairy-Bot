process.env.BOT_TOKEN = 'test_token';

global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
};

