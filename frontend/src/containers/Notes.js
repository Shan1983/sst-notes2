import { API, Storage } from "aws-amplify";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../config";
import { onError } from "../utils/handleErrors";
import "./Notes.css";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { s3Upload } from "../utils/aws";

const Notes = () => {
  const file = React.useRef(null);
  const { id } = useParams();
  const nav = useNavigate();
  const [note, setNote] = React.useState(null);
  const [content, setContent] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const loadNote = () => {
      return API.get("notes", `/notes/${id}`);
    };

    const onLoad = async () => {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment)
          note.attachmentURL = await Storage.vault.get(attachment);

        setContent(content);
        setNote(note);
      } catch (error) {
        onError(error);
      }
    };

    onLoad();
  }, [id]);

  const validateForm = () => {
    return content.length > 0;
  };

  const formatFilename = (str) => {
    return str.replace(/^\W+-/, "");
  };

  const handleFileChange = (event) => {
    file.current = event.target.files[0];
  };

  const saveNote = (note) => {
    return API.put("notes", `/notes/${id}`, {
      body: note,
    });
  };

  const handleSubmit = async (event) => {
    let attachment;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000}MB`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) attachment = await s3Upload(file.current);

      await saveNote({
        content,
        attachment: attachment || note.attachment,
      });
      nav("/");
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  const deleteNote = () => {
    return API.del("notes", `/notes/${id}`);
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm("Are you absolutely sure?");

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deleteNote();
      nav("/");
    } catch (error) {
      onError(error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="Notes">
      {note && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              as="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="file" style={{ marginTop: 10 }}>
            <Form.Label>Attachment</Form.Label>
            {note.attachment && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note.attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </p>
            )}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            style={{ width: "100%" }}
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            style={{ width: "100%" }}
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
};

export default Notes;
