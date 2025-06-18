// import React from "react";

// const PostThoughtButton = () => {
//   return (
//     <button
//       className="text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
//       onClick={() => window.open("/post-thoughts", "_blank")}
//     >
//       Post Your Thoughts 💭
//     </button>
//   );
// };

// export default PostThoughtButton;




import React from "react";
import { useNavigate } from "react-router-dom";

const PostThoughtButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
      onClick={() => navigate("/post-thoughts")}
    >
      Post Your Thoughts 💭
    </button>
  );
};

export default PostThoughtButton;