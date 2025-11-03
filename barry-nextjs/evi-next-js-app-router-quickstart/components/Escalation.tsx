import { ConnectOptions, useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { useState } from 'react'
import { useContext } from 'react';
import { SessionContext } from "./SessionContext";

export default function Escalation() {
    const session = useContext(SessionContext);
    const { status, connect } = useVoice();
    const [isLoading, setLoading] = useState(false)
    //   const [sessionId, setSessionId] = useState("")
    const [newEscalationLevel, setNewEscalationLevel] = useState(3)
    const [currentEscalationLevel, setCurrentEscalationLevel] = useState("")
  
  const API_URL = "http://3.24.142.221:9000"

  async function handleSetEscalationLevel(level: number) {
    const response = await fetch(API_URL + "/escalation/" + level + "?session_id=" + session, {
      method: "get",
      headers: new Headers({
        'Access-Control-Allow-Origin': '*',
      }),
    })
    const data = await response.json()
    console.log(data)
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {status.value == "connected" ? (
        <motion.div
          className={
            "nset-0 flex items-center justify-center bg-background"
          }
          initial="initial"
          animate="enter"
          exit="exit"
          variants={{
            initial: { opacity: 0 },
            enter: { opacity: 1 },
            exit: { opacity: 0 },
          }}
        >
          <div className="">
                      {/* <label className="block mb-2 text-sm font-medium dark:text-white">Escalation Level (1-2)</label> */}
                      <input type="text" value={newEscalationLevel} onChange={e => setNewEscalationLevel(Number(e.target.value))} id="escalation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                    </div>
                    <div className="p-2"/>
                    <Button
                    className={"z-50 flex items-center gap-1.5"}
                    onClick={() => {handleSetEscalationLevel(newEscalationLevel)}}
                    >
                    
                    <span>Set Escalation Level {newEscalationLevel}</span>
                    </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
