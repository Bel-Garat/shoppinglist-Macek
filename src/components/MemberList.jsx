import React from "react";

export default function MemberList({ members }){
  return (
    <div className="members">
      {members.map(m => (
        <div key={m} className="member">
          <div>
            <strong>{m}</strong>{" "}
            <span className="badge">(člen)</span>
          </div>
        </div>
      ))}
    </div>
  );
}
