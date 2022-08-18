/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/user-create.dto';
import { UpdateUserDto } from './dto/user-update.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(user: User, userId: string): Promise<User>;
    update(user: User, updateUserDto: UpdateUserDto, userId: string): Promise<import("mongoose").Document<unknown, any, User> & User & {
        _id: string;
    }>;
    remove(user: User, userId: string): import("mongoose").Query<import("mongodb").DeleteResult, import("mongoose").Document<unknown, any, User> & User & {
        _id: string;
    }, {}, User>;
}
