import { useEffect, useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../util/AuthProvider";

export default function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const API = "http://localhost:9091/api/event";

    const [form, setForm] = useState({
        title: "",
        description: "",
        date: "",
        endDate: "",
        time: "",
        location: "",
        imageUrl: "",
        imageFile: null,
    });
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        fetch(`${API}/public/get-event/${id}`)
            .then((res) => res.json())
            .then((event) => {
                const start = new Date(event.startDate);
                setForm({
                    title: event.title || "",
                    description: event.description || "",
                    date: start.toISOString().split("T")[0],
                    time: start.toTimeString().slice(0, 5),
                    endDate: event.endDate
                        ? new Date(event.endDate).toISOString().split("T")[0]
                        : "",
                    location: event.location || "",
                    imageUrl: event.image_url || "",
                });
            })
            .catch(() => setMsg("Грешка при вчитување"))
            .finally(() => setLoading(false));
    }, [id]);

    const onChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = form.imageUrl;

        try {
            if (form.imageFile) {
                const data = new FormData();
                data.append("file", form.imageFile);

                const uploadRes = await fetch(`${API}/upload-image`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: data,
                });

                const uploadData = await uploadRes.json();
                imageUrl = uploadData.imageUrl;
            }
            const startDate = `${form.date}T${form.time}:00`;

            const payload = {
                title: form.title,
                description: form.description,
                startDate: startDate,
                endDate: form.endDate ? form.endDate : null,
                location: form.location,
                image_url: imageUrl,
                mode: "LIVE",
                status: "SCHEDULED",
                source: "MANUAL",
                category: null,
                eventType: null,
                faculty: null
            };

            await fetch(`${API}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            navigate(`/event/${id}`);
        } catch {
            setMsg("Грешка при зачувување");
        }
    };

    if (loading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <Container style={{ maxWidth: 700 }} className="py-4">
            <h2 className="mb-3">Измени настан</h2>
            {msg && <Alert variant="info">{msg}</Alert>}

            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Наслов</Form.Label>
                    <Form.Control name="title" value={form.title} onChange={onChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Опис</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={form.description}
                        onChange={onChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Датум</Form.Label>
                    <Form.Control
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={onChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Краен датум (опционално)</Form.Label>
                    <Form.Control
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={onChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Време</Form.Label>
                    <Form.Control
                        type="time"
                        name="time"
                        value={form.time}
                        onChange={onChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Локација</Form.Label>
                    <Form.Control
                        name="location"
                        value={form.location}
                        onChange={onChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Слика</Form.Label>

                    {form.imageFile ? (
                        <img
                            src={URL.createObjectURL(form.imageFile)}
                            alt="preview"
                            style={{ width: "100%", marginBottom: "10px" }}
                        />
                    ) : form.imageUrl ? (
                        <img
                            src={form.imageUrl}
                            alt="preview"
                            style={{ width: "100%", marginBottom: "10px" }}
                        />
                    ) : null}

                    <Form.Control
                        type="file"
                        onChange={(e) =>
                            setForm({ ...form, imageFile: e.target.files[0] })
                        }
                    />
                </Form.Group>

                <Button type="submit">Зачувај</Button>
            </Form>
        </Container>
    );
}