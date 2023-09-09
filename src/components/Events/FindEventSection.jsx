import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

import LoadingIndicator from "../UI/LoadingIndicator";
import EventItem from "./EventItem";
import ErrorBlock from "../UI/ErrorBlock";
import { fetchEvents } from "../../utils/http";

export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState();

  const { data, isError, error, isInitialLoading } = useQuery({
    queryKey: ["events", { search: searchTerm }],
    // Вона приймає обʼєкт з signal завжди. Навіть якшо ми викликаємо свою функцію без аргументів.
    // Отже signal завжди передається в бʼєкті і тому всі параметри які ми хочемо передати у нашу функцію мусять бути поруч в цьому обʼєкті
    queryFn: ({ signal }) => fetchEvents({ signal, searchTerm }),
    // Контролюмо коли запит включений
    enabled: searchTerm !== undefined,
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input type="search" placeholder="Search events" ref={searchElement} />
          <button>Search</button>
        </form>
      </header>
      {isInitialLoading && <LoadingIndicator />}
      {isError && (
        <ErrorBlock
          title="An error occured!"
          message={error.info?.message || "Faile to fetch events!"}
        />
      )}
      {!data && <p>Please enter a search term to find events.</p>}
      {data && (
        <ul className="events-list">
          {data.map((event) => (
            <li key={event.id}>
              <EventItem event={event} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
