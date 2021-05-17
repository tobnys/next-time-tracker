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
  sessions: Session[],
}

interface Session {
  name: string,
  sessionStartDate: string,
  sessionEndDate: string,
  activeTime: number,
}

export default function Home({ initialUser }: State) {
  const [runTracker, setRunTracker] = useState(false);
  const [trackerName, setTrackerName] = useState(``);
  const [trackerStart, setTrackerStart] = useState<any>(null);
  const [trackerElapsed, setTrackerElapsed] = useState<any>(0);

  const [user, setUser] = useState<User>(initialUser);

  // Put sessions in a separate state to avoid manipulating the user state.
  const [sessions, setSessions] = useState<Session[]>(user && user.sessions && user.sessions);
  
  console.log("SESSIONS", sessions)
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
      const timer = setInterval(() => {
        setTrackerElapsed((elapsed: number) => elapsed+1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [runTracker]);

  console.log("USER", user);
  console.log("ELAPSED", trackerElapsed)

  return (
    <div className={styles.container}>
      <div className={styles.activeTrackerWindow}>
        <h3 className={styles.windowTitle}>Active tracking</h3>
        {trackerName ? <p>Tracker name: {trackerName}</p> : null}
        {trackerElapsed ? (
          <p>{trackerElapsed} seconds</p>
        ) : (
          <p>No active tracking</p>
        )}
      </div>

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
            // Reset values and save the session to our DB.
            setRunTracker(false);
            setTrackerStart(null);
            setTrackerElapsed(0);
            saveSession();
          }}
        >
          Save
        </button>
      </div>

      <div className={styles.sessionsWindow}>
        <h3 className={styles.windowTitle}>Session history</h3>
        <div className={styles.sessionsGrid}>
          {user && user.sessions && user.sessions.map((session: Session, index: number) => (
            <div key={index} className={styles.sessionCard}>

              {session.name ? 
                <div className={styles.dataPair}>
                  <h4>Session name</h4>
                  <p>{session.name}</p>
                </div> 
              : null}

              {session.sessionStartDate ? 
                <div className={styles.dataPair}>
                  <h4>Session start date</h4>
                  <p>{new Date(session.sessionStartDate).toLocaleString("en-EN")}</p>
                </div> 
              : null}

              {session.sessionEndDate ? 
                <div className={styles.dataPair}>
                  <h4>Session end date</h4>
                  <p>{new Date(session.sessionEndDate).toLocaleString("en-EN")}</p>
                </div> 
              : null}

              {session.activeTime ? 
                <div className={styles.dataPair}>
                  <h4>Total active time</h4>
                  <p>{session.activeTime} seconds</p>
                </div> 
              : null}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  if(context.req.cookies.token) {
    const token = JSON.parse(context.req.cookies.token).token;
    const res: any = await fetch(`http://localhost:3000/api/user/${token}`)
      .catch(err => console.error(err));

    const user = await res.json();
    return {
      props: {
        initialUser: user
      },
    }
  } else {
    return {
      props: {
        initialUser: null
      },
    }
  }
}
