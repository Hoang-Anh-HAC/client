import axios from "axios";

export default axios.create({
  baseURL: "https://112.78.1.194:5000/api/",
});

// export default axios.create({
//   baseURL: "https://server-uz6e.onrender.com/api/",
// });
