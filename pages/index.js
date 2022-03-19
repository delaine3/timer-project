import Head from 'next/head'
import styles from '../styles/Home.module.css'
import ReactAudioPlayer from 'react-audio-player';
import { useState,useEffect } from 'react'

export default function Home() {
  const [session_time_left,set_session_time_left] = useState("25:00")
  const [break_time_left,set_break_time_left] = useState("25:00")

  const [session_length, set_session_length] = useState(25)
  const [break_length, set_break_length] = useState(5)
  const [on_break, set_on_break] = useState(false)
  const [session_interval, set_interval] = useState("")
  const [break_interval, set_break_interval] = useState("")

  const [start_stop, set_start_stop] = useState("start")
  const [is_paused, set_is_paused] = useState(true)
  const [stored_distance, set_distance] = useState(0)

  const [session_timer,set_session_timer] = useState(true)
  const [break_timer,set_break_timer] = useState(true)

  const [break_called, set_break_called] = useState(false)

  useEffect(() => {
    if(on_break){      
      if(break_called == false){
        set_break_called(true)
        set_on_break(true)
         document.getElementById("timer-label").innerHTML = "Break"
         $('.beep').trigger("play");

        start_break_countdown()
      }
      
    }else{
      clearInterval(break_interval)
      document.getElementById("timer-label").innerHTML = "Session"

    }
  },[on_break,break_interval]);

  const reset =()=>{
    clearInterval(session_interval)
    set_break_called(false)
    set_break_length(5)
    $('.beep').load()

    set_on_break(false)
    set_session_length(25)
    set_session_time_left("25" + ":" + "00")
    set_is_paused(true)
    set_distance(0)

  }

  const start_session_countdown=(countDownDate)=>{

    if(!on_break){
      set_interval(setInterval(function() {
        // Get today's date and time
        var now = new Date().getTime();
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
      
        // Time calculations for days, hours, minutes and seconds
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = ((distance % (1000 * 60)) / 1000).toFixed(0);
          
          set_session_time_left( (minutes > 9 ? minutes : "0" + minutes) +":" + (seconds > 9 ? seconds : "0" + seconds) )
          set_distance(distance)
          
        // If the count down is over, write some text 
        if (minutes <= 0 && seconds <=0 ) {
          clearInterval(session_interval)
          set_session_time_left("00" + ":" + "00")
          set_session_timer(false)
          set_on_break(true)
        }
      }, 1000))
    }else{
      console.log("IN start_session_countdown, NOT ON BREAK")
      set_break_interval(setInterval(function() {
        // Get today's date and time
        var now = new Date().getTime();
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
      
        // Time calculations for days, hours, minutes and seconds
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = ((distance % (1000 * 60)) / 1000).toFixed(0);
          console.log(minutes + " " + seconds)
        set_break_time_left( (minutes > 9 ? minutes : "0" + minutes) +":" + (seconds > 9 ? seconds : "0" + seconds) )
          
        set_distance(distance)
          console.log(break_time_left)
        // If the count down is over, write some text 
        if (minutes <= 0 && seconds <=0 ) {
          clearInterval(break_interval)
          set_break_time_left("00" + ":" + "00")
          set_break_timer(false)
          set_on_break(false)
          return
        }
      }, 1000))

    }
 
  }

  const start =()=> {

    set_is_paused(!is_paused)
    if(is_paused){
      set_start_stop("pause")
    const end_time = new Date()
    if(stored_distance > 0){
      let stored_Minutes = new Date(stored_distance).getMinutes() 
      let stored_seconds = new Date(stored_distance).getSeconds()
      end_time.setMinutes(end_time.getMinutes() + stored_Minutes)
      end_time.setSeconds(end_time.getSeconds() + stored_seconds)

    } else{
        end_time.setMinutes(end_time.getMinutes() +  session_length)
    }
        start_session_countdown(end_time.getTime())
  }else{
         clearInterval(session_interval)
         set_start_stop("start")

  }

}
const start_break_countdown =()=> {
  console.log("IN BREAK COUNTDOWN")
  const end_time = new Date()
  if(stored_distance > 0){
    let stored_Minutes = new Date(stored_distance).getMinutes() 
    let stored_seconds = new Date(stored_distance).getSeconds()
    end_time.setMinutes(end_time.getMinutes() + stored_Minutes)
    end_time.setSeconds(end_time.getSeconds() + stored_seconds)

  } else{
      end_time.setMinutes(end_time.getMinutes() +  break_length)
  }
      start_session_countdown(end_time.getTime())


}

  const handle_change =(event)=> {
    var name = event.target.getAttribute('name'); 

    if(name == "break-increment" &&  break_length < 60 && is_paused ){
      set_break_length(break_length +1)

    }else if(name == "break-decrement" &&  break_length > 1 && is_paused){
      set_break_length(break_length -1)

    }else if(name == "session-decrement" && session_length > 1 && is_paused){
      set_session_length(session_length -1)
      set_session_time_left(session_length-1  +":"+"00" )

    }else if(name == "session-increment" &&  session_length < 60 && is_paused){
      set_session_length(session_length +1)
      set_session_time_left(session_length+1 +":"+"00" )

    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Timer App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

     <div className='outer-div'>
     <div className='upper-divs' >
         <label  id="break-label">Break Length</label>
         <p id="break-length" > {break_length}</p>
         <button className='increment' id="break-increment" name='break-increment' value={break_length}  onClick={(event) => {
        handle_change(event)}}>+</button>

         <button className='decrement' id="break-decrement" name='break-decrement' value={break_length} onClick={(event) => {
        handle_change(event)}} >-</button>
       </div>
       <audio className='beep' id='beep' src="https://www.trekcore.com/audio/aliensounds/romulan_computerbeep4.mp3"/>  
    
       <div className='upper-divs'>
         <label  id="session-label">Session Length</label>
         <p id="session-length"  > {session_length}</p>

         <button className='increment' id="session-increment" name='session-increment' value={session_length} onClick={(event) => {
        handle_change(event)}}  >+</button>
   <button className='decrement' id="session-decrement" name='session-decrement' value={session_length} onClick={(event) => {
        handle_change(event)}}  >-</button>
       </div>
<br/>
        <div className='time-remaining'>
          <label id="timer-label" >Session </label>
      <p id="time-left" >{on_break ? break_time_left : session_time_left} </p>
      <button className={start_stop} id="start_stop" onClick={start}> {is_paused ? "Start" : "Pause"} </button>

      <button id="reset" className='reset' onClick={reset}>Reset</button>
        </div>
     </div>
     <script defer src='https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js' ></script>
     <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>

    </div>
  )
}
