var inquirer = require("inquirer");
var chalk = require("chalk");
var Word = require("./word");
var words = require("./words");

function Game() {
  var self = this;
  this.play = function() {
    this.guessesCount = 10;
    this.next();
  };

  this.next = function() {
    var random = words[Math.floor(Math.random() * words.length)];
    this.current = new Word(random);
    console.log("\n" + this.current + "\n");
    this.makeGuess();
  };

  this.makeGuess = function() {
    this.askLetter().then(function() {
      if (self.guessesCount < 1) {
        console.log(
          "No guesses left! Word was: \"" + self.current.getSolution() + "\"\n"
        );
        self.playAgain();
      }
      else if (self.current.guessedRight()) {
        console.log("You got it right! Next!");
        self.guessesCount = 10;
        self.next();
      }
      else {
        self.makeGuess();
      }
    });
  };

  this.playAgain = function() {
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "choice",
          message: "Try Again?"
        }
      ])
      .then(function(val) {
        if (val.choice) {
          self.play();
        }
        else {
          self.quit();
        }
      });
  };

  this.askLetter = function() {
    return inquirer
      .prompt([
        {
          type: "input",
          name: "choice",
          message: "Guess a letter!",
          validate: function(val) {
            return /[a-z1-9]/gi.test(val);
          }
        }
      ])
      .then(function(val) {
        var didGuessCorrectly = self.current.guessLetter(val.choice);
        if (didGuessCorrectly) {
          console.log(chalk.green("\nCORRECT!\n"));
        }
        else {
          self.guessesCount--;
          console.log(chalk.red("\nINCORRECT!\n"));
          console.log(self.guessesCount + " guesses remaining!\n");
        }
      });
  };

  this.quit = function() {
    console.log("\nGoodbye!");
    process.exit(0);
  };
}

module.exports = Game;
