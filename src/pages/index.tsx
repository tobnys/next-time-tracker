import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [trackerName, setTrackerName] = useState(``);
  const [trackerStart, setTrackerStart] = useState<any>(null);
  const [trackerElapsed, setTrackerElapsed] = useState<any>(null);

  useEffect(() => {
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

export const getServerSideProps = async (context: any) => ({
  props: {},
});
