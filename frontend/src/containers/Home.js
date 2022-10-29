import React from "react";
import { useAppContext } from "../data/context";
import "./Home.css";
import ListGroup from "react-bootstrap/ListGroup";
import { onError } from "../utils/handleErrors";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import { BsPencilSquare } from "react-icons/bs";

const Home = () => {
  const [notes, setNotes] = React.useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const onLoad = async () => {
      if (!isAuthenticated) return;

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (error) {
        onError(error);
      }

      setIsLoading(false);
    };

    onLoad();
  }, [isAuthenticated]);

  const loadNotes = () => {
    return API.get("notes", "/notes");
  };

  const renderNotesList = (notes) => (
    <>
      <LinkContainer to="/notes/new">
        <ListGroup.Item action className="py-3 text-nowrap text-truncate">
          <BsPencilSquare size={17} />
          <span className="ml-2 font-weight-bold"> Create a new note</span>
        </ListGroup.Item>
      </LinkContainer>
      {notes.map(({ noteId, content, createdAt }) => (
        <LinkContainer key={noteId} to={`/notes/${noteId}`}>
          <ListGroup.Item action>
            <span className="font-weight-bold">
              {content.trim().split("\n")[0]}
            </span>
            <br />
            <span className="text-muted">
              Created: {new Date(createdAt).toLocaleString()}
            </span>
          </ListGroup.Item>
        </LinkContainer>
      ))}
    </>
  );

  const renderLander = () => (
    <div className="lander">
      <h1>Scratch</h1>
      <p className="text-muted">A simple note taking app</p>
    </div>
  );

  const renderNotes = () => (
    <div className="notes">
      <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
      <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
    </div>
  );

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
};

export default Home;
