const Sequelize = require('sequelize');

module.exports = class HashTag extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Hashtag',
            tableName: 'hashtags',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }

    static associate(db) {
        db.Hashtag.belongsToMany(db.Post, { foreignKey: 'hashtagId', through: 'PostHashtag' });
    }
};

/**
 * Executing (default): 
 *  CREATE TABLE IF NOT EXISTS `hashtags` 
 *      (`id` INTEGER NOT NULL auto_increment , `title` VARCHAR(15) NOT NULL UNIQUE, 
 *          `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, 
 *          PRIMARY KEY (`id`)) 
 *  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
 * 
 * 
 */