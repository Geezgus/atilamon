/* Obj Definitions */
class Pokemon {
  private _name: string;
  private _hp: number;
  private _strength: number;
  private _lifebar: HTMLElement;

  constructor(name: string, lifebar: HTMLElement) {
    this._name = name;
    this._hp = 100;
    this._strength = 20;
    this._lifebar = lifebar;
  }

  move(foe: Pokemon) {
    let random = getRandomIntInclusive(1, 3);
    if (this._hp > 50) {
      random <= 2 ? this.attack(foe) : this.heal();
    } else {
      random <= 2 ? this.heal() : this.attack(foe);
    }
  }

  attack(foe: Pokemon) {
    let random = getRandomIntInclusive(1, 10);
    let critical = false;

    if (random === 1) {
      foe._hp -= this._strength * 2;
      critical = true;
    } else {
      foe._hp -= this._strength;
    }

    foe._lifebar.style.setProperty("--lifebar-width", foe._hp + "%");

    console.log(
      this._name +
        " just used " +
        "attack" +
        (critical ? " IT WAS CRITICAL!" : "")
    );

    if (foe._hp <= 0) {
      console.log("Congratulation! " + this._name + " won the battle!");
      this._hp = 0;

      Object.freeze(this);
      Object.freeze(foe);
    }
  }

  heal() {
    this._hp += 25;
    if (this._hp > 100) this._hp = 100;

    this._lifebar.style.setProperty("--lifebar-width", this._hp + "%");

    console.log(this._name + " just used " + "heal");
  }

  get name(): string {
    return this._name;
  }

  get hp(): number {
    return this._hp;
  }

  get strength(): number {
    return this._strength;
  }

  get lifebar(): HTMLElement {
    return this._lifebar;
  }
}

/* Greetings */
console.log(
  "Greetings! Turn on the sound under the battle " +
    "screen to make your experience even better!"
);

/* Getting data from HTML & CSS */
const bulbasaur = document.getElementById("player-1");
const squirtle = document.getElementById("player-2");

const player1 = new Pokemon("Bulbasaur", document.querySelector("#player1-hp"));
const player2 = new Pokemon("Squirtle", document.querySelector("#player2-hp"));

const btnAttack = document.getElementById("move-1") as HTMLButtonElement;
const btnHeal = document.getElementById("move-2") as HTMLButtonElement;

const buttons = [btnAttack, btnHeal];

const lifebarTransitionDuration = parseInt(
  window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--lifebar-transition-duration")
);

/* Events */
btnAttack.addEventListener("click", () => {
  disableButtons();
  registerPokemonMove(player1.attack, player2);
  sleep(lifebarTransitionDuration * 2).then(() => enableButtons());
});

btnHeal.addEventListener("click", () => {
  disableButtons();
  registerPokemonMove(player1.heal);
  sleep(lifebarTransitionDuration * 2).then(() => enableButtons());
});

/* Functions */
function disableButtons() {
  for (const button of buttons) {
    button.disabled = true;
    button.classList.add("disabled");
  }
}

function enableButtons() {
  for (const button of buttons) {
    button.disabled = false;
    button.classList.remove("disabled");
  }
}

function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function runBulbasaurAnimation() {
  bulbasaur.style.bottom = "-1%";
  sleep(100).then(() => {
    bulbasaur.style.bottom = "0";
  });
}

function runSquirtleAnimation() {
  squirtle.style.top = "21%";
  sleep(100).then(() => {
    squirtle.style.top = "20%";
  });
}

function registerPokemonMove(callback: Function, target?: Pokemon) {
  let random = getRandomIntInclusive(1, 2);

  if (random === 1) {
    if (target) callback.call(player1, target);
    else callback.call(player1);
    runBulbasaurAnimation();

    if (player2.hp <= 0) return;
    else {
      sleep(lifebarTransitionDuration).then(() => {
        player2.move(player1);
        runSquirtleAnimation();
      });
    }
  } else {
    player2.move(player1);
    runSquirtleAnimation();

    if (player1.hp <= 0) return;
    else {
      sleep(lifebarTransitionDuration).then(() => {
        if (target) callback.call(player1, target);
        else callback.call(player1);
        runBulbasaurAnimation();
      });
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
