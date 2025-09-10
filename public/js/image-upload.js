/* Multiple Image Upload Enhancements */
document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.getElementById('images');

    if (imageInput) {
        imageInput.addEventListener('change', function (e) {
            const files = e.target.files;
            const maxFiles = 3;
            const maxSize = 10 * 1024 * 1024; // 10MB

            // Check file count
            if (files.length > maxFiles) {
                alert(`You can only select up to ${maxFiles} images.`);
                e.target.value = '';
                return;
            }

            // Check file sizes and types
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (file.size > maxSize) {
                    alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
                    e.target.value = '';
                    return;
                }

                if (!file.type.startsWith('image/')) {
                    alert(`File "${file.name}" is not an image.`);
                    e.target.value = '';
                    return;
                }
            }

            // Clear previous previews
            const previewContainer = document.getElementById('image-preview');
            if (previewContainer) {
                previewContainer.innerHTML = '';

                // Create a row for previews
                const rowDiv = document.createElement('div');
                rowDiv.className = 'row';
                previewContainer.appendChild(rowDiv);

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function (e) {
                            const colDiv = document.createElement('div');
                            colDiv.className = 'col-md-4 mb-3';
                            colDiv.innerHTML = `
                                <div class="card">
                                    <img src="${e.target.result}" alt="Preview ${i + 1}" 
                                         class="card-img-top" 
                                         style="height: 200px; object-fit: cover;">
                                    <div class="card-body p-2">
                                        <small class="text-muted">${file.name}</small>
                                        <br>
                                        <small class="text-muted">${(file.size / 1024).toFixed(1)} KB</small>
                                    </div>
                                </div>
                            `;
                            rowDiv.appendChild(colDiv);
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
        });
    }
});

/* Carousel Auto-advance and Enhanced Controls */
document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.getElementById('carouselExampleIndicators');
    if (carousel) {
        // Initialize Bootstrap carousel with options
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 3000,  // 3 seconds auto-advance
            ride: 'carousel',
            pause: 'hover',
            wrap: true,
            keyboard: true,
            touch: true
        });

        // Enable keyboard navigation
        carousel.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                bsCarousel.prev();
            } else if (e.key === 'ArrowRight') {
                bsCarousel.next();
            } else if (e.key === ' ') { // Spacebar to pause/play
                e.preventDefault();
                bsCarousel.pause();
                setTimeout(() => bsCarousel.cycle(), 1000); // Resume after 1 second
            }
        });

        // Make carousel focusable
        carousel.setAttribute('tabindex', '0');

        // Add slide change event listener
        carousel.addEventListener('slide.bs.carousel', function (event) {
            console.log(`Sliding to slide ${event.to + 1}`);
        });
    }
});
