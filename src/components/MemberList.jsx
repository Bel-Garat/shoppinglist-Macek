import React from "react";

export default function MemberList({ members }){
  return (
    <div className="members">
      {members.map(m => (
        <div className="member" key={m.id}>
          <div>
            <strong>{m.name}</strong>{" "}
            <span className="badge">({m.role})</span>
          </div>
          <div className="row">
            <button className="primary" onClick={()=>alert("")}>
              Role
            </button>
            <button className="danger" onClick={()=>alert("")}>
              Odebrat
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
