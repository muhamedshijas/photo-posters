import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import Cropper from "react-easy-crop";

export default function PalestineFrame() {
  const [photo, setPhoto] = useState(null);
  const [croppedPhoto, setCroppedPhoto] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const posterRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

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
    image.crossOrigin = "anonymous";
    image.src = photo;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

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
      croppedAreaPixels.height,
    );

    setCroppedPhoto(canvas.toDataURL("image/png"));
    setShowModal(false);
  };

  const handleDownload = async () => {
    if (!posterRef.current) return;

    const images = posterRef.current.querySelectorAll("img");

    await Promise.all(
      [...images].map((img) => {
        if (img.complete) return Promise.resolve();

        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }),
    );

    const canvas = await html2canvas(posterRef.current, {
      useCORS: true,
      scale: 4,
      backgroundColor: null,
      imageTimeout: 0,
      logging: false,
    });

    const link = document.createElement("a");
    link.download = "poster.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  return (
    <div style={styles.container}>
      <div ref={posterRef} style={styles.poster}>
        {croppedPhoto && (
          <img
            src={croppedPhoto}
            alt="User"
            style={styles.userPhoto}
            crossOrigin="anonymous"
          />
        )}

        <img
          src="/posters/gala.png"
          alt="Logo"
          style={styles.galaImage}
          crossOrigin="anonymous"
        />

        <div style={styles.bottomBox}>
          <img
            src="/posters/msf.png"
            alt="MSF"
            style={styles.msfImage}
            crossOrigin="anonymous"
          />
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={styles.input}
      />

      <button
        onClick={handleDownload}
        disabled={!croppedPhoto}
        style={{
          ...styles.button,
          opacity: !croppedPhoto ? 0.5 : 1,
        }}
      >
        Download Poster
      </button>

      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.cropContainer}>
              <Cropper
                image={photo}
                crop={crop}
                zoom={zoom}
                aspect={1080 / 566}
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{
                width: "100%",
                marginTop: "15px",
              }}
            />

            <button
              onClick={createCroppedImage}
              style={{
                ...styles.button,
                marginTop: "15px",
                width: "100%",
              }}
            >
              Apply Crop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    padding: "20px",
  },

  poster: {
    position: "relative",
    width: "1080px",
    height: "566px",
    overflow: "hidden",
    borderRadius: "10px",
  },

  userPhoto: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 1,
  },

  msfImage: {
    width: "350px",
    height: "auto",
    objectFit: "contain",
  },

  bottomBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "70px",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  galaImage: {
    position: "absolute",
    width: "100px",
    top: "10px",
    left: "10px",
    zIndex: 2,
    display: "block",
  },

  input: {
    padding: "10px",
  },

  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    background: "#16a34a",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },

  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modalContent: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    width: "450px",
    maxWidth: "90%",
  },

  cropContainer: {
    position: "relative",
    width: "100%",
    height: "350px",
  },
};
