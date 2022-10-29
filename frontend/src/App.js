import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { AppContext } from "./data/context";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { onError } from "./utils/handleErrors";

function App() {
  const nav = useNavigate();
  const [isAuthenticated, userHasAuthenticated] = React.useState(false);
  const [isAuthenticating, setIsAuthenticating] = React.useState(true);

  React.useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (error) {
      if (error !== "No current user") alert(error.message);
    }

    setIsAuthenticating(false);
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      nav("/login");
    } catch (error) {
      onError(error);
    }
    userHasAuthenticated(false);
  };

  return (
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
          <Navbar.Brand className="font-weight-bold text-muted ms-3">
            Scratch
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end pe-3">
            <Nav activeKey={window.location.pathname}>
              {!isAuthenticated ? (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link href="/signup">Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link href="/login">Login</Nav.Link>
                  </LinkContainer>
                </>
              ) : (
                <>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;
