import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function StudentsSection() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "550px",
        maxHeight: "600px",
        overflow: "hidden",
        backgroundImage: "url(/students.png)",
        backgroundSize: "cover",
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "0",
          transform: "translateY(-50%)",
          maxWidth: "500px",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "32px" }}>Досадата е забранета!</h1>
        <div style={{ fontSize: "24px", marginBottom: "32px", textAlign: "center" }}>⚡</div>
        <p style={{ fontSize: "16px", fontWeight: "500" }}>
          Пребарувај и откриј активности што ќе го раздвижат твојот студентски живот – работилници, спортски настани,
          забави и уште многу други изненадувања.
        </p>
      </div>
    </div>
  );
}

function HighlightSection() {
  return (
    <div
      style={{
        width: "100%",
        padding: "64px 0px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "1200px", textAlign: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Студентскиот живот никогаш не бил полесен за откривање ⭐</h2>
        <hr
          style={{
            border: "1px solid black",
            margin: "64px -30% 0 -30%",
            width: "160%",
          }}
        />
      </div>
    </div>
  );
}

function FilterSection({
  keyword,
  setKeyword,
  category,
  setCategory,
  faculty,
  setFaculty,
  date,
  setDate,
  selectedLocation,
  setSelectedLocation,
  categories,
  faculties,
  locations,
  onSearch,
}) {
  return (
    <div
      id="filters"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginBottom: "32px",
        paddingTop: "32px",
      }}
    >
      <div
        style={{
          width: "900px",
          backgroundColor: "#A8E8F9",
          padding: "32px",
          borderRadius: "12px",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "bold",
            marginBottom: "32px",
          }}
        >
          Најди настан според:
        </h3>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>Клучен збор</label>
          <input
            type="text"
            placeholder="Пр. наука"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "24px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "24px",
            rowGap: "24px",
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "8px" }}>Категорија</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Сите категории</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px" }}>Факултет</label>
            <select
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Сите факултети</option>
              {faculties.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px" }}>Локација</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Сите локации</option>
              {locations.map((loc, index) => (
                <option key={index} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px" }}>Датум</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        <div onClick={onSearch} style={{ textAlign: "center", marginTop: "32px" }}>
          <button
            style={{
              padding: "12px 40px",
              backgroundColor: "#013C58",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Пребарај
          </button>
        </div>
      </div>
    </div>
  );
}

function EventsGrid({ events, totalResults }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        margin: "50px 0px",
      }}
    >
      <div style={{ width: "900px" }}>
        <p style={{ fontSize: "18px", marginBottom: "16px" }}>
          Вкупно резултати од пребарувањето: <b>{totalResults}</b>
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                backgroundColor: "#E0FFFF",
                padding: "16px",
                borderRadius: "12px",
                boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "170px",
                  backgroundColor: "#ddd",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  backgroundImage: `url(${event.image_url || "/placeholder.png"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>

              <h4 style={{ fontWeight: "bold", marginBottom: "8px" }}>{event.title}</h4>

              <p style={{ fontSize: "14px", marginBottom: "4px" }}>
                <b>Датум:</b> {new Date(event.startDate).toLocaleDateString("mk-MK")}
                {event.endDate && <> - {new Date(event.endDate).toLocaleDateString("mk-MK")}</>}
              </p>

              <p style={{ fontSize: "14px", marginBottom: "12px" }}>
                <b>Локација:</b> {event.location}
              </p>

              <Link to={`/event/${event.id}`}>
                <button
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#FFB701",
                    color: "black",
                    border: "none",
                    borderRadius: "8px",
                    marginTop: "10px",
                  }}
                >
                  Детали
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pagination({ page, setPage, totalPages, size, totalResults }) {
  return (
    <div
      style={{
        width: "100%",
        paddingBottom: "30px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "900px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={paginationBtn} disabled={page === 0} onClick={() => setPage(0)}>
            First
          </button>

          <button style={paginationBtn} disabled={page === 0} onClick={() => setPage(page - 1)}>
            Previous
          </button>

          <span
            style={{
              ...paginationBtn,
              backgroundColor: "#013C58",
              color: "white",
              borderColor: "#013C58",
            }}
          >
            {page + 1} / {totalPages}
          </span>

          <button style={paginationBtn} disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>

          <button style={paginationBtn} disabled={page + 1 >= totalPages} onClick={() => setPage(totalPages - 1)}>
            Last
          </button>
        </div>

        <div style={{ fontSize: "14px", color: "#333" }}>
          Резултати по страна: <b>{size}</b> | Вкупно: <b>{totalResults}</b>
        </div>
      </div>
    </div>
  );
}

const paginationBtn = {
  padding: "8px 16px",
  backgroundColor: "white",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

export default function SearchPage() {
  const location = useLocation();

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [faculty, setFaculty] = useState("");
  const [date, setDate] = useState("");
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("categoryId");
    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    }
  }, [location.search]);

  const fetchEvents = async () => {
    const hasFilters =
      keyword.trim() !== "" || category !== "" || faculty !== "" || date !== "" || selectedLocation !== "";

    if (!hasFilters) {
      setEvents([]);
      setTotalPages(0);
      setTotalResults(0);
      return;
    }

    let url = `http://localhost:9091/api/event/public/filtered-events?keyword=${keyword}&page=${page}&size=${size}`;
    if (category) url += `&categoryId=${category}`;
    if (faculty) url += `&facultyId=${faculty}`;
    if (date) url += `&date=${date}`;
    if (selectedLocation) url += `&location=${selectedLocation}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error fetching events");
      }
      const data = await response.json();

      setEvents(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalResults(data.totalElements || 0);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setEvents([]);
      setTotalPages(0);
      setTotalResults(0);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:9091/api/category/public/get-all");
        if (!res.ok) {
          console.error("Categories error:", res.status);
          setCategories([]);
          return;
        }
        const data = await res.json();
        setCategories(data);
      } catch (e) {
        console.error("Categories fetch failed", e);
        setCategories([]);
      }
    };

    const fetchFaculties = async () => {
      try {
        const res = await fetch("http://localhost:9091/api/faculty/public/get-all");
        if (!res.ok) {
          console.error("Faculties error:", res.status);
          setFaculties([]);
          return;
        }
        const data = await res.json();
        setFaculties(data);
      } catch (e) {
        console.error("Faculties fetch failed", e);
        setFaculties([]);
      }
    };

    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:9091/api/event/public/locations");
        if (!res.ok) {
          console.error("Locations error:", res.status);
          setLocations([]);
          return;
        }
        const data = await res.json();
        setLocations(data);
      } catch (e) {
        console.error("Locations fetch failed", e);
        setLocations([]);
      }
    };

    fetchLocations();
    fetchCategories();
    fetchFaculties();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [keyword, category, faculty, date, selectedLocation]);

  useEffect(() => {
    fetchEvents();
  }, [page, keyword, category, faculty, date, selectedLocation]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <StudentsSection />
      <HighlightSection />

      <FilterSection
        keyword={keyword}
        setKeyword={setKeyword}
        category={category}
        setCategory={setCategory}
        faculty={faculty}
        setFaculty={setFaculty}
        date={date}
        setDate={setDate}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        categories={categories}
        faculties={faculties}
        locations={locations}
        onSearch={() => {
          setPage(0);
          fetchEvents();
        }}
      />

      <EventsGrid events={events} totalResults={totalResults} />

      <Pagination page={page} setPage={setPage} totalPages={totalPages} size={size} totalResults={totalResults} />
    </div>
  );
}
