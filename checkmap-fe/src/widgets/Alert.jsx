import React from 'react'
import './Alert.css'

export default function Alert({alerts = [], dismiss}) {
  if(!alerts.length) return;

  return (
    <aside className="Alert">
      {alerts.map((alert, i) =>
        <p className={alert.category} key={alert.id}>
          <span>{alert.message}</span>
          <button type="button" onClick={() => dismiss(alert)}>X</button>
        </p>
      )}
    </aside>
  );
}
