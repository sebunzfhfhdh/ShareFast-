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
  
    // Function to update the displayed file name and manage form visibility
    const updateFileName = (file) => {
      if (file) {
        fileNameDisplay.textContent = `Selected file: ${file.name}`;
        fileNameDisplay.style.color = "#333";
        // Keep upload section visible
        resultDiv.classList.add("hidden"); // Hide the result section initially
      } else {
        fileNameDisplay.textContent = "No file selected.";
        fileNameDisplay.style.color = "#777";
      }
    };
  
    // Drag-and-Drop Functionality
    dropZone.addEventListener("dragover", (event) => {
      event.preventDefault();
      dropZone.classList.add("dragover");
    });
  
    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("dragover");
    });
  
    dropZone.addEventListener("drop", (event) => {
      event.preventDefault();
      dropZone.classList.remove("dragover");
  
      const files = event.dataTransfer.files;
  
      if (files.length > 0) {
        fileInput.files = files;
        updateFileName(files[0]);
      }
    });
  
    // Display file name when selected via file input
    fileInput.addEventListener("change", () => {
      updateFileName(fileInput.files[0]);
    });
  
    // File Upload
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
          resultDiv.classList.remove("hidden");
          alert(`File "${file.name}" uploaded successfully!`);
        } else {
          alert(result.message || "Upload failed!");
        }
      } catch (error) {
        alert("An error occurred. Please try again.");
      } finally {
        uploadButton.disabled = false;
        uploadButton.textContent = "Upload";
      }
    });
  
    // Copy Link to Clipboard
    copyButton.addEventListener("click", () => {
      fileUrlInput.select();
      navigator.clipboard.writeText(fileUrlInput.value)
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => alert("Failed to copy link."));
    });
  });
  