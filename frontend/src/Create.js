import { useState } from "react";
import axios from "axios";
export default function Create() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const createPoll = async () => {
    if (!question || options.some(o => !o)) {
      alert("Fill all fields");
      return;
    }

    const res = await axios.post("https://real-time-poll-bdwf.onrender.com/poll", {
      question,
      options
    });

    window.location = `/poll/${res.data._id}`;
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create Poll</h2>

        <input
          placeholder="Poll Question"
          onChange={e => setQuestion(e.target.value)}
        />

        {options.map((o, i) => (
          <input
            key={i}
            placeholder={`Option ${i + 1}`}
            onChange={e => {
              const arr = [...options];
              arr[i] = e.target.value;
              setOptions(arr);
            }}
          />
        ))}

        <button onClick={createPoll}>Create Poll</button>
      </div>
    </div>
  );
}
