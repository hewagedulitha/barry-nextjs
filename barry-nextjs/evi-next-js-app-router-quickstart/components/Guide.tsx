"use client";
import Image from "next/image";

export default function Guide() {
  return (
    <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
                    Step-by-Step Guide
              </h5>
              <div className="grid grid-cols-2 gap-4">
                
                <p className="font-normal text-gray-700 dark:text-gray-400"><b>Step 1.</b> Click on <b>Start Call</b> button to talk with Barry.</p>
                {/* <img src="tip1.png" /> */}
                <p></p>
                <p className="font-normal text-gray-700 dark:text-gray-400"><b>Step 2.</b> Then select the right microphone and click <b>Allow</b>. (It is only prompted the first time).</p>
                <Image src="tip2.png" alt=""/>
                <p className="font-normal text-gray-700 dark:text-gray-400"><b>Step 3.</b> Start the conversation with your name. Eg. &quot;Hi Barry, I&apos;m <b>Franco</b>, a nurse here.&quot;.</p>
                <p></p>
                <p className="font-normal text-gray-700 dark:text-gray-400"><b>Step 4.</b> When you are done, terminate the session by pressing the <b>End Call</b> button.</p>
                {/* <img src="tip3.png" />
                // <p></p> */}
                <p></p>
              </div>
            </div>
    
  );
};
