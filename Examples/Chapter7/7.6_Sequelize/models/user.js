const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true
            },
            age: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false
            },
            married: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            comment: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {
        db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
    }
}

/**
 * Sequelize 모델 생성 방법
 * extens Sequelize.Model
 * static init(sequelize) { return super.init( 테이블 컬럼 정보, 테이블 정보 ); }
 *  두번째 인수
 *      sequelize: static init 메서드의 매개변수와 연결되는 옵션으로 db.sequelize 개체를 넣어야 함.
 *      timestamps: 현재 false로 되어 있으며, 이 속성 값이 true면 시퀄라이즈는 createdAt과 updateAt 컬럼을 추가함.
 *      underscored: 기본적으로 카멜 케이스(예: createdAt)로 만듭니다. 이를 스네이크 케이스(예: created_at)로 바꾸는 옵션
 *      paranoid: true 설정 시 deletedAt 컬럼 생성, 데이터 삭제 시 실제로 지우지 않고 날짜 업데이트 해놓음, 
 *              추후 복원해야 하는 데이터 같은 경우 선택.
 *      charset과 collate: 각각 utf8과 utf8_general_ci로 설정해야 한글 입력이 됨. 이모티콘을 추가 하고 싶다면 utf8mb4와 utf8mb4_general_ci를 입력.
 *      
 * static associate(db) { } - 다른 모델과의 관계
 * 
 * 1:N 관계
 *  db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
 *  db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id' });
 * 
 * 1:1 관계
 *  db.User.hasOne(db.Info, { foreignKey: 'userId', sourceKey: 'id' });
 *  db.Info.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
 * 
 * N:M 관계
 *  db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
 *  db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
 *  조회 : db.sequelize.models.PostHashtag
 *  
 */