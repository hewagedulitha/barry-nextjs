"use client";

import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef, useState } from "react";
import { SessionContext } from "./SessionContext.js";
import { ConnectOptions, useVoice } from "@humeai/voice-react";
import { API_URL } from "./Contants";
import Nav from "./Nav";
import HistoryItem from "./HistoryItem";
import Survey from "./Survey";

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const [isLoading, setLoading] = useState(false)
  const [showSurvey, setShowSurvey] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const [history, setHistory] = useState<Array<HistoryItem>>([])
  const [behaviourDescription, setBehaviourDescription] = useState("")
  const [currentMilestone, setCurrentMilestone] = useState("")
  const [escalationLevel, setEscalationLevel] = useState(-1)

  var interval: NodeJS.Timeout | null | undefined = null

  const dummyData = {
    "session_id":"5047d84c-1207-4cd7-9d1e-9bde410c5409",
    "history":[
      {
        "turnId": "1",
        "user": {
          "role":"user",
          "content":"What brings you in today?",
          "milestone":"Complaining about the time - You are impatient and irritated about waiting. You argue about how long everything takes and questions what the nurses are doing instead of helping you.","behaviour":"Violent and threatening. You shout, and lose control. Speech becomes fragmented and loud, driven by panic and rage."
        },
        "assistant": {
          "role":"assistant",
          "content":"assistant\n\n\"What the fuck's takin' so long? I've been sittin' here for hours, mate! Can't ya see my arm's all fucked up from that fall at work yesterday? Gave me a right crook of the shoulder, I did. Need some pain meds pronto before I go mental!\"","milestone":"Complaining about the time - You are impatient and irritated about waiting. You argue about how long everything takes and questions what the nurses are doing instead of helping you.","behaviour":"Violent and threatening. You shout, and lose control. Speech becomes fragmented and loud, driven by panic and rage."
        },
      },
      {
        "turnId": "2",
        "user": {
          "role":"user",
          "content":"How long have you been feeling this pain?",
          "milestone":"Complaining about the time - You are impatient and irritated about waiting. You argue about how long everything takes and questions what the nurses are doing instead of helping you.","behaviour":"Violent and threatening. You shout, and lose control. Speech becomes fragmented and loud, driven by panic and rage."
        },
        "assistant": {
          "role":"assistant",
          "content":"assistant\n\n\"For Christ's sake, since bloody last night after the accident, you numpty! It's been throbbin' away like a jackhammer ever since. So can we just skip the small talk and get me those pills already?\"","milestone":"Complaining about the time - You are impatient and irritated about waiting. You argue about how long everything takes and questions what the nurses are doing instead of helping you.","behaviour":"Violent and threatening. You shout, and lose control. Speech becomes fragmented and loud, driven by panic and rage."
        },
      },
      {
        "turnId": "3",
        "user": {
          "role":"user",
          "content":"Can you describe the pain for me?",
          "milestone":"Complaining about the time - You are impatient and irritated about waiting. You argue about how long everything takes and questions what the nurses are doing instead of helping you.","behaviour":"Violent and threatening. You shout, and lose control. Speech becomes fragmented and loud, driven by panic and rage."
        },
        "assistant": {
          "role":"assistant",
          "content":"assistant\n\n\"It feels like someone's stuck a red-hot poker straight through my shoulder blade, ya daft cow! Every move I make sends jolts of pure agony shootin' down my arm. And don't even get me started on tryin' to sleep - forget about it, I was tossin' and turnin' half the night, cursing every second.\"","milestone":"Complaining about the time - You are impatient and irritated about waiting. You argue about how long everything takes and questions what the nurses are doing instead of helping you.","behaviour":"Violent and threatening. You shout, and lose control. Speech becomes fragmented and loud, driven by panic and rage."
        },
      },
      {
        "turnId": "4",
        "user": {
          "role":"user",
          "content":"Do you have any other medical conditions?",
          "milestone":"Complaining about the time - You are impatient and irritated about waiting. You argue about how long everything takes and questions what the nurses are doing instead of helping you.","behaviour":"Violent and threatening. You shout, and lose control. Speech becomes fragmented and loud, driven by panic and rage."
        },
        "assistant": {
          "role":"assistant",
          "content":"assistant\n\n\"Oh, for fuck's sake, do I look like a bloomin' encyclopedia to you? No, there ain't nothin' else wrong with me besides this buggered shoulder, now stop askin' stupid questions and give me them painkillers before I really lose my rag!\"","milestone":"Complaining about the time - You are impatient and irritated about waiting. You argue about how long everything takes and questions what the nurses are doing instead of helping you.","behaviour":"Violent and threatening. You shout, and lose control. Speech becomes fragmented and loud, driven by panic and rage."
       },
      },

  ]} 

  function startInterval(session: string) {
    fetchStatus(session)
    if (interval != null) {
      clearInterval(interval)
    }
    
    interval = setInterval(fetchStatus, 5000, session)
  }

  function removeInterval() {
     if (interval != null) {
      clearInterval(interval)
    }
  }

  async function fetchStatus(session: String) {
    const response = await fetch(API_URL + "/chat/status/" + session, {
      method: "get",
      headers: new Headers({
        'Access-Control-Allow-Origin': '*',
      }),
    })
    const data = await response.json()
    console.log(data)
    setBehaviourDescription(data["behaviour_description"])
    setCurrentMilestone(data["current_milestone"])
    setEscalationLevel(data["escalation_level"])
  }

  async function fetchSessionData() {
    const response = await fetch(API_URL + "/chat/history/" + sessionId, {
      method: "get",
      headers: new Headers({
        'Access-Control-Allow-Origin': '*',
      }),
    })
    const data = await response.json()
    console.log(data)
    setHistory(data["history"].map((item: { role: string; content: string; }, i: any) => {
      var row = new HistoryItem()
      row.id = String(i)
      if (item.role == "user") {
          row.user = item.content
      } else {
        row.assistant = item.content
      }
      // row.user = item.user.content
      // row.assistant = item.assistant.content
      return row
    }))
  }

  function handleSessionChange(session: string) {
    setSessionId(session)
    startInterval(session)
  }

  function handleEscalationLevelChange(level: number) {
    setEscalationLevel(level)
  }

  function handleEndCall() {
    fetchSessionData()
    removeInterval()
    setShowSurvey(true)
  }

  return (
    <>
    <Nav sessionId={sessionId} escalationLevel={escalationLevel} milestone={currentMilestone}/>
    {/* <div className="p-1"/> */}
     <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"
      }
    >
      <VoiceProvider
        onMessage={() => {
          if (timeout.current) {
            window.clearTimeout(timeout.current);
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              const scrollHeight = ref.current.scrollHeight;

              ref.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
              });
            }
          }, 200);
        }}
      >
        <SessionContext.Provider value={sessionId}>
          <Messages ref={ref} />
          <Controls onEndCall={handleEndCall}/>
          {showSurvey
            ? <Survey history={history} setHistory={setHistory} setShowSurvey={setShowSurvey}/>
          : <StartCall accessToken={accessToken} history={history} setHistory={setHistory} handleSessionChange={handleSessionChange} handleEscalationLevelChange={handleEscalationLevelChange} />
          }
          
          
        </SessionContext.Provider>

      </VoiceProvider>
    </div>
    </>
   
  );
}
