const { User, sequelize } = require('./models');

// INSERT INTO nodejs.users (name, age, married, comment) VALUES ('zero', 24, 0, '자기소개1');
User.create({
    name: 'zero',
    age: 24,
    married: false,
    comment: '자기소개1'
});
// * 주의할 점은 Database 스키마가 아닌 Sequelize 자료형에 맞게 넣어야 한다.
//  married 속성(Sequelize.BOOLEAN형은 최초 생성 시 TinyInt형으로 생성 됨)처럼 DB에서는 TinyInt지만, Sequelize에서 
// 정의한대로 입력해야 함.

// SELECT * FROM nodejs.users;
User.findAll({});
// SELECT * FROM nodejs.users LIMIT 1;
User.findOne({});

// SELECT name, married FROM nodejs.users;
User.findAll({
    attributes: ['name', 'married']
});

// SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;
const { Op } = require('sequelize');
const db = require('./models');
User.findAll({
    attributes: ['name', 'age'],
    where: {
        married: true,
        age: { [Op.gt]: 30 }
    }
});
// 형식 : [비교 연산자] : [{ 비교 컬럼: 값 }, { 비교 컬럼: 값 }..]

// SELECT id, name FROM users WHERE married = 0 OR age > 30;
User.findAll({
    attributes: ['id', 'name'],
    where: {
        [Op.or]: [{married: false}, { age: { [Op.gt]: 30 }}]
    }
});

// SELECT id, name FROM users ORDER BY age DESC;
User.findAll({
    attributes: ['id', 'name'],
    order: [['age', 'DESC']]
});
// 정렬, order: [[컬럼, 방식], [컬럼, 방식]]

// SELECT id, name FROM users ORDER BY age DESC LIMIT 1;
User.findAll({
    attributes: ['id', 'name'],
    order: [['age', 'DESC']],
    limit: 1
});

// SELECT id, name FROM users ORDER BY age DESC LIMIT 1 OFFSET 1;
User.findAll({
    attributes: ['id', 'name'],
    order: ['age', 'DESC'],
    limit: 1,
    offset: 1
});

// UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;
User.update({
    comment: '바꿀 내용'
}, {
    where: { id: 2}
});

// DELETE FROM nodejs.users WHERE id = 2;
User.destroy({
    where: { id: 2 }
});

/**
 * 관계 쿼리
 * MySQL JOIN기능 지원!
 * 현재 User모델과 Comment모델은 hasMany-belongsTo 관계
 * 만약 사용자 + 댓글까지 모두 가져오고 싶다면 include 속성을 사용
 */
const user = await User.findOne({
    include: [{
        model: Comment
    }]
});
console.log(user.Comments);
// OR
const user2 = await User.findOne({});
const comments = await user2.getComments();
console.log(comments); // 사용자 댓글

// 관계가 설정되어 있다면 getComments(조회) 외에도 setComments(수정), addComment(하나 생성), 
//  addComments(여러 개 생성), removeComments(삭제) 메서드를 지원.

// 관계 설정할 때 as로 등록
db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id', as: 'Answers'});
// 쿼리할 때는
const user3 = await User.findOne({});
const comments = await user3.getAnswers();
console.log(comments);  // 사용자 댓글

// as를 설정하면 include 시 추가되는 댓글 객체도 user.Answers로 바뀜.
// include나 관계 쿼리 메서드에도 where나 attributes 같은 옵션 사용 가능
const user4 = await User.findOne({
    include: [{
        model: Comment,
        where: {
            id:1
        },
        attributes: ['id']
    }]
});
// OR
const comments = await user4.getComments({
    where: {
        id: 1
    },
    attributes: ['id']
});

// 수정, 생성, 삭제
const user5 = await User.findOne({});
const comment = await Comment.create();
await user5.addComment(comment);
// OR
await user5.addComment(comment.id);

// 여러 개 추가 시에는 배열로 추가
const user6 = await User.findOne({});
const comment1 = await Comment.create();
const comment2 = await Comment.create();
await user.addComment([comment1, comment2]);

// 직접 SQL 사용
const [result, metadata] = await sequelize.query('SELECT * FROM comments');
console.log(result);