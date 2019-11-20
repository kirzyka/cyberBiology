class Bot {    

    constructor(genom) {        
        this.genom = [];

        if(!genom) {
            this.genom = [];
            for(let i = 0; i < 64; i++) {
                this.genom.push(getRandomInt(0, 63));
            }
        } else  {
            for(let i = 0; i < genom.length; i++) {
                this.genom.push(genom[i]);
            } 
        }
    }

    clone(withMutation) {
        const newBot = new Bot(this.genom);

        if (withMutation) {
            newBot.mutation();
        }
        return newBot;
    }

    mutation() {
        const idx = getRandomInt(0, 63);

        this.genom[idx] = getRandomInt(0, 63);
    }
}