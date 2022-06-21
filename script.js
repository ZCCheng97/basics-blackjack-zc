//constants
var WIN = 1;
var LOSE = 2;
var DRAW = 0;

var DEALING = 0;
var PLAYING = 1;
var AIPLAYING = 2;

// Global variables
var playerHand = [];
var aiHand = [];
var gameMode = DEALING;
var aiRiskThreshold = 17;

var makeDeck = function () {
  var deck = [];
  var suits = ["♠", "♣", "♥", "♦"];
  var values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  for (countSuit = 0; countSuit < suits.length; countSuit++) {
    for (let countValues = 0; countValues < values.length; countValues++) {
      deck.push({ value: values[countValues], suit: suits[countSuit] });
    }
  }
  return deck;
};

var draw = function (hand, deck) {
  var drawnCard = deck.pop();
  hand.push(drawnCard);
};

var deal = function (listOfHands, noOfCards, deck) {
  for (var i = 0; i < noOfCards; i++) {
    for (var j = 0; j < listOfHands.length; j++) {
      draw(listOfHands[j], deck);
    }
  }
};

var shuffleDeck = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    // Generate random number
    var j = Math.floor(Math.random() * (i + 1));

    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

var handValueCounter = function (hand) {
  var totalValue = 0;
  var noOfAces = 0;
  for (var i = 0; i < hand.length; i++) {
    if (hand[i].value == "J" || hand[i].value == "Q" || hand[i].value == "K") {
      totalValue += 10;
    } else if (hand[i].value == "A") {
      noOfAces += 1;
    } else {
      totalValue += Number(hand[i].value);
    }
  }
  for (var i = 0; i < noOfAces; i++) {
    if (totalValue + 11 <= 21) {
      totalValue += 11;
    } else {
      totalValue += 1;
    }
  }
  return totalValue;
};

var winChecker = function (hand1, hand2) {
  if (handValueCounter(hand1) > 21 && handValueCounter(hand2) > 21) {
    return DRAW;
  } else if (handValueCounter(hand1) > 21) {
    return LOSE;
  } else if (handValueCounter(hand2) > 21) {
    return WIN;
  } else {
    if (handValueCounter(hand1) > handValueCounter(hand2)) {
      return WIN;
    } else if (handValueCounter(hand1) < handValueCounter(hand2)) {
      return LOSE;
    } else {
      return DRAW;
    }
  }
};

var bjChecker = function (hand) {
  if (handValueCounter(hand) == 21 && hand.length == 2) {
    return true;
  }
  return false;
};

var handDisplay = function (hand) {
  var text = ``;
  for (var i = 0; i < hand.length; i++) {
    text += `<br>${hand[i].value + hand[i].suit}`;
  }
  return text;
};

var statusDisplay = function (hand1, hand2, slice) {
  var status =
    `<br><br>Player cards drawn (${handValueCounter(hand1)}):` +
    handDisplay(hand1);
  if (slice) {
    status +=
      `<br><br>AI cards drawn (${handValueCounter(
        hand2.slice(slice)
      )}):<br>??` + handDisplay(hand2.slice(slice));
  } else {
    status +=
      `<br><br>AI cards drawn (${handValueCounter(hand2.slice(slice))}):` +
      handDisplay(hand2.slice(slice));
  }
  return status;
};

var ai = function (deck) {
  var currentScore = handValueCounter(aiHand);
  if (currentScore < aiRiskThreshold) {
    draw(aiHand, deck);
  }
};

var main = function (input) {
  if (gameMode == DEALING) {
    aiHand = [];
    playerHand = [];
    sampleDeck = shuffleDeck(makeDeck());
    deal([playerHand, aiHand], 2, sampleDeck);
    if (bjChecker(playerHand) && bjChecker(aiHand)) {
      return (
        "It's a tie! Press Submit again to start a new round." +
        statusDisplay(playerHand, aiHand, 0)
      );
    } else if (bjChecker(playerHand)) {
      return (
        "Blackjack! Player wins! Press Submit again to start a new round." +
        statusDisplay(playerHand, aiHand, 0)
      );
    } else if (bjChecker(aiHand)) {
      return (
        "Blackjack! AI wins! Press Submit again to start a new round." +
        statusDisplay(playerHand, aiHand, 0)
      );
    } else {
      gameMode = PLAYING;
      return (
        "Cards have been dealt; player 1 hit or stand?" +
        statusDisplay(playerHand, aiHand, 1)
      );
    }
  }
  if (gameMode == PLAYING) {
    if (input == "h") {
      draw(playerHand, sampleDeck);
      if (handValueCounter(playerHand) > 21) {
        gameMode = AIPLAYING;
        return (
          "Oops! Looks like you bust. Press Submit again to continue." +
          statusDisplay(playerHand, aiHand, 1)
        );
      }
      return "Player 1 hit or stand?" + statusDisplay(playerHand, aiHand, 1);
    } else if (input == "s") {
      gameMode = AIPLAYING;
      return (
        "Alright, now it's the AI's turn. Press Submit again to continue." +
        statusDisplay(playerHand, aiHand, 1)
      );
    } else {
      return (
        "Please enter h or s to hit or stand." +
        statusDisplay(playerHand, aiHand, 1)
      );
    }
  }

  if (gameMode == AIPLAYING) {
    ai(sampleDeck);
    var winner = winChecker(playerHand, aiHand);
    var winStatement = "";
    if (winner == 1) {
      winStatement = "Player wins! Press Submit again to start a new round.";
    } else if (winner == 2) {
      winStatement = "AI wins! Press Submit again to start a new round.";
    } else {
      winStatement = "It's a tie! Press Submit again to start a new round.";
    }
    gameMode = DEALING;
    return winStatement + statusDisplay(playerHand, aiHand, 0);
  }
};

// Gameplay
// Check if any blackjacks after dealing, end the game if there is at least one blackjack
// Player chooses to hit or stand until done
// AI hits or stand until done. It should choose to hit as long as current total is < 21 and less than player total
// check winner
