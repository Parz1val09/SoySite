document.getElementById('imp').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const files = event.target.files;
    const imagePreviews = document.getElementById('imagePreviews');
    imagePreviews.innerHTML = ''; // Clear existing images
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append('images', file);

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Image Preview';
            img.style.display = 'block';
            imagePreviews.appendChild(img);
        };
        reader.readAsDataURL(file);
    }

    fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        displayResults(result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function displayResults(result) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear existing results

    result.forEach(res => {
        const div = document.createElement('div');
        div.innerHTML = `<h3>Image: ${res.path}</h3><p>Defects: ${JSON.stringify(res.defects)}</p>`;
        resultsDiv.appendChild(div);
    });
}
