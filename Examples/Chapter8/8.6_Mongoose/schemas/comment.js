const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const commentSchema = new Schema({
    commenter: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);

/**
 * const { Types: { objectId } } = Schema; objectId Type 불러오기
 * commentSchema의 commenter를 User.objectId와 연결(JOIN과 비슷한 기능)
 * - mongoose.model('Comment', commentSchema, 'user_table')
 *  첫번째 인수로 Comment가 들어오면 comments로 컬렉션(table)을 생성.
 *  컬렉션 명을 따로 지정하고 싶다면 세번째 인수로 전달하면 해당 컬렉션 생성.
 * 
 */