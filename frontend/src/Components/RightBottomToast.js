import Toast from "react-bootstrap/Toast";

export default function RightBottomToast({
  show,
  message,
  onClose,
  delay = 4000,
  variant = "success",
}) {
  const isError = variant === "error";

  return (
    <div
      style={{
        position: "fixed",
        right: 22,
        bottom: 140,
        zIndex: 10000,
        maxWidth: "min(400px, calc(100vw - 44px))",
        width: "max-content",
      }}
    >
      <Toast
        show={show}
        onClose={onClose}
        delay={delay}
        autohide
        className="border shadow-sm"
        style={{
          backgroundColor: "#ffffff",
          color: "#000000",
          width: "max-content",
          maxWidth: "min(400px, calc(100vw - 44px))",
          borderLeft: isError ? "4px solid #dc2626" : undefined,
        }}
      >
        <Toast.Body
          className="text-dark py-3 px-3"
          style={{ backgroundColor: "#ffffff", color: "#000000" }}
        >
          <span style={{ lineHeight: 1.4 }}>{message}</span>
        </Toast.Body>
      </Toast>
    </div>
  );
}
