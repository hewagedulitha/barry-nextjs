import { ConnectOptions, useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { SetStateAction, useState, useContext } from 'react'
import Guide from "./Guide";
import { API_URL } from "./Contants";
import Survey from "./Survey";
import { SessionContext } from "./SessionContext";
import { SessionSettings } from "hume/api/resources/empathicVoice";
import HistoryItem from "./HistoryItem";

export default function StartCall({ accessToken, history, setHistory, handleSessionChange, handleEscalationLevelChange } : {
  accessToken: string,
  history: HistoryItem[],
  setHistory: ([]) => void,
  handleSessionChange: (arg0: string) => void, 
  handleEscalationLevelChange: (arg0: number) => void,
}) {
  const session = useContext(SessionContext);
  const { status, connect } = useVoice();
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [behaviourDescription, setBehaviourDescription] = useState("")
  const [currentMilestone, setCurrentMilestone] = useState("")
  const [newEscalationLevel, setNewEscalationLevel] = useState(3)
  const [currentEscalationLevel, setCurrentEscalationLevel] = useState("")

  async function handleCreateNewSession() {
    setLoading(true)
    setError("")
    setMessage("Creating new session...")
    try {
      const response = await fetch(API_URL + '/chat/new_session', {
      method: "get",
      headers: new Headers({
        'Access-Control-Allow-Origin':'*',
      }),
    })
   

    const data = await response.json()
    console.log(data)
    handleSessionChange(data["session_id"])
    await handleSetEscalationLevel(data["session_id"])
    } catch (e) {
      setError("Failed to fetch session: " + e)
    } finally {
      setLoading(false)
      setMessage("")
    }
    

  }

  async function handleSetEscalationLevel(session: String) {
    setMessage("Setting escalation level...")
    const response = await fetch(API_URL + "/escalation/" + newEscalationLevel + "?session_id=" + session, {
      method: "get",
      headers: new Headers({
        'Access-Control-Allow-Origin': '*',
      }),
    })
    const data = await response.json()
    connectEVI()
    console.log(data)
    handleEscalationLevelChange(Number(data['escalation_level']))
    setLoading(false)
  }

  function connectEVI() {
    const EVI_CONNECT_OPTIONS: ConnectOptions = {
      auth: { type: "accessToken", value: accessToken },
      // configId: "bcc0d2e7-7952-4e27-83ce-0006fc5e6b35",
      configId: "3e525ac1-b51c-4f61-91f0-3d35c415183c",
      sessionSettings: {type: "session_settings", customSessionId: session},
    };
    connect(EVI_CONNECT_OPTIONS)
                    .then(() => {})
                    .catch(() => {})
                    .finally(() => {});
  }

  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
        <motion.div
          className={
            "fixed inset-0 p-4 flex items-center justify-center bg-background"
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
          <div className="grid grid-cols-2 gap-4">
            {/* <span>Hello</span> */}
            <Guide/>
            <div>
              <AnimatePresence>
              <motion.div
                variants={{
                  initial: { scale: 0.5 },
                  enter: { scale: 1 },
                  exit: { scale: 0.5 },
                }}
              >
                <div className="mb-5">
                      <label className="block mb-2 text-sm font-medium dark:text-white">Escalation Level (1-3)</label>
                      <input type="text" value={newEscalationLevel} onChange={(e) => setNewEscalationLevel(Number(e.target.value))} id="escalation"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                      />
                    </div>
                <Button
                  className={"z-50 flex items-center gap-1.5"}
                  onClick={handleCreateNewSession}
                >
                  <span>
                    <Phone
                      className={"size-4 opacity-50"}
                      strokeWidth={2}
                      stroke={"currentColor"}
                    />
                  </span>
                  <span>Start Call with Escalation Level {newEscalationLevel}</span>
                </Button>
                {
                      isLoading && <div role="status" className="">
                      <div>
                         <span className="sr-only">Loading...</span>
                      </div>
                      <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                        <svg aria-hidden="true" className="w-6 h-6 animate-spin fill-blue-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                      {message}
                      </div>
                    </div>
                    }
                {
                  error != "" && <><div className="p-2"></div><div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                  <span className="font-medium">Error</span> {error}
                </div></>
                }
                {
                  status.value === "error" && <><div className="p-2"></div><div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                  <span className="font-medium">Error</span> {status.reason}
                </div></>
                }
              </motion.div>
            </AnimatePresence>
            <div className="p-2"></div>
            {/* {session != "" && <Survey history={history} setHistory={setHistory}/>} */}
            </div>
          </div>
          
          
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
