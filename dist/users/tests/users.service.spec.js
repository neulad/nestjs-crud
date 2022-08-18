"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("@nestjs/mongoose");
const users_service_1 = require("../users.service");
const common_1 = require("@nestjs/common");
describe('The UsersService', () => {
    let createUserDto;
    let userDocument;
    let user;
    let updateUserDto;
    let usersService;
    const findOne = jest.fn().mockReturnValue(userDocument);
    const create = jest.fn().mockReturnValue(userDocument);
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                users_service_1.UsersService,
                { provide: (0, mongoose_1.getModelToken)('User'), useValue: { findOne, create } },
            ],
        }).compile();
        usersService = await module.get(users_service_1.UsersService);
    });
    describe('Creating a user', () => {
        beforeEach(() => {
            createUserDto = {
                email: 'email@email.com',
                pw: '123456789',
                name: {
                    firstName: 'Alena',
                    lastName: 'Gribovich',
                },
            };
            userDocument = Object.assign(Object.assign({}, createUserDto), { _id: 'bhce76i2', __v: 0, createdAt: new Date(), updatedAt: new Date() });
            create.mockReturnValue(Promise.resolve(userDocument));
        });
        describe("if user doesn't exist", () => {
            beforeEach(() => {
                findOne.mockReturnValue(false);
            });
            it('should return a userDocument', () => {
                expect(usersService.create(createUserDto)).resolves.toEqual(userDocument);
            });
        });
        describe('if user exist', () => {
            beforeEach(() => {
                findOne.mockReturnValue(true);
            });
            it('should throw an error', () => {
                expect(async () => {
                    await usersService.create(createUserDto);
                }).rejects.toThrow(common_1.ConflictException);
            });
        });
    });
    describe('Updating user', () => {
        beforeEach(() => {
            updateUserDto = {
                email: 'email@email.com',
                pw: '123456789',
                name: {
                    firstName: 'Alena',
                    lastName: 'Gribovich',
                },
            };
            user = Object.assign(Object.assign({}, updateUserDto), { _id: 'bhce76i2', __v: 0, createdAt: new Date(), updatedAt: new Date() });
        });
        describe('if user is trying to access someone else', () => {
            it('should return an error', () => {
                expect(async () => {
                    await usersService.update(user, updateUserDto, 'bwyugchce7ibv6i2');
                }).rejects.toThrow(common_1.ForbiddenException);
            });
        });
        describe('if user is specifying existing email', () => {
            beforeEach(() => {
                findOne.mockReturnValue({
                    _id: 'bhcecjf76i2',
                    email: 'email@email.com',
                });
            });
            it('should return an error', () => {
                expect(async () => {
                    await usersService.update(user, updateUserDto, 'bhce76i2');
                }).rejects.toThrow(common_1.ConflictException);
            });
        });
    });
    describe('Get single user', () => {
        beforeEach(() => {
            user = Object.assign(Object.assign({}, updateUserDto), { _id: 'bhce76i2', __v: 0, createdAt: new Date(), updatedAt: new Date() });
        });
        it('should return an error', () => {
            expect(() => {
                usersService.findOne(user, 'b483ce76i2');
            }).toThrow(common_1.ForbiddenException);
        });
    });
    describe('Delete a single user', () => {
        beforeEach(() => {
            updateUserDto = {
                email: 'email@email.com',
                pw: '123456789',
                name: {
                    firstName: 'Alena',
                    lastName: 'Gribovich',
                },
            };
            user = Object.assign(Object.assign({}, createUserDto), { _id: 'bhce76i2', __v: 0, createdAt: new Date(), updatedAt: new Date() });
        });
        it('should return an error', () => {
            expect(() => {
                usersService.remove(user, 'b483ce76i2');
            }).toThrow(common_1.ForbiddenException);
        });
    });
});
//# sourceMappingURL=users.service.spec.js.map