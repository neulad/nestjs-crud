/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose" />
import { CreateUserDto } from './dto/user-create.dto';
import { UpdateUserDto } from './dto/user-update.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(req: any, userId: string): Promise<User>;
    update(req: any, userId: any, updateUserDto: UpdateUserDto): Promise<import("mongoose").Document<unknown, any, User> & User & {
        _id: string;
    }>;
    remove(req: any, userId: any): import("mongoose").Query<import("mongodb").DeleteResult, import("mongoose").Document<unknown, any, User> & User & {
        _id: string;
    }, {}, User>;
}
