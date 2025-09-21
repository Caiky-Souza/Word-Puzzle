let word = 0;
let char = 0;
let lives = 6;
let won = false;


let userString = "";


let blocks = document.querySelectorAll(".block");

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}


async function generateWord()
{
    let promise = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    let response = await promise.json();

    return response.word;
}



function updateLives(){
    let livesMetter = document.querySelector(".lives");
    livesMetter.textContent = lives
}


async function invalidWord() 
{
    let wordPosition = (word * 5)

    for (let i = 0; i < 5; i++)
    {
        blocks[wordPosition + i].style.borderColor = "red"
    };

    setTimeout(function (){
        for (let i = 0; i < 5; i++)
        {
            blocks[wordPosition + i].textContent = "";
            blocks[wordPosition + i].style.borderColor = "gray";
        }
        userString = ""
        char = 0
    }, 500)

    for (let i = 0; i < 5; i++)
    {
        blocks[wordPosition + i].style.backgroundColor = "white"
    }
}

function addLetter(event){

    let divPosition = (word * 5) + char


    let currentDiv = blocks[divPosition]

    if (char == 5)
    {
        return
    };

    
    currentDiv.textContent = event.key;
    userString += event.key;
    char += 1;
};

function removeLetter()
{
    if (char == 0)
    {
        return;
    }

    let divPosition = ((word * 5) + char) - 1;
    let currentDiv = blocks[divPosition];
    

    //Remove one letter 
    currentDiv.textContent = "";
    userString = userString.substring(0, userString.length - 1);
    char -= 1;
}


function success()
{
    let wordPosition = (word * 5)
    let wordBlocks = Array.from(blocks)
    
    wordBlocks = wordBlocks.slice(wordPosition, (wordPosition + 5))

    for (let i = 0; i < 5; i++)
    {
        wordBlocks[i].style.backgroundColor = "Green";
    };

    let h1 = document.querySelector(".response")

    h1.textContent = "Congratulations!!!, you won!";
    h1.style.backgroundColor = "Green";
    h1.style.opacity = 1;

    won = true;
}

function gameOver()
{
    let div = document.querySelector(".response")
    let h1 = document.querySelector(".response-text")
    let subh1 = document.querySelector(".word")
    h1.textContent = "Well, Game Over.";
    subh1.textContent = toMatchWord
    div.style.opacity = 1;
}

const toMatchWord = await generateWord()

window.x = toMatchWord
async function checkWord()
{
    if (toMatchWord == userString)
    {
        success();
        return;
    }
    else 
    {
        lives -= 1;
        updateLives();

        if (lives < 1)
        {   
            gameOver(toMatchWord);
        }
    };

    let failure = true;


    for (let i = 0; i < 5; i++)
    {
        if (toMatchWord[i] == userString[i])
        {
            toColor(i,"Green");
            failure = false;
        }
        else if (toMatchWord.includes(userString[i]))
        {
            toColor(i,"Yellow");
            failure = false;
        }
        else {
            toColor(i,"Gray");
        };
    };

    if (failure)
    {
        invalidWord();

        char = 0;
        userString = "";
        
        return;
    };

    word += 1;
    char = 0;

    userString = "";
    
};

function toColor(index, color)
{
    let divPosition = (word * 5) + index

    let div = blocks[divPosition]

    div.style.backgroundColor = `${color}`
}

async function validateWord(){
    let promise = await fetch("https://words.dev-apis.com/validate-word", {
        headers: {"Content-Type": "application/json"},
        method:"POST",
        body:JSON.stringify({"word":userString})
    });

    let { validWord } = await promise.json();

    if (!validWord)
    {
        invalidWord();
        return false;
    };

    return true;
};


async function checkKey(event){
    
    if (lives < 1 || won)
    {
        return;
    };

    const key = event.key;

    if (key == "Backspace")
    {
        removeLetter(event);
    }
    else if (key == "Enter")
    {
        if (char != 5)
        {
            return;
        }

        let validWord = await validateWord();
        if (!validWord)
        {
            return;
        }

        await checkWord();

        
    }
    else if (isLetter(key))
    {
        addLetter(event);
    };

    event.preventDefault();
};


async function main(){
    updateLives();
    document.addEventListener("keyup", checkKey);
}

await main();
