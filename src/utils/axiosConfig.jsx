import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/api/",
});

// export default axios.create({
//   baseURL: "https://server-uz6e.onrender.com/api/",
// });
