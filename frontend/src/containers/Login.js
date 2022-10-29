import React from "react";
import "./Login.css";
import Form from "react-bootstrap/Form";
import { Auth } from "aws-amplify";
import { useAppContext } from "../data/context";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../utils/handleErrors";
import { useFormFields } from "../hooks/useFormFields";

function Login() {
  const { userHasAuthenticated } = useAppContext();
  const nav = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  const validateForm = () => {
    return fields.email.length > 0 && fields.password.length > 0;
  };

  React.useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    try {
      await Auth.currentSession();
      nav("/");
      setIsLoading(false);
    } catch (error) {
      if (error !== "No current user") alert(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      nav("/");
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group style={{ marginTop: 5 }} size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <LoaderButton
          style={{ marginTop: 10, width: "100%" }}
          size="lg"
          type="submit"
          disabled={!validateForm()}
          isLoading={isLoading}
        >
          {!isLoading ? "Login" : "Logging In"}
        </LoaderButton>
      </Form>
    </div>
  );
}

export default Login;
