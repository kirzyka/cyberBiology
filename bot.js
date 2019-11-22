const BOT_COMMANDS_COUNT = 64;
const BOT_MAX_HELTH = 100;

class Bot {

    constructor(genom) {
        this._genom = [];
        this._age = 0;
        this._generation = 1;
        this._id = getID();
        this._uid = getID();
        this._health = BOT_MAX_HELTH;
        this._cmdPos = 0;
        this._rotation = getRandomInt(0, 7);

        if (!genom) {
            this._genom = [];
            for (let i = 0; i < BOT_COMMANDS_COUNT; i++) {
                this._genom.push(getRandomInt(0, BOT_COMMANDS_COUNT - 1)); // generate genom
            }
        } else {
            for (let i = 0; i < genom.length; i++) {
                this._genom.push(genom[i]); // copy genom
            }
        }
    }

    get genom() {
        return this._genom;
    }

    get cmdPos() {
        return this._cmdPos;
    }

    set cmdPos(value) {
        this._cmdPos = value;
    }

    get age() {
        return this._age;
    }

    set age(value) {
        this._age = value;
    }

    get health() {
        return this._health;
    }

    set health(value) {
        this._health = value;
    }

    get rotation() {
        return this._rotation;
    }

    rotate(value) {
        this._rotation = (this._rotation + value) % 8;
    }

    updateHealth(value) {
        value = value || -1;
        this._health = this._health + value;
    }

    updateCmdPos(value) {
        value = value || 1;
        this._cmdPos = (this._cmdPos + value) % 64;
    }

    clone(withMutation) {
        const newBot = new Bot(this._genom);

        newBot.uid = this._uid;
        newBot.generation = this._generation + 1;
        newBot.cmdPos = 0;

        if (withMutation) {
            newBot.mutation();
        }
        return newBot;
    }

    mutation() {
        const idx = getRandomInt(0, BOT_COMMANDS_COUNT - 1);
        this._mutant = true;
        this._genom[idx] = getRandomInt(0, BOT_COMMANDS_COUNT - 1);
    }
}