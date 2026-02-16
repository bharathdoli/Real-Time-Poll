import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

export default function Poll() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/poll/${id}`)
      .then((res) => setPoll(res.data));

    socket.emit("join", id);

    socket.on("update", setPoll);

    if (localStorage.getItem(id)) setVoted(true);

    return () => socket.off("update");
  }, [id]);

  const vote = (i) => {
    if (voted) return;

    socket.emit("vote", {
      pollId: id,
      optionIndex: i,
    });

    localStorage.setItem(id, "true");
    setVoted(true);
  };

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  if (!poll) return null;

  return (
    <div className="container">
      <div className="card">
        <h2>{poll.question}</h2>

        {poll.options.map((o, i) => (
          <button
            key={i}
            className="option-btn"
            disabled={voted}
            onClick={() => vote(i)}
          >
            {voted ? `${o.text} — ${o.votes}` : o.text}
          </button>
        ))}

        <button className="share" onClick={share}>
          Share Poll
        </button>

        {copied && <p className="small">Link copied!</p>}
        {voted && <p className="small">Thanks for voting 🙌</p>}
      </div>
    </div>
  );
}
