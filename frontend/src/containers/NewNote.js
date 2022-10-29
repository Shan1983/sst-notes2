import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import "./NewNote.css";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import { onError } from "../utils/handleErrors";
import { API } from "aws-amplify";
import { s3Upload } from "../utils/aws";

const NewNote = () => {
  const file = React.useRef(null);
  const nav = useNavigate();
  const [content, setContent] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const validateForm = () => {
    return content.length > 0;
  };

  const handleFileChange = (event) => {
    file.current = event.target.files[0];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000}MB`
      );
      return;
    }

    setIsLoading(true);

    try {
      const attachment = file.current ? await s3Upload(file.current) : null;
      await createNote({ content, attachment });
      nav("/");
    } catch (error) {
      console.log(error.message);
      onError(error);
      setIsLoading(false);
    }
  };

  const createNote = (note) => {
    return API.post("notes", "/notes", {
      body: note,
    });
  };

  return (
    <div className="NewNote">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control
            value={content}
            as="textarea"
            onChange={(event) => setContent(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file" style={{ marginTop: 10 }}>
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoaderButton
          style={{ marginTop: 10, width: "100%" }}
          size="lg"
          type="submit"
          disabled={!validateForm()}
          isLoading={isLoading}
          variant="primary"
        >
          Create
        </LoaderButton>
      </Form>
    </div>
  );
};

export default NewNote;
