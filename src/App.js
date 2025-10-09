import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import Cropper from "react-easy-crop";

export default function PalestineFrame() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [croppedPhoto, setCroppedPhoto] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // crop controls
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const posterRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      setShowModal(true);
    }
  };

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const createCroppedImage = async () => {
    if (!photo || !croppedAreaPixels) return;

    const image = new Image();
    image.src = photo;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    setCroppedPhoto(canvas.toDataURL("image/png"));
    setShowModal(false);
  };

  const handleDownload = async () => {
    if (!posterRef.current) return;

    const canvas = await html2canvas(posterRef.current, {
      useCORS: true,
      scale: 3, // sharper output
      backgroundColor: null,
    });

    const link = document.createElement("a");
    link.download = `${name || "poster"}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  // CSS styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
  };
  const posterStyle = {
    position: "relative",
    width: "400px",
    height: "400px",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  };
  const bgImageStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    top: 0,
    left: 0,
    zIndex: 0,
  };
  const uploadedPhotoStyle = {
    position: "absolute",
    width: "100px",
    height: "100px",
    top: "180px",
    left: "150px",
    objectFit: "cover",
    borderRadius: "6px",
    zIndex: 1,
  };
  const posterNameStyle = {
    position: "absolute",
    bottom: "85px",
    left: "50%",
    transform: "translateX(-50%)",
    color: "white",
    fontWeight: "bold",
    fontSize: "15px",
    zIndex: 2,
  };
  const inputStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    borderRadius: "4px",
  };
  const buttonStyle = {
    marginTop: "8px",
    padding: "8px 16px",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };
  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  };
  const modalContentStyle = {
    position: "relative",
    width: "80%",
    maxWidth: "400px",
    height: "400px",
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "8px",
  };
  const cropperContainerStyle = {
    position: "relative",
    width: "100%",
    height: "300px",
    background: "#333",
  };
  const zoomSliderStyle = { width: "100%", marginTop: "8px" };

  return (
    <div style={containerStyle}>
      <div ref={posterRef} style={posterStyle}>
        {/* ✅ Use <img> for high-quality background */}
        <img
          src="/posterbg.jpg"
          alt="Background"
          style={bgImageStyle}
          crossOrigin="anonymous"
        />

        {croppedPhoto && (
          <img src={croppedPhoto} alt="Uploaded" style={uploadedPhotoStyle} />
        )}

        <h2 style={posterNameStyle}>{name.toUpperCase()}</h2>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ ...inputStyle, marginTop: "8px" }}
      />

      <button
        onClick={handleDownload}
        style={buttonStyle}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#15803d")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#16a34a")}
      >
        Download Poster
      </button>

      {showModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <div style={cropperContainerStyle}>
              <Cropper
                image={photo}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            {/* Zoom slider */}
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={zoomSliderStyle}
            />
            <button
              onClick={createCroppedImage}
              style={{ ...buttonStyle, marginTop: "16px", width: "100%" }}
            >
              Apply Crop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
