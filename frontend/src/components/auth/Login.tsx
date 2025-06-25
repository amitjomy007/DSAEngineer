import { useDispatch } from "react-redux";

const LoginComponent = () => {
  const dispatch = useDispatch();
  console.log("Dispatch function:", dispatch);
  // dispatch({ type: "yourSliceIsType/login", payload: userName });
  // console.log("dispatched");
  return (
    <>
      <h2>Login Page</h2>
    </>
  );
};

export default LoginComponent;
