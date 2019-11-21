const BOT_COMMANDS_COUNT = 64;
const BOT_MAX_HELTH = 100;

class Bot {

    constructor(genom) {
        this.genom = [];
        this.age = 0;
        this.id = getID();
        this.uid = getID();
        this.health = BOT_MAX_HELTH;
        this.cmdPos = 0;
        this.rotation = getRandomInt(0, 7);

        if (!genom) {
            this.genom = [];
            for (let i = 0; i < BOT_COMMANDS_COUNT; i++) {
                this.genom.push(getRandomInt(0, BOT_COMMANDS_COUNT - 1)); // generate genom
            }
        } else {
            for (let i = 0; i < genom.length; i++) {
                this.genom.push(genom[i]); // copy genom
            }
        }
    }

    clone(withMutation) {
        const newBot = new Bot(this.genom);

        newBot.uid = this.uid;
        newBot.age = this.age + 1;

        if (withMutation) {
            newBot.mutation();
        }
        return newBot;
    }

    mutation() {
        const idx = getRandomInt(0, BOT_COMMANDS_COUNT - 1);
        this.mutant = true;
        this.genom[idx] = getRandomInt(0, BOT_COMMANDS_COUNT - 1);
    }
}