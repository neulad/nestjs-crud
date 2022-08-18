"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const users_module_1 = require("../users.module");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("../../auth/auth.module");
const Joi = require("joi");
describe('Users', () => {
    let app;
    let connection;
    beforeAll(async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [
                mongoose_1.MongooseModule.forRoot('mongodb://localhost:27017/test'),
                config_1.ConfigModule.forRoot({
                    ignoreEnvFile: true,
                    isGlobal: true,
                    validationSchema: Joi.object({
                        JWT_SECRET: Joi.string().required(),
                    }),
                }),
                users_module_1.UsersModule,
                auth_module_1.AuthModule,
            ],
            controllers: [],
            providers: [],
        }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
        }));
        await app.init();
        connection = await app.get((0, mongoose_1.getConnectionToken)());
    });
    afterEach(async () => {
        await connection.db.dropDatabase();
    });
    afterAll(async () => {
        await connection.close(true);
        await app.close();
    });
    describe('CRUD operations', () => {
        let createUserDto;
        let updateUserDto;
        let malformedUserDto;
        let jwtToken;
        let testUserId;
        beforeEach(() => {
            createUserDto = {
                email: 'email@email.com',
                pw: '123456789',
                name: {
                    firstName: 'Alena',
                    lastName: 'Gribovich',
                },
            };
            malformedUserDto = {
                email: 'email.com',
                pw: '1234',
                name: {
                    lastName: 'Gribovich',
                },
            };
        });
        describe('/POST users', () => {
            it('should return dto', () => {
                return request(app.getHttpServer())
                    .post('/users')
                    .send(createUserDto)
                    .expect((res) => {
                    if (res.body.email !== 'email@email.com')
                        throw new Error('not the same email');
                });
            });
            it('should return an error', () => {
                return request(app.getHttpServer())
                    .post('/users')
                    .send(malformedUserDto)
                    .expect(400);
            });
        });
        it(`/GET users`, () => {
            return request(app.getHttpServer())
                .get('/users')
                .expect(200)
                .expect((res) => {
                if (!Array.isArray(res.body))
                    throw new Error('not array');
            });
        });
        describe('tests which require authentication', () => {
            beforeEach(async () => {
                testUserId = (await request(app.getHttpServer()).post('/users').send(createUserDto)).body._id;
                await request(app.getHttpServer())
                    .post('/users')
                    .send(Object.assign(Object.assign({}, createUserDto), { email: 'email_existing@email.com' }));
                jwtToken = (await request(app.getHttpServer())
                    .post('/auth/login')
                    .send(createUserDto)).body.acces_token;
            });
            describe('/GET users/:id', () => {
                it('should return single user', () => {
                    return request(app.getHttpServer())
                        .get(`/users/${testUserId}`)
                        .set('Authorization', `Bearer ${jwtToken}`)
                        .expect(200);
                });
                it('should return an error', () => {
                    return request(app.getHttpServer())
                        .get(`/users/${testUserId}`)
                        .expect(401);
                });
            });
            describe('/PATCH users/:id', () => {
                beforeEach(() => {
                    updateUserDto = {
                        email: 'email12345@email.com',
                        pw: '123456789',
                        name: {
                            firstName: 'Alena',
                            lastName: 'Gribovich',
                        },
                    };
                    malformedUserDto = {
                        email: 'email_existing@email.com',
                        pw: '123456789',
                        name: {
                            lastName: 'Gribov',
                        },
                    };
                });
                it('should error, because wrong id', () => {
                    return request(app.getHttpServer())
                        .patch(`/users/123456`)
                        .send(updateUserDto)
                        .set('Authorization', `Bearer ${jwtToken}`)
                        .expect(403);
                });
                it('should error, beacuse no jwt', () => {
                    return request(app.getHttpServer())
                        .patch(`/users/${testUserId}`)
                        .send(updateUserDto)
                        .expect(401);
                });
                it('should error, beacuse this email exists', () => {
                    return request(app.getHttpServer())
                        .patch(`/users/${testUserId}`)
                        .set('Authorization', `Bearer ${jwtToken}`)
                        .send(malformedUserDto)
                        .expect(409);
                });
                it('should return updated user with correct email', () => {
                    return request(app.getHttpServer())
                        .patch(`/users/${testUserId}`)
                        .set('Authorization', `Bearer ${jwtToken}`)
                        .send(updateUserDto)
                        .expect((res) => {
                        if (res.body.email !== 'email12345@email.com') {
                            throw new Error('email is not updated');
                        }
                    });
                });
            });
            describe('/DELETE users/:id', () => {
                it('should error, because wrong id', () => {
                    return request(app.getHttpServer())
                        .delete(`/users/123456`)
                        .set('Authorization', `Bearer ${jwtToken}`)
                        .expect(403);
                });
                it('should return deleted count equal to one', () => {
                    return request(app.getHttpServer())
                        .delete(`/users/${testUserId}`)
                        .set('Authorization', `Bearer ${jwtToken}`)
                        .expect((res) => {
                        if (res.body.deletedCount !== 1) {
                            throw new Error('user is not deleted');
                        }
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=users.e2e-spec.js.map