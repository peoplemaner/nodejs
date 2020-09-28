const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local'
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }

    static associate(db) {
        db.User.hasMany(db.Post);   // 1:N 관계 user.getPosts, user.addPosts 같은 관계 매서드들 생성
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow'
        }); // N:M 사용자 한 명이 팔로워를 여러명 가질 수 있음.
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow'
        }); // N:M 사용자 한 명이 여러 명을 팔로잉할 수 있음.
    }
};

/**
 * 같은 테이블 간 N:M 관계
 * belongsToMany(대상 테이블, { 외래키명, 대체명, 새로운 관계 테이블명 })
 * N:M 관계를 설정하면 Sequelize에서 새로운 관계 테이블을 생성.
 * 새로운 관계 테이블 접근 : db.sequelize.models.Follow
 * 
 * Executing (default): 
 *  CREATE TABLE IF NOT EXISTS `users` 
 *      (`id` INTEGER NOT NULL auto_increment , `email` VARCHAR(40) UNIQUE, `nick` VARCHAR(15) NOT NULL, 
 *          `password` VARCHAR(100), `provider` VARCHAR(10) NOT NULL DEFAULT 'local', `snsId` VARCHAR(30), 
 *          `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `deletedAt` DATETIME, 
 *          PRIMARY KEY (`id`)) 
 *  ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_general_ci;
 * 
 * Executing (default): 
 *  CREATE TABLE IF NOT EXISTS `Follow` 
 *      (`createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, 
 *          `followingId` INTEGER , `followerId` INTEGER , 
 *          PRIMARY KEY (`followingId`, `followerId`), 
 *          FOREIGN KEY (`followingId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, 
 *          FOREIGN KEY (`followerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) 
 *  ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_general_ci;
 */