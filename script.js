let header = document.querySelector('header');

window.addEventListener('scroll', () =>{
    header.classList.toggle('shadow', window.scrollY > 0);
});

let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};
window.onscroll = () =>{
    menu.classList.remove('bx-x');
    navbar.classList.remove('active');
};

var swiper = new Swiper(".home", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
var swiper = new Swiper(".coming-container", {
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    breakpoints: {
        0: {
            slidesPerView: 2,
        },
        568: {
            slidesPerView: 3,
        },
        768: {
            slidesPerView: 4,
        },
        968: {
            slidesPerView: 5,
        },

    }
  });

  // TMDB API Integration
const API_KEY = '88add2c37bec9fb5ce21cb9e7313fbd0';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

async function fetchMovies(endpoint, containerSelector, withSwiper = false) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    const container = document.querySelector(containerSelector);

    if (!container) return;
    if (!withSwiper) container.innerHTML = '';

    data.results.slice(0, 10).forEach(async (movie) => {
      const movieId = movie.id;
      const trailerURL = await fetchTrailerURL(movieId);

      const box = document.createElement('div');
      box.classList.add('box');
      if (withSwiper) box.classList.add('swiper-slide');

      const boxImg = document.createElement('div');
      boxImg.classList.add('box-img');
      const img = document.createElement('img');
      img.src = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'img/default-image.jpg';
      img.alt = movie.title || 'Movie Poster';
      img.loading = 'lazy';
      boxImg.appendChild(img);

      const h3 = document.createElement('h3');
      h3.textContent = movie.title;

      const span = document.createElement('span');
      span.textContent = '120 min | ' + (movie.genre_ids  && movie.genre_ids.length ? ' | Genre' : '');

      const bookBtn = document.createElement('a');
      bookBtn.href = `https://www.themoviedb.org/movie/${movieId}`;
      bookBtn.target = '_blank';
      bookBtn.className = 'btn';
      bookBtn.textContent = 'Book Now';

      const playBtn = document.createElement('a');
      playBtn.href = trailerURL || '#';
      playBtn.target = '_blank';
      playBtn.className = 'play';
      playBtn.innerHTML = "<i class='bx bx-play'></i>";

      box.appendChild(boxImg);
      box.appendChild(h3);
      box.appendChild(span);
      box.appendChild(bookBtn);
      if (trailerURL) box.appendChild(playBtn);

      container.appendChild(box);
    });
  } catch (err) {
    console.error("Error fetching movies:", err);
  }
}

async function fetchTrailerURL(movieId) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  } catch (err) {
    return null;
  }
}

// Load Movies
fetchMovies('/movie/popular', '.movies-container');
fetchMovies('/movie/upcoming', '.coming-container .swiper-wrapper', true);

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      const successMsg = form.querySelector('.success-message');
      if (successMsg) successMsg.style.display = 'block';
      form.reset();
    } else {
      alert("Oops! Something went wrong.");
    }
    /*if (response.ok) {
      form.querySelector('.success-message').style.display = 'block';
      form.reset();
    } else {
      alert("Oops! Something went wrong.");
    }*/
  }).catch(() => {
    alert("Oops! Something went wrong.");
  });
}

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});