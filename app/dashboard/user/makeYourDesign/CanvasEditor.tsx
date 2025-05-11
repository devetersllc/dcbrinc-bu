import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#f0f0f0",
    });
    setCanvas(canvas);

    return () => canvas.dispose(); // Cleanup
  }, []);

  // Add text
  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Text("Double-click to edit", {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: "#000",
    });
    canvas.add(text);
    canvas.renderAll();
  };

  // Add image
  const addImage = (e) => {
    if (!canvas) return;
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        img.scaleToWidth(200); // Resize image
        canvas.add(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  // Delete selected object
  const deleteSelected = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
    }
  };

  // Export as PNG
  const exportToPNG = () => {
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "design.png";
    link.href = canvas.toDataURL({ format: "png" });
    link.click();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Canva-like Editor (Fabric.js)</h2>

      {/* Toolbar */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={addText}>Add Text</button>
        <input type="file" accept="image/*" onChange={addImage} />
        <button onClick={deleteSelected}>Delete Selected</button>
        <button onClick={exportToPNG}>Export PNG</button>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} style={{ border: "1px solid #000" }} />
    </div>
  );
};

export default CanvasEditor;
