import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

import styles from '../styles/Home.module.css';

interface State {
  initialUser: User
}

interface User {
  id: number,
  token: string,
  sessions: any,
}

export default function Home({ initialUser }: State) {
  const [trackerName, setTrackerName] = useState(``);
  const [trackerStart, setTrackerStart] = useState<any>(null);
  const [trackerElapsed, setTrackerElapsed] = useState<any>(null);

  const [user, setUser] = useState<User>(initialUser);

  // Check session / user
  if(!user) {
    const token = uuidv4();

    // Create user
    fetch("http://localhost:3000/api/user/", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        console.log("USER CREATAE DTATA", data)
        setUser(data);

        // Create cookie for session management if successful
        Cookies.set("token", { token: uuidv4() })
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    console.log(Cookies.get("token"));
    if (trackerStart) {
      const interval = setInterval(() => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - trackerStart.getTime()) / 1000;

        console.log(`${Math.round(seconds)} seconds`);
        setTrackerElapsed(Math.round(seconds));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [trackerStart]);

  return (
    <div className={styles.container}>
      <div className={styles.newTrackerWindow}>
        <input
          type="text"
          placeholder="Name"
          className={styles.trackerName}
          value={trackerName}
          onChange={(e) => setTrackerName(e.target.value)}
        />
        <button
          type="button"
          disabled={false}
          className={styles.btn}
          onClick={() => setTrackerStart(new Date())}
        >
          Start
        </button>
        <button
          type="button"
          disabled={!trackerStart}
          className={styles.btn}
          onClick={() => setTrackerStart(null)}
        >
          Stop
        </button>
        <button
          type="button"
          disabled={!trackerStart}
          className={styles.btn}
          onClick={() => {
            setTrackerStart(null);
            // SAVE TRACKER TO BACKEND
          }}
        >
          Save
        </button>
      </div>

      <div className={styles.activeTrackerWindow}>
        <h3 className={styles.windowTitle}>Active tracking</h3>
        {trackerName ? <p>Tracker name: {trackerName}</p> : null}
        {trackerElapsed ? (
          <p>{trackerElapsed} seconds</p>
        ) : (
          <p>No active tracking</p>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  let token = null;
  let user = null;
  if(context.req.cookies.token) {
    token = JSON.parse(context.req.cookies.token).token;

    fetch(`http://localhost:3000/api/user/${token}`)
      .then(res => res.json())
      .then(data => {
        user = data;
      })
      .catch(err => console.error(err))
  }

  return {
    props: {
      user
    },
  }
}
