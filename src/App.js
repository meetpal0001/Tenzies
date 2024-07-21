import React from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [dots] = React.useState(() => {
        let x = {
            1: "one",
            2: "two",
            3: "three",
            4: "four",
            5: "five",
            6: "six"
        }

        return x
    })

    const [numRolls, setNumRolls] = React.useState(0)
    const [started, setStarted] = React.useState(false)
    const [time, setTime] = React.useState({
        bestTime: JSON.parse(localStorage.getItem("bestTime"))||Infinity,
        curTime:0
    })

    const [formattedTime, setformattedTime] = React.useState({
        bestTime:"",
        curTime:""
    })

    const [isBest, setisBest] = React.useState(false)



    React.useEffect(() => {
        let date = new Date()
        setTime((prevTime)=>{
            let newTime={...prevTime,curTime:date.getTime(date)}
            return newTime
        })
    }, [started])




    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            let curDate = new Date()

            let diff = curDate.getTime(curDate) - time.curTime;

            let ss = Math.floor(diff / 1000) % 60;
            let mm = Math.floor(diff / 1000 / 60) % 60;
            let hh = Math.floor(diff / 1000 / 60 / 60);




            if(diff<time.bestTime){
                setisBest(true)

                setTime({
                    bestTime:diff,
                    curTime:diff

                })

                setformattedTime(
                    {bestTime: (`${("0" + hh).slice(-2)}:${("0" + mm).slice(-2)}:${("0" + ss).slice(-2)}`),
                        curTime:(`${("0" + hh).slice(-2)}:${("0" + mm).slice(-2)}:${("0" + ss).slice(-2)}`)}
                )

                localStorage.setItem("bestTime",JSON.stringify(time.bestTime))
            }

            else{
                let ssBest = Math.floor(time.bestTime / 1000) % 60;
                let mmBest = Math.floor(time.bestTime / 1000 / 60) % 60;
                let hhBest = Math.floor(time.bestTime / 1000 / 60 / 60);
                setformattedTime(
                    {bestTime: (`${("0" + hhBest).slice(-2)}:${("0" + mmBest).slice(-2)}:${("0" + ssBest).slice(-2)}`),
                        curTime:(`${("0" + hh).slice(-2)}:${("0" + mm).slice(-2)}:${("0" + ss).slice(-2)}`)}
                )
            }

            


            if(diff===time.bestTime){
                setisBest(true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    function rollDice() {
        if (!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ?
                    die :
                    generateNewDie()
            }))

            setNumRolls(preVal => preVal + 1)
            setStarted(true)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setNumRolls(0)
            setStarted(false)
            setisBest(false)
        }
    }

    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        }))
    }

    const diceElements = dice.map(die => (
        <Die
            key={die.id}
            value={die.value}
            dots={dots[die.value]}
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
            setStarted={setStarted}
        />
    ))

    return (
        <div>
            {tenzies && <Confetti />}

        <main>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same.
                Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <p className="numRolls">Number of Rolls: {numRolls}</p>
            <button
                className="roll-dice"
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            {tenzies && <p className="instructions curTime">Current Time: {formattedTime.curTime}</p>}
            {tenzies && <p className="instructions bestTime">Best Time: {formattedTime.bestTime} {isBest? <span> (New Best Time)</span> :"" }</p>}

        </main>
        </div>
    )
}