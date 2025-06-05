import React, { isValidElement, use, useState } from "react";
import { languages } from "./languages";
import clsx from "clsx";
import { getFarewellText, getRandomWord } from "./utils";
import Confetti from "react-confetti";

function AssemblyEndgame() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  //Derived Values

  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const numberofGuessesLeft = languages.length - 1 - wrongGuessCount;

  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const isGameLost = wrongGuessCount >= languages.length - 1;

  const isGameOver = isGameLost || isGameWon;

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];

  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  function addGuessedLetter(letter) {
    setGuessedLetters((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
  }

  const keyElement = alphabet.split("").map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);

    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        className={className}
        key={letter}
        onClick={() => addGuessedLetter(letter)}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const languageElement = languages.map((language, index) => {
    const styles = {
      color: language.color,
      backgroundColor: language.backgroundColor,
    };

    const isLost = index < wrongGuessCount;

    return (
      <span
        className={clsx("chip", {
          lost: isLost,
          farewell: !isGameOver && isLastGuessIncorrect,
        })}
        key={language.name}
        style={styles}
      >
        {language.name}
      </span>
    );
  });

  const letterElement = currentWord.split("").map((letter, index) => {
    const isMissing = isGameLost || guessedLetters.includes(letter);

    return (
      <span
        key={index}
        className={clsx(
          isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        )}
      >
        {isMissing ? letter : ""}
      </span>
    );
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <>
          {" "}
          <p className="farewell-message">
            {`${getFarewellText(languages[wrongGuessCount - 1].name)}.`}
          </p>
          <p>{`You have ${numberofGuessesLeft} attempts left`}</p>
        </>
      );
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      );
    }

    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      );
    }

    return null;
  }

  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
  }

  return (
    <>
      {isGameWon && <Confetti tweenDuration={500} numberOfPieces={1000} />}
      <main className="app-container">
        <header>
          <h1>Assembly: Endgame</h1>

          <p className="desc">
            Guess the word in under 8 attempts to keep the programming world
            safe from Assembly!
          </p>
        </header>
        <section
          aria-live="polite"
          role="status"
          className={clsx("status", {
            won: isGameWon,
            lost: isGameLost,
            farewell: !isGameOver && isLastGuessIncorrect,
          })}
        >
          {renderGameStatus()}
        </section>
        <section className="languages">{languageElement}</section>
        <div className="word">{letterElement}</div>

        {/* For Screen reader only */}
        <section className="sr-only" aria-live="polite" role="status">
          <p>
            {!isLastGuessIncorrect
              ? `Correct! The letter ${lastGuessedLetter} is in the word.`
              : `Sorry, the letter ${lastGuessedLetter} is not in the word`}
            You have {numberofGuessesLeft} attempts left
          </p>
          <p>
            Current Word:{" "}
            {currentWord
              .split("")
              .map((letter) =>
                guessedLetters.includes(letter) ? letter + "." : "blank."
              )
              .join(" ")}
          </p>
        </section>
        <div className="keyboard">{keyElement}</div>
        {isGameOver && (
          <button className="new-game" onClick={startNewGame}>
            New Game
          </button>
        )}
      </main>
    </>
  );
}

export default AssemblyEndgame;
