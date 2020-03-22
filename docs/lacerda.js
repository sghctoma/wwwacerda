class Card {
    constructor(action, mission, travel) {
        this.action = action;
        this.mission = mission;
        this.travel = travel;
    }
}

class State {
    constructor(action, mission, hexTiebreaker, cardTiebreaker, techTiebreaker) {
        this.action = action;
        this.mission = mission;
        this.hexTiebreaker = hexTiebreaker;
        this.cardTiebreaker = cardTiebreaker;
        this.techTiebreaker = techTiebreaker;
        this.turnOrders = null;
    }
}

class Lacerda {

    constructor() {
        // [action, mission, travel]
        this.cards = [
            new Card(1, 1, true),
            new Card(1, 2, true),
            new Card(1, 2, true),
            new Card(1, 3, true),
            new Card(1, 3, false),
            new Card(2, 1, true),
            new Card(2, 1, false),
            new Card(2, 2, true),
            new Card(2, 3, true),
            new Card(3, 1, true),
            new Card(3, 2, false),
            new Card(3, 3, true)
        ];

        this.shuffledIndexes = [...Array(12).keys()];
        this.shuffle();

        // Starting positions [Lacerda, player]
        this.startPositions = this.distinctRandIntsFromArray([1, 2, 3, 5, 6, 7]);

        this.currentRound = 0;
        this.currentPhase = "COLONISATION";
        this.history = [null];
    }

    randInt(max) {
        return Math.floor(Math.random() * max);
    }

    distinctRandIntsFromArray(arr) {
        var index1 = this.randInt(arr.length);
        var rnd1 = arr[index1];
        arr.splice(index1, 1);
        var rnd2 = arr[this.randInt(arr.length)];

        return [rnd1, rnd2];
    }
    
    distinctRandInts(max) {
        var rnd1 = this.randInt(max);
        var tmp = [...Array(max).keys()];
        tmp.splice(rnd1, 1)
        var rnd2 = tmp[this.randInt(max-1)];

        return [rnd1, rnd2];
    }

    /*
    * Randomly shuffle an array
    * Original: https://stackoverflow.com/a/2450976/1293256
    */
    shuffle() {
        var currentIndex = this.shuffledIndexes.length;
        var temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = this.shuffledIndexes[currentIndex];
            this.shuffledIndexes[currentIndex] = this.shuffledIndexes[randomIndex];
            this.shuffledIndexes[randomIndex] = temporaryValue;
        }
    };

    draw() {
        if (this.shuffledIndexes.length == 0) {
            this.shuffledIndexes = [...Array(12).keys()];
            this.shuffle();
        }

        var n = this.shuffledIndexes.splice(0, 1)[0];
        var card = this.cards[n];
        var state = new State(
            card.action,
            this.currentRound > this.cards.length ? card.mission : null,
            this.randInt(12),
            this.randInt(6),
            this.randInt(4));

        if (card.travel) {
            state.turnOrders = this.distinctRandInts(4);
        }

        this.history.push(state);
    }

    currentState() {
        return this.history[this.currentRound];
    }

    nextState() {
        this.currentPhase = 'COLONISATION';
        this.currentRound += 1;
        if (this.history.length <= this.currentRound) {
            this.draw();
        }

        return this.history[this.currentRound];
    }

    prevState() {
        this.currentPhase = 'COLONISATION';
        if (this.currentRound == 1) {
            return null;
        } else {
            this.currentRound -= 1;
            return this.history[this.currentRound];
        }
    }
}
