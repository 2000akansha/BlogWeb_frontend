import React from "react";
import { styled } from "@mui/system";

const Loader = styled("div")`
  display: flex;
  justify-content: center;
  // align-items: center;
  margin-top: 200px;
  height: 100vh;
  .loader {
    height: 3rem;
    width: 3rem;
    border-radius: 50%;
    background-color: #954242; /* Violet color */
    animation: ping 1s infinite;
  }

  @keyframes ping {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
`;
export default Loader;