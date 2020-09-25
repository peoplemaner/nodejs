const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    married: {
        type: Boolean,
        required: true
    },
    comment: String,
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);

/**
 * _id는 기본 키로 생성하므로 생략
 * type은 String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array.
 * required(필수)나 default 등 옵션이 필요하지 않으면 자료형만 명시하면 됨.
 */