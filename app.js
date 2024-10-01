const selectors = {
    boardContainer: document.querySelector('.board_container'),
    gameBoard: document.querySelector('.game_board'),
    startBtn: document.querySelector('.btn_start'),
    moves: document.querySelector('.move'),
    timer: document.querySelector('.time'),
    Backside: document.querySelector('.card_back'),
    winBoard: document.querySelector('.win_board')
}

// Game state Object
// It helps us to capture the state of the game

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}

function generateGame(){
    let dimensions = selectors.gameBoard.getAttribute('data-dimension');

    // Making sure the dimension will always be an even number
    if(dimensions % 2 !== 0){
        throw new Error('The dimension of the board must be an even number');
    }
    // 🦁🦝🦘
    const icons = ["🦜", "🐘", "🐿️", "🦓", "🦅", "🦈", "🐕‍🦺", "🐧", "🦍", "🐒"];

    const picks = pickRandom(icons, (dimensions * dimensions) / 2);
    const shuffledItems = shuffle([...picks, ...picks]);

    // console.log(shuffledItems)

    const cards = `
        <div class="game_board" data-dimension="4" style="grid-template-columns: repeat(${dimensions}, auto);">
           ${shuffledItems.map((item) => `
                <div class="card">
                    <div class="card_front"></div>
                    <div class="card_back">${item}</div>
                </div>
           `).join("")}
        </div>
    `;

    const parser = new DOMParser().parseFromString(cards, 'text/html');

    selectors.gameBoard.replaceWith(parser.querySelector('.game_board'));

}

const pickRandom = (arr, dimension) => {
    let clonedArr = [...arr]
    randomPicks = [];

    for(i = 0; i < dimension; i++){
        const randomIndex = Math.floor(Math.random()  * clonedArr.length);

        randomPicks.push(clonedArr[randomIndex])
        clonedArr.splice(randomIndex, 1)

    }

    return randomPicks;
}

// The shuffle function definition
function shuffle(a){
    // Cloning the original arr so that it remains unmodified
    const clonedArr = [...a];

    // Looping backward the clonedArr
    for (index = clonedArr.length - 1; index > 0; index--) {
        // Generating a random index that will act as the new address
        // of the element to be shuffled
        const j = Math.floor(Math.random() * index);

        // Swapping the element at position i with the one at position j
        const container = clonedArr[index];
        clonedArr[index] = clonedArr[j];

        clonedArr[j] = container;
    }

    // Returning the shuffled arr
    return clonedArr;
}


// Adding the event on the cards
function attachedEvents(){
    document.addEventListener('click', (e)=>{
        // Selecting the element that caused the event
        const eventSource = e.target;

        // Selecting the parent of the element that caused the click event
        const eventSourceParent = eventSource.parentElement;

        // Testing before flipping a card
        // We need to make sure that the card has no class of flip
        if(eventSourceParent.className.includes('card') && !eventSourceParent.className.includes('flip')){
            // Calling the flipCard function
            flipCard(eventSourceParent);
        }
    });
}

generateGame();
attachedEvents();

// The flipCard function definition
function flipCard(card){
    // We are incrementing by one the flippedCards variable
    state.flippedCards++;

    // Incrementing by one the totalFlips variable
    state.totalFlips++;

    // Calling the startGame function if the card is clicked so the game starts
    if(!state.gameStarted){
        startGame();
    }

    // Condition to make sure that we only flip one or two cards, not more
    if(state.flippedCards <= 2){
        card.classList.add('flip');
    }

    // condition to test if we have atleast two cards flipped, in order to match them
    if(state.flippedCards === 2){
        // Selecting all cards that have not been matched with any
        const flippedCards = document.querySelectorAll('.flip:not(.matched)');

        // Testing whether the two flipped cards are matching
        if(flippedCards[0].innerText === flippedCards[1].innerText){
            // Adding the class of matched to the cards that are matching
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
        }

        // Setting a countdown of 1 second, then we can flip back the unmatched cards
        setTimeout(()=>{
            flipBackCards();
        }, 1000);
    }

    // If there are no more cards to flip, we win the game
    if(!document.querySelectorAll('.card:not(.flip)').length){
        // Waiting for 1 second before flipping the game board, that means we won the game
        setTimeout(() => {
            selectors.boardContainer.classList.add('flip');

            // Adding content to the win container
            selectors.winBoard.innerHTML = `
                <p class="win_text">You Won!</p>
                <p class="win_text">With <span>${state.totalFlips}</span> moves</p>
                <p class="win_text">Under <span>${state.totalTime}</span> Seconds</p>
            `;

            clearInterval(state.loop);
        }, 1000);
    }
}

// The flipBackCards function definition
function flipBackCards(){
    // Selecting all the cards that do not match in order to flip them back
    const unMatchedCards = document.querySelectorAll('.card:not(.matched)');

    unMatchedCards.forEach((card) =>{
        // Removing the class of flip to all the unmatched cards in order to flip them back
        card.classList.remove('flip');
    });

    // Setting the flippedCards back to 0
    state.flippedCards = 0;
}

// Start game function definition
function startGame(){
    state.gameStarted = true;

    selectors.startBtn.disabled = true;

    state.loop = setInterval(()=>{
        state.totalTime++;

        selectors.moves.innerHTML = state.totalFlips <= 1 ? `${state.totalFlips} move` : `${state.totalFlips} moves` ;
        selectors.timer.innerHTML = state.totalTime <= 1 ? `time: ${state.totalTime} sec` : `time: ${state.totalTime} secs` ;
    }, 1000);
    
}

selectors.startBtn.onclick = function(){
    startGame();
}









































