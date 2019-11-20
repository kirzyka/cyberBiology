class Bot {    
    COMMANDS_COUNT = 64;
    MAX_HELTH = 100;

    constructor(genom) {        
        this.genom = [];
        this.age = 0;
        this.uid = getUID();
        this.health = this.MAX_HELTH;

        if(!genom) {
            this.genom = [];
            for(let i = 0; i < this.COMMANDS_COUNT; i++) {
                this.genom.push(getRandomInt(0, this.COMMANDS_COUNT-1));
            }
        } else  {
            for(let i = 0; i < genom.length; i++) {
                this.genom.push(genom[i]);
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
        const idx = getRandomInt(0, this.COMMANDS_COUNT-1);
        this.mutant = true;
        this.genom[idx] = getRandomInt(0, this.COMMANDS_COUNT-1);
    }
}