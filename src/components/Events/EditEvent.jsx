import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import { fetchEvent, updateEvent } from "../../utils/http.js";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["events", id],
    queryFn: () => {
      return fetchEvent({ id });
    },
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
  });

  function handleSubmit(formData) {
    mutate({ id, formData });
  }

  function handleClose() {
    navigate("../");
  }

  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading event data...</p>}
      {data && (
        <EventForm inputData={data} onSubmit={handleSubmit}>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Update
          </button>
        </EventForm>
      )}
      {isError && <ErrorBlock title="An Error Occured" message={error.info?.message} />}
    </Modal>
  );
}
