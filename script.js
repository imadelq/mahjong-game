class Mahjong {

    constructor() {
        this.nbImage = 42;
        this.tailleTab = 32;
        this.tab = [];
        this.previousNode = null;
        this.previousId = -1;
        this.foundedImages = 0;
        this.time = 0;
        this.seconds = 0;
        this.score = 0;
        this.highestScore = +localStorage.getItem('highestScore');
        this.tabFoundedImages = [];
    }

    //
    generateTab(n) {
        let tab = [];
        for (let index = 0; index < n; index++) {
            tab[index] = index;
        }
        return tab;
    }

    choixAleatoire(nbi, taille) {
        let tab = this.generateTab(taille);
        let choix = [];
        let rest = taille;
        // choix de 16 chiffres parmi 42
        for (let index = 0; index < nbi; index++) {
            // effectuer le choix
            let x = Math.floor(Math.random() * rest);
            // mettre dans choix[]
            choix.push(tab[x]);
            tab.splice(x, 1);
            rest--;
        }
        return choix;
    }

    initTab() {
        let tabTmp = this.choixAleatoire(this.tailleTab / 2, this.nbImage);
        //tabTmp=[tabTmp,tabTmp];
        tabTmp = tabTmp.concat(tabTmp);
        let randomIndexTab = this.choixAleatoire(this.tailleTab, this.tailleTab);
        this.tab = [];
        for (const element of randomIndexTab) {
            this.tab.push(tabTmp[element]);
        }
    }

    loadSavedGame() {
        this.tabFoundedImages.forEach(eli => {
            screens[2].querySelectorAll("img[src$='./classic/" + eli + ".jpg']").forEach(elj => {
                elj.parentElement.parentElement.firstChild.outerHTML = null;
                elj.parentElement.parentElement.classList.remove('active', 'selected');
                elj.parentElement.parentElement.firstChild.removeAttribute("class");
                elj.parentElement.parentElement.onclick = null;
            })
        });
    }

    playMahjong() {
        let divContainer = document.querySelector("#game");
        if (divContainer === null) return -1;
        for (const element of this.tab) {
            let timer1 = null;
            let timer2 = null;
            let div = document.createElement("div");
            let img = document.createElement("img");
            img.setAttribute("src", "./classic/" + element + ".jpg");
            //img.setAttribute("width", "80");
            img.classList.add("game-image");
            let self = this;
            div.classList.add('flip-box-back');
            div.appendChild(img);
            let divfbf = document.createElement("div");
            divfbf.classList.add('flip-box-front');
            let divfb = document.createElement("div");
            divfb.classList.add('flip-box');
            divfb.appendChild(divfbf);
            divfb.appendChild(div);
            divfb.onclick = function () {
                if (self.previousId == -1) {
                    clearInterval(timer1);
                    clearInterval(timer2);
                    divContainer.querySelectorAll('.flip-box').forEach(el => el.classList.remove('active', 'selected'));
                }
                this.classList.add('active');
                let counter = 0;
                timer2 = setInterval(() => {
                    if (counter++ >= 1) {
                        clearInterval(timer2);
                    }
                }, 500);
                if (self.previousId == -1) {
                    self.previousNode = this;
                    self.previousId = element;
                    this.classList.add('selected');
                }
                // document.querySelector('').parentElement
                else if (self.previousId === element && self.previousNode !== this) {


                    let counter = 0;
                                let timer = setInterval(function () {
                                    counter += Math.floor(self.score / 80 + 1);
                                    scoreEl.innerHTML = `${self.score.toLocaleString('en-US', { minimumIntegerDigits: 5, useGrouping: false })}`;
                                    if (counter >= self.score) {
                                        scoreEl.innerHTML = `${self.score.toLocaleString('en-US', { minimumIntegerDigits: 5, useGrouping: false })}`;
                                        clearInterval(timer);
                                    }
                                }, 10);
                    self.tabFoundedImages.push(element);
                    self.foundedImages++;
                    this.firstChild.outerHTML = null;
                    this.classList.remove('active', 'selected');
                    this.firstChild.removeAttribute("class");
                    this.onclick = null;
                    self.previousNode.firstChild.outerHTML = null;
                    self.previousNode.firstChild.removeAttribute("class");
                    self.previousNode.classList.remove('active', 'selected');
                    self.previousNode.onclick = null;
                    self.previousId = -1;
                }
                else {
                    self.score = Math.max(self.score - 250, 0);
                    scoreEl.innerHTML = `${self.score.toLocaleString('en-US', { minimumIntegerDigits: 5, useGrouping: false })}`;
                    let counter = 0;
                    timer1 = setInterval(() => {
                        if (counter++ >= 1) {
                            clearInterval(timer1);
                            if (self.previousId == -1) {
                                divContainer.querySelectorAll('.flip-box').forEach(el => el.classList.remove('active', 'selected'));
                            }
                        }
                    }, 500);
                    self.previousId = -1;
                }
                if (self.foundedImages >= self.tailleTab / 2) {
                    clearInterval(self.time);
                    if (self.highestScore < self.score) {
                        self.highestScore = self.score;
                        localStorage.setItem('highestScore', self.score);
                    }
                    screens[2].querySelector(".modal__content>h3").innerHTML = `Highest score : ${self.highestScore}`;
                    setTimeout(() => {
                        screens[2].classList.add('d-none');
                        screens[3].classList.remove('d-none');
                        setTimeout(() => {
                            screens[3].classList.add('d-none');
                            screens[2].classList.remove('d-none');
                            setTimeout(() => {
                                screens[2].querySelector(".modal").classList.add('active');
                                let counter = 0;
                                let timer = setInterval(function () {
                                    counter += Math.floor(self.score / 80 + 1);
                                    screens[2].querySelector(".modal__content>h2").innerHTML = `You scored : ${counter}`;
                                    if (counter >= self.score) {
                                        screens[2].querySelector(".modal__content>h2").innerHTML = `You scored : ${self.score}`;
                                        clearInterval(timer);
                                    }
                                }, 10);
                                screens[2].querySelector(".btn-home").onclick = function () {
                                    goBackHome();
                                }
                            }, 1000);
                        }, 7500);
                    }, 1000);
                }
            }
            divContainer.appendChild(divfb);
        }
        screens[2].querySelector('#save').onclick = function () {
            localStorage.setItem('o', JSON.stringify(obj));
        }
    }
}



const screens = document.querySelectorAll('.screen');
const start_btn = document.querySelector('.start-btn');
const game_container = document.getElementById('game-container');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const scoreHi = document.getElementById('highest-score');
var obj=new Mahjong;


function loading(btn) {
    if (btn.getAttribute('id')=='btn-load' && localStorage.getItem('o') === null) return -1;
    var counter = 0;
    var c = 0;
    screens[0].classList.add('d-none');
    screens[1].classList.remove('d-none');
    let timer = setInterval(function () {
        document.querySelector(".loading-page .counter #irect").style.width = c + "%";
        counter++;
        c++;
        if (counter == 101) {
            btn.getAttribute('id')=='btn-new'?startGame():loadGame();
            clearInterval(timer);
        }
    }, 10);
};


function startGame() {
    var o = new Mahjong;
    obj=o;
    screens[1].classList.add('d-none');
    screens[2].classList.remove('d-none');
    scoreHi.innerHTML = `${o.highestScore.toLocaleString('en-US', { minimumIntegerDigits: 5, useGrouping: false })}`;
    o.initTab();
    o.playMahjong();
    o.time = timer(o);
}


function loadGame() {
    screens[1].classList.add('d-none');
    screens[2].classList.remove('d-none');
    let retrievedObject = localStorage.getItem('o');
    var o = Object.assign(new Mahjong, JSON.parse(retrievedObject));
    o.highestScore = +localStorage.getItem('highestScore');
    obj=o;
    timeEl.innerHTML = `${Math.floor(o.seconds / 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:${(o.seconds % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`;
    o.seconds++;
    scoreEl.innerHTML = `${o.score.toLocaleString('en-US', { minimumIntegerDigits: 5, useGrouping: false })}`;
    scoreHi.innerHTML = `${o.highestScore.toLocaleString('en-US', { minimumIntegerDigits: 5, useGrouping: false })}`;
    o.playMahjong();
    o.loadSavedGame();
    o.time = timer(o);
}



function timer(o) {
    return setInterval(function () {
        timeEl.innerHTML = `${Math.floor(o.seconds / 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:${(o.seconds % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`;
        o.seconds++;
    }, 1000);
}

function goBackHome() {
    setTimeout(() => { document.location.reload(); }, 500);
}


screens[2].querySelector('#pause').onclick = function () {
    let imgPause = this.getAttribute('src');
    if (imgPause.endsWith('pause.png')) {
        this.setAttribute('src', './classic/play.png');
        clearInterval(obj.time);
    }
    else {
        this.setAttribute('src', './classic/pause.png');
        obj.time = timer(obj);
    }
}