import React from "react";
import { usePins } from "../context/PinContext";
import { PinCard } from "./PinCard";
import { ArrowLeft, Bookmark, Plus } from "lucide-react";

export const BoardView = () => {
  const {
    selectedBoardId,
    boards,
    pins,
    setActiveView,
    setIsUploadOpen
  } = usePins();

  const board = boards.find((b) => b.id === selectedBoardId);

  if (!board) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h3>Board not found</h3>
        <button
          className="nav-tab"
          onClick={() => setActiveView("gallery")}
          style={{ marginTop: "12px" }}
        >
          Return to Home
        </button>
      </div>
    );
  }

  const boardPins = pins.filter((pin) => (board.pinIds || []).includes(pin.id));

  return (
    <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "16px 24px" }}>
      {/* Board Header Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--border-light)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            className="icon-btn"
            onClick={() => setActiveView("gallery")}
            title="Back to Home Feed"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-display)",
                fontSize: "1.8rem",
                fontWeight: 800
              }}
            >
              <Bookmark size={24} color="var(--color-primary)" />
              <span>{board.name}</span>
            </div>
            {board.description && (
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                {board.description}
              </p>
            )}
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
              {boardPins.length} pins in this collection
            </div>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={() => setIsUploadOpen(true)}
        >
          <Plus size={18} />
          <span>Add Pin to Board</span>
        </button>
      </div>

      {/* Pins in Board */}
      {boardPins.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--text-secondary)"
          }}
        >
          <Bookmark size={48} style={{ opacity: 0.4, marginBottom: "16px" }} />
          <h3>This board is empty</h3>
          <p style={{ fontSize: "0.9rem", marginTop: "6px" }}>
            Explore pins and save them here, or upload new inspirations!
          </p>
          <button
            className="nav-tab active"
            onClick={() => setActiveView("gallery")}
            style={{ marginTop: "16px" }}
          >
            Explore Pins
          </button>
        </div>
      ) : (
        <div className="masonry-columns">
          {boardPins.map((pin) => (
            <PinCard key={pin.id} pin={pin} />
          ))}
        </div>
      )}
    </div>
  );
};
