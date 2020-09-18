var relatinship1 = {
    name: 'zero',
    friends: ['nero', 'hero', 'xero'],
    logFrindes: function () {
        var that = this;    // relationship1을 가리키는 this를 that에 저장
        this.friends.forEach(function (friend) {
            console.log(that.name, friend);
        });
    }
}
relatinship1.logFrindes();

const relationship2 = {
    name: 'zero',
    friends: ['nero', 'hero', 'xero'],
    logFriends() {
        this.friends.forEach(friend => {
            console.log(this.name, friend);
        });
    }
}
relationship2.logFriends();