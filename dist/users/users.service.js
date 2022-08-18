"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const userExists = await this.userModel.findOne({
            email: createUserDto.email,
        });
        if (userExists) {
            throw new common_1.ConflictException('User with this email already exists!');
        }
        return this.userModel.create(createUserDto);
    }
    findAll() {
        return this.userModel.find().exec();
    }
    findOne(user, userId) {
        if (user._id.toString() !== userId) {
            throw new common_1.ForbiddenException('You are trying to acces a different user!');
        }
        return this.userModel.findOne({ _id: userId }).exec();
    }
    async update(user, updateUserDto, userId) {
        if (user._id.toString() !== userId) {
            throw new common_1.ForbiddenException('You are trying to update a different user!');
        }
        const userExists = await this.userModel.findOne({
            email: updateUserDto.email,
        });
        if (userExists && userExists._id.toString() !== userId) {
            throw new common_1.ConflictException('User with this email already exists!');
        }
        await this.userModel.updateOne({ _id: userId }, updateUserDto).exec();
        const newUser = await this.userModel.findOne({ _id: userId });
        return newUser;
    }
    remove(user, userId) {
        if (user._id.toString() !== userId) {
            throw new common_1.ForbiddenException('You are trying to delete a different user!');
        }
        return this.userModel.deleteOne({ _id: userId });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map