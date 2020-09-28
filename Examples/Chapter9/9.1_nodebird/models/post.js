const Sequelize = require('sequelize');
const { truncate } = require('./user');

module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(140),
                allowNull: false
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }

    static associate(db) {
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Hashtag, { foreignKey: 'postId', through: 'PostHashtag' });
    }
};

/**
 * Executing (default): 
 *  CREATE TABLE IF NOT EXISTS `posts` 
 *      (`id` INTEGER NOT NULL auto_increment , `content` VARCHAR(140) NOT NULL, `img` VARCHAR(200), 
 *          `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `UserId` INTEGER, 
 *          PRIMARY KEY (`id`), 
 *          FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) 
 *  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
 * 
 * Executing (default): 
 *  CREATE TABLE IF NOT EXISTS `PostHashtag` 
 *      (`createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, 
 *          `postId` INTEGER , `hashtagId` INTEGER , 
 *          PRIMARY KEY (`postId`, `hashtagId`), 
 *          FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, 
 *          FOREIGN KEY (`hashtagId`) REFERENCES `hashtags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) 
 *  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
 */