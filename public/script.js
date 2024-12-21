document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const fileInput = document.getElementById("fileInput");
  const resultDiv = document.getElementById("result");
  const fileUrlInput = document.getElementById("fileUrl");
  const copyButton = document.getElementById("copyButton");
  const uploadButton = document.getElementById("uploadButton");

  // Update the file name on selection
  const updateFileName = (file) => {
    if (file) {
      uploadButton.disabled = false;
    }
  };

  // File upload handler
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
        resultDiv.classList.remove("hidden"); // Show the result section
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
    document.execCommand("copy");  // For browsers that do not support `navigator.clipboard.writeText`
    alert("Link copied to clipboard!");
  });
});
