document.addEventListener('DOMContentLoaded', function () {
    const map = L.map('map').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    let currentCircle = null;
    const regionButtons = document.querySelectorAll('.region-btn');
    const fallbackCoords = {
        'Европа': [54.5, 15],
        'Азия': [34, 100],
        'Америка': [30, -90],
        'Африка': [0, 20]
    };
    
    function useFallbackCoords(regionName) {
        alert(`Не удалось найти "${regionName}" через API. Используем примерное местоположение.`);
        const coords = fallbackCoords[regionName];
        if (coords) {
            if (currentCircle) {
                map.removeLayer(currentCircle);
            }
            currentCircle = L.circle(coords, {
                radius: 1500000,
                color: '#6c5ce7',
                fillColor: '#6c5ce7',
                fillOpacity: 0.25
            }).addTo(map);
            map.flyTo(coords, 3);
        }
    }
    
    regionButtons.forEach(button => {
        button.addEventListener('click', function () {
            regionButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const region = this.textContent.trim();
            
            if (currentCircle) {
                map.removeLayer(currentCircle);
                currentCircle = null;
            }
            
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(region)}&format=json&limit=1`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);
                        
                        currentCircle = L.circle([lat, lon], {
                            radius: 1500000,
                            color: '#6c5ce7',
                            fillColor: '#6c5ce7',
                            fillOpacity: 0.25
                        }).addTo(map);
                        
                        map.flyTo([lat, lon], 3);
                    } else {
                        useFallbackCoords(region);
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    useFallbackCoords(region);
                });
        });
    });
});