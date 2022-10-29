import React from "react";
import "./SignUp.css";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../data/context";
import { useFormFields } from "../hooks/useFormFields";
import { Auth } from "aws-amplify";
import { onError } from "../utils/handleErrors";

const SignUp = () => {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });

  const nav = useNavigate();
  const [newUser, setNewUser] = React.useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const validateForm = () => {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  };

  const validateConfirmationCode = () => {
    return fields.confirmationCode.length > 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (error) {
      if (error instanceof "UsernameExistsException") {
        await Auth.resendSignUp();
      }
      onError(error);
      setIsLoading(false);
    }
  };

  const handleConfirmationCodeSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      nav("/");
    } catch (error) {
      onError(error);
      setIsLoading(false);
      fields.confirmationCode = "";
    }
  };

  const renderConfirmationForm = () => (
    <Form onSubmit={handleConfirmationCodeSubmit}>
      <Form.Group controlId="confirmationCode" size="lg">
        <Form.Label>Confrimation Code</Form.Label>
        <Form.Control
          autoFocus
          type="tel"
          onChange={handleFieldChange}
          value={fields.confirmationCode}
        />
        <Form.Text muted>
          Please check your email for confirmation instructions
        </Form.Text>
      </Form.Group>
      <LoaderButton
        style={{ marginTop: 10, width: "100%" }}
        size="lg"
        type="submit"
        disabled={!validateConfirmationCode()}
        isLoading={isLoading}
      >
        {!isLoading ? "Verify" : "Verifying"}
      </LoaderButton>
    </Form>
  );

  const renderForm = () => (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="email" size="lg">
        <Form.Label>Email</Form.Label>
        <Form.Control
          autoFocus
          type="email"
          value={fields.email}
          onChange={handleFieldChange}
        />
      </Form.Group>
      <Form.Group controlId="password" size="lg" style={{ marginTop: 10 }}>
        <Form.Label>Password</Form.Label>
        <Form.Control
          autoFocus
          type="password"
          value={fields.password}
          onChange={handleFieldChange}
        />
      </Form.Group>
      <Form.Group
        controlId="confirmPassword"
        size="lg"
        style={{ marginTop: 10 }}
      >
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          autoFocus
          type="password"
          value={fields.confirmPassword}
          onChange={handleFieldChange}
        />
      </Form.Group>
      <LoaderButton
        style={{ marginTop: 10, width: "100%" }}
        size="lg"
        type="submit"
        disabled={!validateForm()}
        isLoading={isLoading}
        variant="success"
      >
        Sign Up
      </LoaderButton>
    </Form>
  );

  return (
    <div className="SignUp">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
};

export default SignUp;
