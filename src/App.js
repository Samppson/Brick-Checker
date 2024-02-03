import React from "react";
import realmsArray from "./realms";

function App() {
  const [responseData, setResponseData] = React.useState(null);
  const [error, setError] = React.useState(null);

  return (
    <div style={containerStyle}>
      <InputForm
        onResponseData={responseData}
        onSetResponseData={setResponseData}
        onSetError={setError}
      />
      <BrickResults onResponseData={responseData} onError={error} />
    </div>
  );
}

const InputForm = ({ onSetResponseData, onSetError }) => {
  const [charName, setCharName] = React.useState("");
  const [serverName, setServerName] = React.useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://raider.io/api/v1/characters/profile?region=us&realm=${serverName}&name=${charName}&fields=mythic_plus_recent_runs`
      );

      if (!response.ok) {
        if (response.status === 404) {
          onSetError("Character not found");
        } else {
          onSetError(`Error fetching data. Status code: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      onSetResponseData(data);
    } catch (error) {
      onSetError("Error fetching data");
    }
  };

  const handleButtonClick = () => {
    fetchData();
  };

  const emojiStyle = {
    width: "40px", // Adjust the width to your preference
    height: "40px", // Adjust the height to your preference
    marginRight: "5px", // Add some margin to separate the image from the text
  };

  return (
    <div style={inputFormStyle}>
      <h2 style={titleStyle}>
        <img src="/pepega.png" style={emojiStyle} alt="pepega"></img>Pepega and
        Brick Checker🧱
      </h2>
      <input
        placeholder="Character Name"
        onChange={(e) => setCharName(e.target.value)}
        style={inputStyle}
      />
      <select
        onChange={(e) => setServerName(e.target.value)}
        style={selectStyle}
      >
        <option value="">Select a Server</option>
        {realmsArray.map((realm, index) => (
          <option key={index} value={realm}>
            {realm}
          </option>
        ))}
      </select>
      <button onClick={handleButtonClick} style={buttonStyle}>
        Check em'
      </button>
    </div>
  );
};

const BrickResults = ({ onResponseData, onError }) => {
  if (onError) {
    return <p style={errorStyle}>{onError}</p>;
  }

  if (!onResponseData || !onResponseData.mythic_plus_recent_runs) {
    return null;
  }

  const runs = onResponseData.mythic_plus_recent_runs;
  const nonZeroUpgradesCount = runs.filter(
    (run) => run.num_keystone_upgrades !== 0
  ).length;

  const percentageNonZeroUpgrades = (nonZeroUpgradesCount / runs.length) * 100;

  let resultMessage;

  if (percentageNonZeroUpgrades < 40) {
    resultMessage = "Absolute Pepega, do not invite, maybe even berate them 📢";
  } else if (
    percentageNonZeroUpgrades >= 40 &&
    percentageNonZeroUpgrades <= 70
  ) {
    resultMessage = "🧱 Potential Brick ... beware 💀";
  } else if (
    percentageNonZeroUpgrades >= 70 &&
    percentageNonZeroUpgrades <= 90
  ) {
    resultMessage = "Solid player";
  } else {
    resultMessage = "Gigachad pumper 🍆";
  }

  return (
    <div style={brickResultsStyle}>
      <p style={resultStyle}>
        Percent of timed keys (last 10 runs):{" "}
        {percentageNonZeroUpgrades.toFixed()}%
      </p>
      <p style={resultMessageStyle}>Verdict: {resultMessage}</p>
    </div>
  );
};

export default App;

// Styles

const containerStyle = {
  backgroundColor: "#f5f5f5",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  maxWidth: "600px",
  margin: "auto",
  fontSize: "18px",
  fontFamily: "Arial, sans-serif",
  textAlign: "center",
};

const inputFormStyle = {
  marginTop: "20px",
};

const titleStyle = {
  color: "#8B4513", // Brick color
  fontSize: "30px",
  marginBottom: "30px",
};

const inputStyle = {
  padding: "10px",
  marginRight: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const selectStyle = {
  padding: "10px",
  marginRight: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "10px 20px",
  cursor: "pointer",
  backgroundColor: "#8B0000", // Brick red color
  color: "white",
  borderRadius: "5px",
  border: "none",
  fontWeight: "bold",
};

const errorStyle = {
  color: "red",
  marginTop: "10px",
};

const brickResultsStyle = {
  marginTop: "20px",
};

const resultStyle = {
  marginBottom: "10px",
};

const resultMessageStyle = {
  fontWeight: "bold",
  color: "#333",
};
