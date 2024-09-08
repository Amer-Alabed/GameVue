function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            winner: null,
            battleLog: []
        }
    },
    computed: {
        monsterBarStyle() {
            return { width: (this.monsterHealth < 0 ? 0 : this.monsterHealth) + '%' };
        },
        playerBarStyle() {
            return { width: (this.playerHealth < 0 ? 0 : this.playerHealth) + '%' };
        },
        isSpecialAttackReady() {
            return this.currentRound % 3 !== 0;
        }
    },
    methods: {
        attackMonster() {
            this.currentRound++;
            const attackValue = getRandomNumber(5, 12);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer();
        },
        attackPlayer() {
            const attackValue = getRandomNumber(8, 15);
            this.playerHealth -= attackValue;
            this.addLogMessage('monster', 'attack', attackValue);
        },
        specialAttack() {
            this.currentRound++;
            const attackValue = getRandomNumber(10, 25);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'special-attack', attackValue);
            this.attackPlayer();
        },
        healPlayer() {
            this.currentRound++;
            const healValue = getRandomNumber(8, 20);
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            }
            this.addLogMessage('player', 'heal', healValue);
            this.attackPlayer();
        },
        startGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.currentRound = 0;
            this.winner = null;
            this.battleLog = [];
        },
        surrender() {
            this.winner = 'monster';
            this.addLogMessage('player', 'surrender');
        },
        addLogMessage(who, action, value = null) {
            this.battleLog.unshift({
                classes: `log--${who} log--${action}`,
                text: who === 'player' ? `Player ${action}` : `Monster ${action}` + (value ? ` - ${value}` : '')
            });
        }
    },
    watch: {
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                this.winner = 'player';
            }
        },
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                this.winner = 'monster';
            }
        }
    }
});

app.mount('#game');
