document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const fileInput = document.getElementById("fileInput");
  const resultDiv = document.getElementById("result");
  const fileUrlInput = document.getElementById("fileUrl");
  const copyButton = document.getElementById("copyButton");
  const dropZone = document.getElementById("dropZone");
  const uploadButton = document.getElementById("uploadButton");
  const fileNameDisplay = document.createElement("p");

  fileNameDisplay.className = "file-name";
  fileNameDisplay.textContent = "No file selected.";
  dropZone.appendChild(fileNameDisplay);

  // Update the file name when a file is selected
  const updateFileName = (file) => {
    if (file) {
      fileNameDisplay.textContent = `Selected file: ${file.name}`;
      fileNameDisplay.style.color = "#333";
      resultDiv.classList.add("hidden"); // Hide the result section initially
    } else {
      fileNameDisplay.textContent = "No file selected.";
      fileNameDisplay.style.color = "#777";
    }
  };

  // Handle Drag-and-Drop
  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault(); // Prevent the default behavior (e.g., opening the file)
    dropZone.classList.add("dragover"); // Add a dragover class to show visual feedback
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover"); // Remove the dragover class when dragging leaves
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragover"); // Remove the dragover class when a file is dropped

    const files = event.dataTransfer.files; // Get the dropped files

    if (files.length > 0) {
      fileInput.files = files; // Update the file input with the dropped file
      updateFileName(files[0]); // Update the displayed file name
    }
  });

  // Handle file input change
  fileInput.addEventListener("change", () => {
    updateFileName(fileInput.files[0]);
  });

  // Handle file upload
  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    uploadButton.disabled = true;
    uploadButton.textContent = "Uploading...";

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        fileUrlInput.value = result.url;
        resultDiv.classList.remove("hidden"); // Show the result section with the file URL
        uploadButton.textContent = "Upload";
        alert(`File "${file.name}" uploaded successfully!`);
      } else {
        alert(result.message || "Upload failed!");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      uploadButton.disabled = false;
    }
  });

  // Copy link to clipboard
  copyButton.addEventListener("click", () => {
    fileUrlInput.select();
    document.execCommand("copy"); // For browsers that do not support navigator.clipboard.writeText
    alert("Link copied to clipboard!");
  });
});
