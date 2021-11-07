//selecting all reuired elements
const selectBox = document.querySelector(".select-box"),
selectXbtn = selectBox.querySelector(".playerX"),
selectObtn = selectBox.querySelector(".playerO"),
playBoard = document.querySelector(".play-board"),
allBox = document.querySelectorAll("section span"),
players = document.querySelector(".players"),
resultBox = document.querySelector(".result-box"),
wonText = resultBox.querySelector(".won-text"),
replayBtn = resultBox.querySelector("button"),
punkte_score = selectBox.querySelector(".punkte_score"),
result_punkte_of_match = resultBox.querySelector(".result_punkte_of_match"),
shop_box = document.querySelector(".shop-box");


//LocalStorage
localStorage.removeItem("[object HTMLDivElement]")
localStorage.removeItem("punkte_score")

lS_punkte_score = localStorage.getItem("storage_punkte_score");

if (localStorage.getItem("storage_punkte_score") == false) {
    localStorage.setItem("storage_punkte_score", 0)
}

function localStorage_set_item(name, value) {
    numb = parseFloat(lS_punkte_score.replace( /[^\d\.]*/g, '' ))
    ls_add_value = value + numb;
    localStorage.setItem(name, ls_add_value);
    punkte_score.innerHTML = "Punkte: " + lS_punkte_score;
}

user_click_player = null

window.onload = ()=> { //once window loaded

    punkte_score.innerHTML = "Punkte: " + lS_punkte_score;

    for (let i = 0; i < allBox.length; i++) { //add onclick attribute in all avaiable section's spans
        allBox[i].setAttribute("onclick", "clickedBox(this)")
    }

    selectXbtn.onclick = ()=> {
        selectBox.classList.add("hide"); //hide the select box on playerX button clicked
        shop_box.classList.add("hide");
        playBoard.classList.add("show"); //show the playboard section on playerX button clicked
        user_click_player = "X"
    }
    selectObtn.onclick = ()=> {
        selectBox.classList.add("hide"); //hide the select box on playerO button clicked
        shop_box.classList.add("hide");
        playBoard.classList.add("show"); //show the playboard section on playerO button clicked
        players.setAttribute("class", "players active player"); //adding three class names in player element
        user_click_player = "O"
    }

}

let playerXIcon = "fas fa-times"; //class name of fontawesome cross icon
let playerOIcon = "far fa-circle"; //class name of fontawesome circle icon
let playerSign = "X"; //suppose player will be X
let runBot = true;

// user click function
function clickedBox(element) {
    //console.log(element);
    if (players.classList.contains("player")) { //if players element has contains .player
        element.innerHTML = `<i class="${playerOIcon}"></i>`; //adding circle icon tag inside user clicked element
        players.classList.add("active");
        // if player select O then we'll change the playerSign value to O
        playerSign = "O";
        element.setAttribute("id", playerSign);
    } else {
        element.innerHTML = `<i class="${playerXIcon}"></i>`; //adding cross icon tag inside user clicked element
        players.classList.add("active");
        element.setAttribute("id", playerSign);
    }
    selectWinner(); //calling the winner function
    playBoard.style.pointerEvents = "none"; //once user select then user can't select any other box until box select
    element.style.pointerEvents = "none"; //once user select any box then that box can't be selected again
    let randomDelayTime = ((Math.random() * 1000) + 200).toFixed(); //generating random time delay so bot will delay randomly to select box
    setTimeout(()=> {
        bot(runBot); //calling bot function
    }, randomDelayTime); //passing random delay time
}


// bot click function
function bot(runBot) {
    if (runBot) { //if runbot is true then run the following codes
        //first change the playerSign...so if user has x value in id then bot will have O
        playerSign = "O";
        let array = []; //creating empty array...we'll store unselected box index in this array
        for (let i = 0; i < allBox.length; i++) {
            if (allBox[i].childElementCount == 0) { //if span has no any child element
                array.push(i); //inserting unclicked or unselected boxes inside array means that span has no children
                console.log(i + " " + "has no children");
            }        
        }
        let randomBox = array[Math.floor(Math.random() * array.length)]; //getting random index from array so bot will select random unselected box
        if (array.length > 0) {
            if (players.classList.contains("player")) { //if players element has contains .player
                allBox[randomBox].innerHTML = `<i class="${playerXIcon}"></i>`; //adding cross icon tag inside user clicked element
                players.classList.remove("active");
                // if user is O then box id value will be X
                playerSign = "X";
                allBox[randomBox].setAttribute("id", playerSign);
            } else {
                allBox[randomBox].innerHTML = `<i class="${playerOIcon}"></i>`; //adding circle icon tag inside user clicked element
                players.classList.remove("active");
                allBox[randomBox].setAttribute("id", playerSign);
            }
            selectWinner(); //calling the winner
        }
        allBox[randomBox].style.pointerEvents = "none"; //once bot select any box then user can't select or click on that box
        playBoard.style.pointerEvents = "auto";
        playerSign = "X"; //passing the x value
    }
}

// let work on select the winner
function getClass(idname) {
    return document.querySelector(".box" + idname).id; //returning id name
}

function checkClass(val1, val2, val3, sign) {
    if (getClass(val1) == sign && getClass(val2) == sign && getClass(val3) == sign) {
        return true;
    }
}

function selectWinner() { //if one combination of them matched then select the winner
    if (checkClass(1, 2, 3, playerSign) || checkClass(4, 5, 6, playerSign) || checkClass(7, 8, 9, playerSign) || checkClass(1, 4, 7, playerSign) || checkClass(2, 5, 8, playerSign) || checkClass(3, 6, 9, playerSign) || checkClass(1, 5, 9, playerSign) || checkClass(3, 5, 7, playerSign)) {
        console.log(playerSign + " " + "is the winner");
        //once match won by someone then stop the bot
        runBot = false;
        bot(runBot);
        setTimeout(()=> { //we'll delay to show result box
            playBoard.classList.remove("show");
            resultBox.classList.add("show");
        }, 700); //700 ms delay

        wonText.innerHTML = `Игрок <p>${playerSign}</p> выиграл игру!`;

        if (user_click_player == "X" && playerSign == "X") {
            localStorage_set_item("storage_punkte_score", 200);
            result_punkte_of_match.innerHTML = "+ 200 Punkte"
        }
        else if (user_click_player == "O" && playerSign == "O") {
            localStorage_set_item("storage_punkte_score", 200);
            result_punkte_of_match.innerHTML = "+ 200 Punkte"
        }
        else {
            result_punkte_of_match.innerHTML = "+ 0 Punkte"
        }

        //let show the result box with winner sign
    } else {
        // if match has drawn
        // first we'll check all id...if all span has id and no one won the game then we'll draw the game
        if (getClass(1) != "" && getClass(2) != "" && getClass(3) != "" && getClass(4) != "" && getClass(5) != "" && getClass(6) != "" && getClass(7) != "" && getClass(8) != "" && getClass(9) != "") {
            runBot = false;
            bot(runBot);
            setTimeout(()=> { //we'll delay to show result box
                playBoard.classList.remove("show");
                resultBox.classList.add("show");
            }, 700); //700 ms delay

            wonText.textContent = `<p>Ничья</p>!`;

            result_punkte_of_match.innerHTML = "+ 0 Punkte"
        }
    }
}

replayBtn.onclick = () => {
    window.location.reload(); //reload the current page 
}