//fetches gameCanvas elements from HTML 
const canvas = document.getElementById('gameCanvas'); 
const ctx = canvas.getContext('2d'); 





//object defining & object variables

//define the SVG for the player
const playerSVG = `
<svg width="861" height="249" viewBox="0 0 861 249" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="430.337" cy="124.5" rx="430.337" ry="124.5" fill="black"/>
<g filter="url(#filter0_i_1_37)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M843.693 159.244C854.748 148.217 860.674 136.559 860.674 124.5C860.674 55.7405 668.005 0 430.337 0C192.668 0 0 55.7405 0 124.5C0 136.559 5.92571 148.217 16.9806 159.244C68.962 107.392 234.349 69.4883 430.337 69.4883C626.325 69.4883 791.712 107.392 843.693 159.244Z" fill="#D9D9D9"/>
</g>
<defs>
<filter id="filter0_i_1_37" x="0" y="0" width="860.674" height="167.044" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="8"/>
<feGaussianBlur stdDeviation="3.9"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_1_37"/>
</filter>
</defs>
</svg>
`;

//function to convert the SVG string to an Image object
function svgToImage(svgString) {
    const blob = new Blob([svgString], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.src = url;
    return image;
}

//create player object
const player = {
    image: svgToImage(playerSVG), //SVG converted to an Image object
    x: canvas.width / 2 - 50, //initial horizontal pos
    y: canvas.height - 40, //vertical pos
    width: 100, //width of player
    height: 30, //height of player
    speed: 50, //player movement speed (technically amount of pixels player moves when key is pressed).
    caughtLetters: [] //array to store caught letters
};

//load image
player.image.onload = function() {
    update(); //updates game
};

//update drawPlayer function to use the SVG image instead of drawing a rectangle
function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

//letter object
const letterObject = {
    x: Math.random() * (canvas.width - 30), //randomizes intiial x position within the canvas width
    y: 0, //initial pos at top of the screen
    width: 30, //letter width
    height: 30, //letter height
    speed: 2, //letter movement speed
    letter: getRandomLetter() //returns random alphabet letter
};//end of letterObject




//functions


//helper function for resetLetter() to get a random alphabet letter
function getRandomLetter() { 
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; //alphabet list
    return alphabet[Math.floor(Math.random() * alphabet.length)]; //returns a random letter within the string.
}//end of getRandomLetter()





//handles player movement
function movePlayer(direction) {
    //if player position is not at the very left, player will move left.
    if (direction === 'left' && player.x > 0) { //checks player position is not at the very left.
        player.x -= player.speed; //moves player to left
    //if player position is not at the very right, player will move right.
    } else if (direction === 'right' && player.x < canvas.width - player.width) { //checks if player is within canvas bounds.
        player.x += player.speed; //moves player to right
    }
}//end of movePlayer()





//checks collision between player object and letter
function checkCollision() {
    //if player parameters are within letter parameters, then letter is stored and then reset.
    if (
        player.x < letterObject.x + letterObject.width &&
        player.x + player.width > letterObject.x &&
        player.y < letterObject.y + letterObject.height &&
        player.y + player.height > letterObject.y
    ) {
        player.caughtLetters.push(letterObject.letter);
        resetLetter();
    }
    //if letter reaches bottom of the canvas without hitting player, then it is simply reset.
    if (letterObject.y > canvas.height) {
        resetLetter();
    }
}//end of checkCollision()





//resets letter to a random horizontal pos and top of canvas. also replaces letter with a random letter of the alphabet
function resetLetter() {
    letterObject.x = Math.random() * (canvas.width - 30); //randomizes horizontal position of letter within the canvas
    letterObject.y = 0; //resets letter position to top of canvas
    letterObject.letter = getRandomLetter(); //changes character to a random letter of the alphabet
}//end of resetLetter()





//keeps looping animations and updating stored value of username.
function update() {
    
    //clears canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draws player
    drawPlayer();

    letterObject.y += letterObject.speed; //speed for movement of letters

    //check collision
    checkCollision();

    //style of font
    ctx.fillStyle = '#FF0000';
    ctx.font = '18px Filson Soft';
    ctx.fillText(letterObject.letter, letterObject.x, letterObject.y + 20);

    //draw caught letters
    ctx.fillStyle = '#000000';
    ctx.fillText(player.caughtLetters.join(''), 190, 43);
  
    //draw username card
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.roundRect(175, 15, 300, 40, 60);
    ctx.stroke();
    
    // Always keep game running
    requestAnimationFrame(update);
}





//restarts game by resetting values
function restartGame() {
    player.caughtLetters = []; //clears stored characters
    resetLetter(); //resets letter to random one in the alphabet and position.
    document.getElementById('gameScreen').style.display = 'block'; //shows gameScreen
    document.getElementById('submissionScreen').style.display = 'none'; //keeps submissionScreen hidden
    document.getElementById('landingPage').style.display = 'none'; //keeps landingPage hidden
}//end of restartGame()





//starts game by hiding landingPage and resetting game.
function startGame() {
    document.getElementById('gameScreen').style.display = 'block'; //show gameScreen
    document.getElementById('submissionScreen').style.display = 'none'; //hide submissionScreen
    document.getElementById('landingPage').style.display = 'none'; //hide landingPage
    restartGame(); //restartsGame
}//end of startGame()





//shows submissionScreen and hides other screens.
function showSubmissionScreen() {
    document.getElementById('caughtLetters').textContent = player.caughtLetters.join(''); //stores caught letters into a string.
    document.getElementById('gameScreen').style.display = 'none'; //hides gameScreen
    document.getElementById('submissionScreen').style.display = 'block'; //shows submissionScreen
    document.getElementById('landingPage').style.display = 'none'; //hides landingPage
}//end of showSubmissionScreen()





//takes users back to landingPage
function restartGameFromSubmission() {
    document.getElementById('landingPage').style.display = 'block'; //show landingPage
    document.getElementById('gameScreen').style.display = 'none'; //hide gameScreen
    document.getElementById('submissionScreen').style.display = 'none'; //hide submissionScreen
}//end of restartGameFromSubmission()





//checks if arrow keys are pressed down, player moves in key direction and swaps key image to activated image.
document.addEventListener('keydown', function(event) {
    //if key pressed is the left key then player moves to the left and left key becomes red.
    if (event.key === 'ArrowLeft') { 
        leftKeyPressed.style.visibility='visible' //makes alternate image visible
        movePlayer('left');
    //otherwise, if the key being pressed is the right key, player moves towards the right and right key becomes red.
    } else if (event.key === 'ArrowRight') {
        rightKeyPressed.style.visibility='visible' //makes alternate image visible
        movePlayer('right');
    }
});//end of eventListener()





//returns key image back to original state when key is lifted.
document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowLeft') { 
        leftKeyPressed.style.visibility='hidden' //hides alternate image
    } else if (event.key === 'ArrowRight') {
        rightKeyPressed.style.visibility='hidden' //hides alternate image
    }
});//end of eventListener()

//starts the game
resetLetter(); //resets position and randomizes letter
update(); //keeps updating information and frames






