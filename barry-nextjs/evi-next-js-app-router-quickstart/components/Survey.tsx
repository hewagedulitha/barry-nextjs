import { ConnectOptions, useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { SetStateAction, useState, useContext } from 'react'
import Guide from "./Guide";
import { API_URL } from "./Contants";
import { SessionContext } from "./SessionContext";
import HistoryItem from "./HistoryItem";

export default function Survey({history, setHistory, setShowSurvey} : { 
  history: HistoryItem[], 
  setHistory: ([]) => void,
  setShowSurvey: (arg0: boolean) => void,
}) {
  const session = useContext(SessionContext);

  function handleToggleGood(turnId: string, good: boolean) {
    setHistory(history.map(row => {
      if (row.id == turnId) {
        return { ...row, good: good}
      } else {
        return row
      }
    }))
  }

  function handleToggleBad(turnId: string, bad: boolean) {
    setHistory(history.map(row => {
      if (row.id == turnId) {
        return { ...row, bad: bad}
      } else {
        return row
      }
    }))
  }

  function handleComment(turnId: string, comment: string) {
    setHistory(history.map(row => {
      if (row.id == turnId) {
        return { ...row, comment: comment}
      } else {
        return row
      }
    }))
  }

  function sendFeedback() {
    setShowSurvey(false)
    console.log(JSON.stringify(history))
    fetch( API_URL + '/feedback?session_id='+session, {
      method: 'POST', // Specify the HTTP method as POST
      headers: {
          'Content-Type': 'application/json' // Indicate the content type of the request body
      },
      body: JSON.stringify(history) // Convert the JavaScript object to a JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response from the server
    })
    .then(data => {
        console.log('Success:', data); // Handle the successful response data
    })
    .catch(error => {
        console.error('Error:', error); // Handle any errors during the request
    });
  }

  return (
    <div>  
            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="grid grid-cols-2">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">LLM Feedback</h5>
              <button type="button" onClick={sendFeedback} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Submit
              </button>

            </div>
            <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Prompt
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Response
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Good
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Bad
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Comments
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                              {history.map(row => 
                                  <tr key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                       { row.user }
                                    </th>
                                    <td className="px-6 py-4">
                                        {row.assistant}
                                    </td>
                                    <td className="px-6 py-4">
                                        {row.assistant}
                                    </td>
                                    <td className="px-6 py-4">
                                        <input checked={row.good} onChange={e => { handleToggleGood(row.id, e.target.checked) }} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                    </td>
                                    <td className="px-6 py-4">
                                        <input checked={row.bad} onChange={e => { handleToggleBad(row.id, e.target.checked) }} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                    </td>
                                    <td className="px-6 py-4">
                                        <textarea onChange={e => { handleComment(row.id, e.target.value) }} rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
                                    </td>
                                </tr>
                              )}
                                
                            </tbody>
                        </table>
            </div>
            </div>  
          </div>
  );
};
