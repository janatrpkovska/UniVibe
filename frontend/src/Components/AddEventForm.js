import { useMemo, useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CATEGORY_OPTIONS = [
  { id: "tech", name: "Технологија" },
  { id: "career", name: "Кариeра" },
  { id: "research", name: "Истражување" },
  { id: "culture", name: "Култура" },
  { id: "health", name: "Здравје" },
  { id: "sport", name: "Спорт" },
  { id: "edu", name: "Едукација" },
  { id: "workshops", name: "Работилници" },
];

const EVENT_TYPE_OPTIONS = [
  { id: "party", label: "Забава / Party" },
  { id: "workshop", label: "Работилница / Workshop" },
  { id: "lecture", label: "Предавање / Lecture" },
  { id: "competition", label: "Натпревар / Tournament" },
  { id: "networking", label: "Networking / Meetup" },
  { id: "other", label: "Друго (внеси рачно)" },
];

const initialForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  faculty: "",
  categoryId: "",
  mode: "во живо",
  eventTypeId: "",
  eventTypeCustom: "",
  imageUrl: "",
};

export default function AddEventForm() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectedTypeLabel = useMemo(() => {
    const found = EVENT_TYPE_OPTIONS.find((t) => t.id === form.eventTypeId);
    return found?.label || "";
  }, [form.eventTypeId]);

  const onChange = (e) => {
    setError("");
    setSuccess("");
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "eventTypeId" && value !== "other") {
        return { ...prev, eventTypeId: value, eventTypeCustom: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const normalizeType = () => {
    if (!form.eventTypeId) return "";
    if (form.eventTypeId === "other") return (form.eventTypeCustom || "").trim();
    return selectedTypeLabel;
  };

  const validate = () => {
    if (!form.title.trim()) return "Внеси наслов.";
    if (!form.categoryId) return "Одбери категорија.";
    if (!form.eventTypeId) return "Одбери тип на настан (или Друго).";
    if (form.eventTypeId === "other" && !form.eventTypeCustom.trim())
      return "Внеси што е настанот (пример: Бруцошка забава).";
    if (!form.date) return "Одбери датум.";
    if (!form.time) return "Одбери време.";
    if (!form.location.trim()) return "Внеси локација.";
    return "";
  };

  const saveLocal = (payload) => {
    const existing = JSON.parse(localStorage.getItem("events") || "[]");
    const newEvent = {
      id: Date.now(),
      ...payload,
      icon: "✨",
      source: "local",
    };
    localStorage.setItem("events", JSON.stringify([newEvent, ...existing]));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const msg = validate();
    if (msg) return setError(msg);

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const eventType = normalizeType();

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        time: form.time,
        location: form.location.trim(),
        faculty: form.faculty.trim(),
        categoryId: form.categoryId,
        mode: form.mode,
        eventType,
        imageUrl: form.imageUrl.trim(),
        dateTime: `${form.date}T${form.time}:00`,
      };

      const API_URL = process.env.REACT_APP_API_URL
        ? `${process.env.REACT_APP_API_URL}/events`
        : null;

      if (!API_URL) {
        saveLocal(payload);
        setSuccess("Настанот е додаден (локално, додека backend не е готов).");
        setForm(initialForm);
        navigate(`/categories/${payload.categoryId}`);
        return;
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Грешка при додавање на настан.");
      }

      setSuccess("Настанот е успешно додаден!");
      setForm(initialForm);
      navigate(`/categories/${payload.categoryId}`);
    } catch (err) {
      setError(err?.message || "Нешто тргна наопаку.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: 760 }} className="py-4">
      <h2 className="mb-3">Додај настан</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Наслов</Form.Label>
          <Form.Control
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Пр. AI Работилница"
          />
        </Form.Group>

        <Row className="g-3">
          <Col md={6}>
            <Form.Group className="mb-0">
              <Form.Label>Категорија</Form.Label>
              <Form.Select
                name="categoryId"
                value={form.categoryId}
                onChange={onChange}
              >
                <option value="">Избери категорија</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-0">
              <Form.Label>Тип на настан</Form.Label>
              <Form.Select
                name="eventTypeId"
                value={form.eventTypeId}
                onChange={onChange}
              >
                <option value="">Избери тип</option>
                {EVENT_TYPE_OPTIONS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {form.eventTypeId === "other" && (
          <Form.Group className="mt-3">
            <Form.Label>Што точно е настанот?</Form.Label>
            <Form.Control
              name="eventTypeCustom"
              value={form.eventTypeCustom}
              onChange={onChange}
              placeholder="Пр. Бруцошка забава, Хуманитарен базар, Open Day..."
            />
          </Form.Group>
        )}

        <Row className="g-3 mt-1">
          <Col md={6}>
            <Form.Group className="mb-0">
              <Form.Label>Mode</Form.Label>
              <Form.Select name="mode" value={form.mode} onChange={onChange}>
                <option value="во живо">Во живо</option>
                <option value="онлајн">Онлајн</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-0">
              <Form.Label>Факултет (опционално)</Form.Label>
              <Form.Control
                name="faculty"
                value={form.faculty}
                onChange={onChange}
                placeholder="Пр. ФИНКИ"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3 mt-3">
          <Form.Label>Опис</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Краток опис..."
          />
        </Form.Group>

        <Row className="g-3">
          <Col md={6}>
            <Form.Group className="mb-0">
              <Form.Label>Датум</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={form.date}
                onChange={onChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-0">
              <Form.Label>Време</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={form.time}
                onChange={onChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3 mt-3">
          <Form.Label>Локација</Form.Label>
          <Form.Control
            name="location"
            value={form.location}
            onChange={onChange}
            placeholder="Пр. FINKI / Амфитеатар / Online"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Image URL (опционално)</Form.Label>
          <Form.Control
            name="imageUrl"
            value={form.imageUrl}
            onChange={onChange}
            placeholder="https://..."
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Се додава..." : "Додај настан"}
          </Button>

          <Button
            variant="outline-secondary"
            type="button"
            onClick={() => {
              setForm(initialForm);
              setError("");
              setSuccess("");
            }}
          >
            Reset
          </Button>
        </div>
      </Form>
    </Container>
  );
}
