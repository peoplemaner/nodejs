var Human = function (type) {
    this.type = type || 'Human';
}

Human.isHuman = function (human) {
    return human instanceof Human;
}

Human.prototype.breathe = function () {
    console.log('h-a-a-a-m');
}

var Zero = function (type, firstName, lastName) {
    Human.apply(this, arguments);
    this.firstName = firstName;
    this.lastName = lastName;
};

Zero.prototype = Object.create(Human.prototype);
Zero.prototype.constructor = Zero;
Zero.prototype.sayName = function () {
    console.log(`${this.firstName} ${this.lastName}`);
}

var oldZero = new Zero('human', 'Zero', 'Cho');
console.log(Human.isHuman(oldZero));

class Humans {
    constructor(type = 'human') {
        this.type = type;
    }

    static isHuman(human) {
        return human instanceof Human;
    }

    breathe() {
        console.log('h-a-a-a-m');
    }
}

class Zeros extends Human {
    constructor(type, firstName, lastName) {
        super(type);
        this.firstName = firstName;
        this.lastName = lastName;
    }

    sayName() {
        super.breathe();
        console.log(`${this.firstName} ${this.lastName}`);
    }
}

const newZero = new Zeros('human', 'd', 'shop');
console.log(Humans.isHuman(newZero));
newZero.sayName();