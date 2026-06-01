import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import Cropper from "react-easy-crop";

export default function PalestineFrame() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [croppedPhoto, setCroppedPhoto] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fatherName, setFatherName] = useState("");
  const [gender, setGender] = useState("male");
  const [certificateType, setCertificateType] = useState("sslc");

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

    const canvas = await html2canvas(posterRef.current, {
      useCORS: true,
      scale: 4,
      backgroundColor: null,
    });

    const link = document.createElement("a");
    link.download = `${name || "poster"}.png`;
    link.href = canvas.toDataURL("image/png", 1);
    link.click();
  };

  return (
    <div style={styles.container}>
      <select
        value={certificateType}
        onChange={(e) => setCertificateType(e.target.value)}
        style={styles.input}
      >
        <option value="">Choose Certificate</option>

        <option value="sslc">SSLC 10 A+</option>
        <option value="sslcnine">SSLC 9 A+ </option>
        <option value="cbse">CBSE </option>
        <option value="lss">LSS</option>
        <option value="lss">LSS</option>
        <option value="lss">LSS</option>
      </select>
      <div ref={posterRef} style={styles.poster}>
        {/* Background Frame */}
        <img
          src="/posters/bg.jpg"
          alt="Poster Background"
          style={styles.background}
          crossOrigin="anonymous"
        />

        {/* User Photo */}
        {croppedPhoto && (
          <img src={croppedPhoto} alt="User" style={styles.userPhoto} />
        )}

        <img src="/posters/gala.png" alt="Overlay" style={styles.galaImage} />
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={styles.input}
      />
      <button
        onClick={handleDownload}
        disabled={!name || !croppedPhoto}
        style={{
          ...styles.button,
          opacity: !name || !croppedPhoto ? 0.6 : 1,
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
                aspect={1080 / 530}
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
              style={{ width: "100%" }}
            />

            <button onClick={createCroppedImage} style={styles.button}>
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
    width: "1030px",
    height: "560px",
    overflow: "hidden",
  },

  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    top: 0,
    left: 0,
  },

  userPhoto: {
    position: "absolute",

    width: "1080px",
    height: "530px",
    borderRadius: "0px 0px 9px 9px ",
    objectFit: "cover",
    zIndex: 2,
  },

  galaImage: {
    position: "absolute",
    width:"100px",
    height:"100px", 
    top: "10px",
    left: "20px",
  
    objectFit: "contain", // or "contain"
    zIndex: 3,
  },

  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    background: "#16a34a",
    color: "#fff",
    cursor: "pointer",
  },

  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modalContent: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
  },

  cropContainer: {
    position: "relative",
    width: "100%",
    height: "300px",
  },
};
