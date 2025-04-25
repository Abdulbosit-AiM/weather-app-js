let weather = {
    'apiKey': config.SECRET_API_KEY,
    'unsplashKey': '6WkK4x_SRvlHrIFrJk7fCLbNuvBL806Fmg-l02KUpqk',
    fetchWeather: function (city) {
        fetch(
            'https://api.openweathermap.org/data/2.5/weather?q=' 
            + city 
            + '&units=metric&appid=' 
            + this.apiKey
        ).then((response) => {
            if (!response.ok) {
              alert("No weather found.");
              throw new Error("No weather found.");
            }
            return response.json();
          })
          .then((data) => this.displayWeather(data));
    },
    fetchBackground: function(query) {
        return fetch(
            'https://api.unsplash.com/search/photos?query=' + query + '&per_page=1&client_id=' + this.unsplashKey
        ).then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch background image");
            }
            return response.json();
        }).catch(error => {
            console.error("Background fetch error:", error);
            return { results: [] }; // Return empty results if fetch fails
        });
    },
    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        const weatherMain = data.weather[0].main.toLowerCase();

        document.querySelector('.city').innerText = 'Weather in ' + name;
        document.querySelector('.icon').src = 'https://openweathermap.org/img/wn/' + icon + '.png';
        document.querySelector('.description').innerText = description;
        document.querySelector('.temp').innerText = temp + '° C';
        document.querySelector('.humidity').innerText = 'Humidity: ' + humidity + '%';
        document.querySelector('.wind').innerText = 'Wind Speed: ' + speed + 'km/h';

        document.querySelector('.weather').classList.remove('loading');
        
        // Get background query based on weather condition
        let backgroundQuery;
        
        switch(weatherMain) {
            case 'clear':
                backgroundQuery = name + ' city sunny';
                break;
            case 'clouds':
                backgroundQuery = name + ' city cloudy';
                break;
            case 'rain':
            case 'drizzle':
                backgroundQuery = name + ' city rain';
                break;
            case 'thunderstorm':
                backgroundQuery = name + ' city storm';
                break;
            case 'snow':
                backgroundQuery = name + ' city snow';
                break;
            case 'fog':
            case 'mist':
                backgroundQuery = name + ' city fog';
                break;
            default:
                backgroundQuery = name + ' city';
        }
        
        // Fetch and apply background
        this.fetchBackground(backgroundQuery)
            .then(data => {
                // Apply default background if no results
                if (data.results.length === 0) {
                    document.body.style.backgroundImage = 'url("./default-background.jpg")';
                    return;
                }
                
                const imageUrl = data.results[0].urls.regular;
                
                // Create new image object to preload
                const img = new Image();
                img.onload = function() {
                    document.body.style.backgroundImage = `url("${imageUrl}")`;
                };
                img.onerror = function() {
                    document.body.style.backgroundImage = 'url("./default-background.jpg")';
                };
                img.src = imageUrl;
            });
            
        // Add transition effect for smooth background changes
        document.body.style.transition = 'background-image 1s ease';
    },
    search: function() {
        this.fetchWeather(document.querySelector('.search-bar').value);
    }
};

document.querySelector('.search button').addEventListener('click', function () {
    weather.search();
});

document.querySelector('.search-bar').addEventListener('keyup', function (event) {
    if (event.key == 'Enter') {
        weather.search();
    }
});

// Set default background immediately when page loads
document.body.style.backgroundImage = 'url("./default-background.jpg")';

// Initial weather fetch
weather.fetchWeather('Kokand');