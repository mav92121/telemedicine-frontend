import axios from "axios";

axios.defaults.withCredentials = true;

const Check = () => {
  const handleClick = () => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    };
    axios
      .get("https://telemedicine-backend.onrender.com/socket.io/", config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div>
      <button onClick={handleClick}>Click Me!</button>
    </div>
  );
};

export default Check;
