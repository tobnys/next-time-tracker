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
  const [runTracker, setRunTracker] = useState(false);
  const [trackerName, setTrackerName] = useState(``);
  const [trackerStart, setTrackerStart] = useState<any>(null);
  const [trackerElapsed, setTrackerElapsed] = useState<any>(null);

  const [user, setUser] = useState<User>(initialUser);


  function saveSession() {
    fetch(`http://localhost:3000/api/session/`, {
      method: "POST",
      body: JSON.stringify({ 
        userId: user.id,
        name: trackerName,
        sessionStartDate: trackerStart,
        sessionEndDate: new Date(),
        activeTime: trackerElapsed,
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log("USER SAVE DTATA", data)
      })
      .catch(err => console.error(err));
  }


  useEffect(() => {
    // Check session / user
    if(!user && !Cookies.get("token")) {
      const token = uuidv4();

      // Create user
      fetch("http://localhost:3000/api/user/", {
        method: "POST",
        body: JSON.stringify({ token }),
      })
        .then(res => res.json())
        .then(data => {
          console.log("USER CREATAE CLIENT SIDE", data)
          setUser(data);

          // Create cookie for session management if successful
          Cookies.set("token", { token: uuidv4() })
        })
        .catch(err => console.error(err));
    }

    // Handle tracker dynamics
    if (runTracker) {
      const interval = setInterval(() => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - trackerStart.getTime()) / 1000;

        console.log(`${Math.round(seconds)} seconds`);
        setTrackerElapsed(Math.round(seconds));
      }, 10);
      return () => clearInterval(interval);
    }
  }, [runTracker, user]);

  console.log("USER", user);
  console.log("ELAPSED", trackerElapsed)

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
          onClick={() => {
            if(!trackerStart) {
              setTrackerStart(new Date());
            }
            setRunTracker(true);
          }}
        >
          Start
        </button>
        <button
          type="button"
          disabled={!trackerStart}
          className={styles.btn}
          onClick={() => {
            setRunTracker(false);
          }}
        >
          Stop
        </button>
        <button
          type="button"
          disabled={!trackerElapsed}
          className={styles.btn}
          onClick={() => {
            setTrackerStart(null);
            saveSession();
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
  console.log("COOKIES", context.req.cookies.token)
  if(context.req.cookies.token) {
    token = JSON.parse(context.req.cookies.token).token;
    console.log("FETCH", `http://localhost:3000/api/user/${token}`)
    const res: any = await fetch(`http://localhost:3000/api/user/${token}`)
      .catch(err => console.error(err));

    user = await res.json();
    console.log("USER OUTSIDE", user);
    return {
      props: {
        initialUser: user
      },
    }
  }

  return {
    props: {
      initialUser: user
    },
  }
}
