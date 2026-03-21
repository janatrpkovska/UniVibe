import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../util/AuthProvider";

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

const getCategoryName = (categoryId) => {
  const category = CATEGORY_OPTIONS.find(c => c.id === categoryId);
  return category ? category.name : "";
};

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
  endDate: "",
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
  const { token, user, isAuthenticated } = useAuth();
  const [faculties, setFaculties] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const isAdmin = user && user.role === "ROLE_ADMIN";

  const apiEventBase = process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api/event`
    : "http://localhost:9091/api/event";

  const revokeLocalPreview = useCallback(() => {
    setLocalPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  useEffect(() => () => revokeLocalPreview(), [revokeLocalPreview]);

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Мора да бидете најавени за да додадете настан.");
    } else if (!isAdmin) {
      setError("Само администратори можат да додаваат настани.");
    }
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await fetch("http://localhost:9091/api/faculty/public/get-all");
        if (!res.ok) {
          setFaculties([]);
          return;
        }
        const data = await res.json();
        setFaculties(data);
      } catch (e) {
        setFaculties([]);
      }
    };

    fetchFaculties();
  }, []);

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

  const ACCEPT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  const uploadImageFile = async (file) => {
    if (!file || !ACCEPT_IMAGE_TYPES.includes(file.type)) {
      setError("Дозволени се само JPEG, PNG, WebP и GIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Сликата мора да биде најмногу 5MB.");
      return;
    }

    setError("");
    setSuccess("");
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${apiEventBase}/upload-image`, {
        method: "POST",
        headers,
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || "Грешка при upload на слика.");
      }
      revokeLocalPreview();
      setForm((prev) => ({ ...prev, imageUrl: data.imageUrl || "" }));
    } catch (err) {
      setError(err?.message || "Грешка при upload на слика.");
      revokeLocalPreview();
    } finally {
      setUploadingImage(false);
    }
  };

  const onFileChosen = (files) => {
    const file = files?.[0];
    if (!file) return;
    revokeLocalPreview();
    const url = URL.createObjectURL(file);
    setLocalPreviewUrl(url);
    uploadImageFile(file);
  };

  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) onFileChosen(e.dataTransfer.files);
  };

  const clearEventImage = () => {
    revokeLocalPreview();
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    if (form.endDate && form.endDate < form.date) return "Крајниот датум не може да биде пред почетниот.";
    if (!form.time) return "Одбери време.";
    if (!form.location.trim()) return "Внеси локација.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !isAdmin) {
      setError("Само администратори можат да додаваат настани.");
      return;
    }

    const msg = validate();
    if (msg) return setError(msg);

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const eventType = normalizeType();
      const categoryName = getCategoryName(form.categoryId);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        endDate: form.endDate.trim() || null,
        time: form.time,
        location: form.location.trim(),
        facultyName: form.faculty.trim() || null,
        categoryName: categoryName,
        eventTypeName: eventType,
        imageUrl: form.imageUrl.trim() || null,
        mode: form.mode,
      };

      const API_URL = process.env.REACT_APP_API_URL
        ? `${process.env.REACT_APP_API_URL}/api/event/events`
        : "http://localhost:9091/api/event/events";

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        if (res.status === 403) {
          throw new Error("Немате дозвола за да додадете настан. Само администратори можат да додаваат настани.");
        }
        throw new Error(text || "Грешка при додавање на настан.");
      }

      setSuccess("Настанот е успешно додаден!");
      setForm(initialForm);
      navigate(`/categories/${form.categoryId}`);
    } catch (err) {
      setError(err?.message || "Нешто тргна наопаку.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container style={{ maxWidth: 760 }} className="py-4">
        <Alert variant="warning">
          Мора да бидете најавени за да додадете настан. <a href="/login">Најавете се</a>
        </Alert>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container style={{ maxWidth: 760 }} className="py-4">
        <Alert variant="danger">
          Само администратори можат да додаваат настани.
        </Alert>
      </Container>
    );
  }

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
              <Form.Select
                  name="faculty"
                  value={form.faculty}
                  onChange={onChange}
              >
                <option value="">Сите факултети</option>
                {faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.name}>
                      {faculty.name}
                    </option>
                ))}
              </Form.Select>
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
              <Form.Label>Почетен датум</Form.Label>
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
              <Form.Label>Краен датум (опционално)</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={onChange}
                min={form.date || undefined}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="g-3 mt-1">
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
          <Form.Label>Слика на настан (опционално)</Form.Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="d-none"
            onChange={(e) => onFileChosen(e.target.files)}
          />
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
            onDragEnter={onDrag}
            onDragLeave={onDrag}
            onDragOver={onDrag}
            onDrop={onDrop}
            onClick={() => !uploadingImage && fileInputRef.current?.click()}
            className="rounded border border-2 border-dashed d-flex flex-column align-items-center justify-content-center text-center px-3 py-4"
            style={{
              minHeight: 160,
              cursor: uploadingImage ? "wait" : "pointer",
              backgroundColor: dragActive ? "rgba(13, 110, 253, 0.08)" : "#f8f9fa",
              borderColor: dragActive ? "#0d6efd" : "#dee2e6",
            }}
          >
            {uploadingImage ? (
              <span>Се качува слика...</span>
            ) : (
              <>
                <span className="text-secondary mb-1">
                  Повлечи слика овде или кликни за да одбереш од уредот
                </span>
                <small className="text-muted">JPEG, PNG, WebP или GIF · најмногу 5MB</small>
              </>
            )}
          </div>
          {(localPreviewUrl || form.imageUrl) && (
            <div className="mt-3 position-relative d-inline-block">
              <div className="position-relative">
                <img
                  src={localPreviewUrl || form.imageUrl}
                  alt="Преглед"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    borderRadius: 8,
                    objectFit: "contain",
                    opacity: uploadingImage ? 0.5 : 1,
                  }}
                />
                {uploadingImage && (
                  <div
                    className="position-absolute top-50 start-50 translate-middle small fw-semibold text-white px-2 py-1 rounded"
                    style={{ background: "rgba(0,0,0,0.55)" }}
                  >
                    Се качува...
                  </div>
                )}
              </div>
              {!uploadingImage && (
                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
                  className="mt-2"
                  onClick={clearEventImage}
                >
                  Отстрани слика
                </Button>
              )}
            </div>
          )}
          <Form.Label className="small text-muted mt-3 mb-1">Или внеси URL (опционално)</Form.Label>
          <Form.Control
            name="imageUrl"
            value={form.imageUrl}
            onChange={onChange}
            placeholder="https://..."
            disabled={uploadingImage}
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
              revokeLocalPreview();
              setForm(initialForm);
              setError("");
              setSuccess("");
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            Reset
          </Button>
        </div>
      </Form>
    </Container>
  );
}
