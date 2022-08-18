import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/user-create.dto';
import { User } from '../schemas/user.schema';
import { UpdateUserDto } from '../dto/user-update.dto';
import { ConflictException, ForbiddenException } from '@nestjs/common';

describe('The UsersService', () => {
  let createUserDto: CreateUserDto;
  let userDocument: User;
  let user: User;
  let updateUserDto: UpdateUserDto;
  let usersService: UsersService;
  const findOne = jest.fn().mockReturnValue(userDocument);
  const create = jest.fn().mockReturnValue(userDocument);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken('User'), useValue: { findOne, create } },
      ],
    }).compile();

    usersService = await module.get(UsersService);
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

      userDocument = {
        ...createUserDto,
        _id: 'bhce76i2',
        __v: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      create.mockReturnValue(Promise.resolve(userDocument));
    });

    describe("if user doesn't exist", () => {
      beforeEach(() => {
        findOne.mockReturnValue(false);
      });

      it('should return a userDocument', () => {
        expect(usersService.create(createUserDto)).resolves.toEqual(
          userDocument
        );
      });
    });

    describe('if user exist', () => {
      beforeEach(() => {
        findOne.mockReturnValue(true);
      });

      it('should throw an error', () => {
        expect(async () => {
          await usersService.create(createUserDto);
        }).rejects.toThrow(ConflictException);
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
      user = {
        ...updateUserDto,
        _id: 'bhce76i2',
        __v: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    describe('if user is trying to access someone else', () => {
      it('should return an error', () => {
        expect(async () => {
          await usersService.update(user, updateUserDto, 'bwyugchce7ibv6i2');
        }).rejects.toThrow(ForbiddenException);
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
        }).rejects.toThrow(ConflictException);
      });
    });
  });

  describe('Get single user', () => {
    beforeEach(() => {
      user = {
        ...updateUserDto,
        _id: 'bhce76i2',
        __v: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    it('should return an error', () => {
      expect(() => {
        usersService.findOne(user, 'b483ce76i2');
      }).toThrow(ForbiddenException);
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

      user = {
        ...createUserDto,
        _id: 'bhce76i2',
        __v: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    it('should return an error', () => {
      expect(() => {
        usersService.remove(user, 'b483ce76i2');
      }).toThrow(ForbiddenException);
    });
  });
});
