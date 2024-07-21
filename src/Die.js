import React from "react"
import './style.css';

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    let die=[]

    for(let i=0; i<props.value;i++){
        die.push(<div className="die-num"></div>)
    }


    return (
        <div 
            className={props.dots+" die-face "} 
            style={styles}
            onClick={()=>{
                props.holdDice()
                props.setStarted(true)
            }}
        >
            {die}
        </div>
    )
}