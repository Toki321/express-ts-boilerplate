import supertest from 'supertest';
import { StartTestServer } from '../src/library/testing-setup/serverTestSetup';
import { clearDatabase, closeDatabase, connect } from '../src/library/testing-setup/mongoTestSetup';

const app = StartTestServer();
const request = supertest.agent(app);

beforeAll(async () => {
    await connect();
});

afterEach(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await closeDatabase();
});

const userInput = {
    email: 'toki@gmail.com',
    password: 'Test123*',
};

describe('authentication', () => {
    describe('POST /auth/register', () => {
        describe('given valid email and password', () => {
            it('should respond with a 200 status code', async () => {
                const res = await request.post('/auth/register').send(userInput);
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty('user');
            });
        });

        describe('given an existing email', () => {
            it('should respond with status code of 400', async () => {
                const firstUser = await request.post('/auth/register').send(userInput);
                const res = await request.post('/auth/register').send(userInput);
                expect(res.status).toBe(400);
            });
        });

        describe('given missing email or password or both', () => {
            it('should respond with a 400 status code', async () => {
                const possibleUserInputs = [{ email: 'toki@gmail.com' }, { password: 'Test123*' }, {}];

                for (const input of possibleUserInputs) {
                    const res = await request.post('/auth/register').send(input);
                    expect(res.statusCode).toBe(400);
                }
            });
        });
    });

    describe('POST /auth/login', () => {
        beforeEach(async () => {
            await request.post('/auth/register').send(userInput);
        });
        describe('given valid email and password', () => {
            it('should respond with a 200 status code', async () => {
                const res = await request.post('/auth/login').send(userInput);
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty('accessToken');
            });
        });

        describe('given wrong email or password', () => {
            it('should respond with a 404 and 401 status code respectively', async () => {
                const possibleUserInputs = [
                    { email: 'wrong@gmail.com', password: userInput.password },
                    { email: userInput.email, password: 'wrong' },
                ];

                for (const input of possibleUserInputs) {
                    const res = await request.post('/auth/login').send(input);
                    if (input.email.startsWith('wrong')) expect(res.statusCode).toBe(404);
                    else expect(res.statusCode).toBe(401);
                }
            });
        });

        describe('given missing email or password or both', () => {
            it('should respond with a 400 status code', async () => {
                const possibleUserInputs = [{ email: 'toki@gmail.com' }, { password: 'Test123*' }, {}];

                for (const input of possibleUserInputs) {
                    const res = await request.post('/auth/login').send(input);
                    expect(res.statusCode).toBe(400);
                }
            });
        });
    });

    describe('GET /auth/logout', () => {
        describe('given there is a refresh token in cookies', () => {
            it('should delete the jwt from cookies and return 204 status', async () => {
                await request.post('/auth/register').send(userInput);
                await request.post('/auth/login').send(userInput);

                const res = await request.delete('/auth/logout');
                expect(res.statusCode).toBe(204);
                expect(res.headers['set-cookie'][0]).toMatch(/^jwt=;/);
            });
        });
    });

    describe('GET /auth/isEmailAvailable', () => {
        describe(`given that the email is taken`, () => {
            it(`should return a bool of false with a 200 status`, async () => {
                await request.post('/auth/register').send(userInput);

                const email = 'toki@gmail.com';
                const res = await request.get(`/auth/isEmailAvailable?email=${email}`);
                expect(res.statusCode).toBe(200);
                expect(res.body.isValid).toBe(false);
            });
        });

        describe(`given that the email is NOT taken`, () => {
            it(`should return a bool of true with a 200 status`, async () => {
                const email = 'available@example.com';
                const res = await request.get(`/auth/isEmailAvailable?email=${email}`);
                expect(res.statusCode).toBe(200);
                expect(res.body.isValid).toBe(true);
            });
        });
    });

    describe('POST /auth/refreshToken', () => {
        describe('given user has valid refresh token', () => {
            it('should respond with a 200 status code and new access and refresh token', async () => {
                await request.post('/auth/register').send(userInput);

                await request.post('/auth/login').send(userInput);

                const res = await request.get('/auth/useRefreshToken');
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('accessToken');
                const cookie = res.headers['set-cookie'][0];
                expect(cookie).toBeDefined();
                expect(cookie).toContain('HttpOnly');
                expect(cookie).toContain('Max-Age=86400'); // This checks the max age is one day
            });
        });

        describe('given missing refresh token aka user not logged in', () => {
            it('should respond with a 404 status code', async () => {
                const res = await request.get('/auth/useRefreshToken');
                expect(res.statusCode).toBe(404);
            });
        });

        describe('given user has invalid refresh token', () => {
            /* All that I need to do is set the cookie to wrong invalid cookie in the header when sending 
                a req to '/auth/useRefreshToken'. But when I log it out it logs out the correct jwt token no matter what i do */

            it('should respond with a 400 status', async () => {
                // await request.post('/auth/register').send(userInput);
                // const invalidToken = 'invalidToken';
                // const login = await request.post('/auth/login').send(userInput).set('Cookie', `jwt=${invalidToken}`);
                // // login.headers['set-cookie'][0] = invalidToken;
                // // console.log(login.headers['set-cookie'][0]);
                // request.jar.setCookie(`jwt=${invalidToken}`);
                // const res = await request.get('/auth/useRefreshToken').set('Cookie', `jwt=cringe`);
                // console.log(res.headers['set-cookie'][0]);
                // // Check status code
                // expect(res.statusCode).toBe(400);
            });
        });

        // same problem as above
        describe('given user has expired refresh token', () => {
            it('should respond with a 403 status', async () => {});
        });
        describe(`given user with that refresh token doesn't exist in database`, () => {
            it('should respond with a 400 status code', async () => {});
        });
    });
});
