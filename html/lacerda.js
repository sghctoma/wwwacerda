var randInt = function (max) {
    return Math.floor(Math.random() * max);
}

/*
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};

var draw = function () {
    current_round += 1;

    if (shuffled.length == 0) {
        shuffled = [...Array(12).keys()];
        shuffle(shuffled);
        contribute = true;
    }

    var n = shuffled.splice(0, 1)[0];
    var card = cards[n];

    var ret = [
        card[0],                    // action to take
        contribute ? card[1] : 0,   // mission to contribute to
        randInt(12)                 // hex tiebreaker
    ]

    if (card[2]) {
        primary_turnorder = randInt(4);
        tmp = [0, 1, 2, 3];
        tmp.splice(primary_turnorder, 1)
        secondary_turnorder = tmp[randInt(3)];

        ret = ret.concat([primary_turnorder, secondary_turnorder]);
    }

    return ret;
};

// [action, mission, travel]
var cards = [
    [1, 1, true],
    [1, 2, true],
    [1, 2, true],
    [1, 3, true],
    [1, 3, false],
    [2, 1, true],
    [2, 1, false],
    [2, 2, true],
    [2, 3, true],
    [3, 1, true],
    [3, 2, false],
    [3, 3, true]
];

var contribute = false;
var shuffled = [...Array(12).keys()];

shuffle(shuffled);
