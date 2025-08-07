import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-123.0, 45.6],
  zoom: 8.3,
  interactive: false
});

const tillamook = [-123.84668, 45.4561];
const lincolnCityRoute = [tillamook, [-123.8, 45.3], [-123.75, 45.15], [-123.95, 44.96]];
const astoriaRoute = [tillamook, [-123.85, 45.6], [-123.9, 45.75], [-123.83, 46.19]];

const markerLincoln = new mapboxgl.Marker({ color: 'orange' }).setLngLat(tillamook).addTo(map);
const markerAstoria = new mapboxgl.Marker({ color: 'blue' }).setLngLat(tillamook).addTo(map);

function interpolate(coords, progress) {
  if (progress <= 0) return coords[0];
  if (progress >= 1) return coords[coords.length - 1];
  const i = Math.floor(progress * (coords.length - 1));
  const t = (progress * (coords.length - 1)) - i;
  const [aLng, aLat] = coords[i];
  const [bLng, bLat] = coords[i + 1];
  return [aLng + (bLng - aLng) * t, aLat + (bLat - aLat) * t];
}

const scrollStart = window.innerHeight * 0.5;
const outboundLength = window.innerHeight * 2;
const pauseLength = window.innerHeight * 1.5;
const returnLength = window.innerHeight * 2;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const progressOut = Math.min(Math.max((scrollY - scrollStart) / outboundLength, 0), 1);
  const progressBack = Math.min(Math.max((scrollY - (scrollStart + outboundLength + pauseLength)) / returnLength, 0), 1);

  const floatingText = document.getElementById('floatingText');

  if (scrollY < scrollStart) {
    markerLincoln.setLngLat(tillamook);
    markerAstoria.setLngLat(tillamook);
    floatingText.innerHTML = `<h2>Dialysis Journey</h2><p>Scroll down to see patients traveling to treatment.</p>`;
  }
  else if (scrollY < scrollStart + outboundLength) {
    markerLincoln.setLngLat(interpolate(lincolnCityRoute, progressOut));
    markerAstoria.setLngLat(interpolate(astoriaRoute, progressOut));
    floatingText.innerHTML = `<h2>Outbound</h2><p>Patients are heading to dialysis clinics. ${(progressOut*100).toFixed(0)}% complete.</p>`;
  }
  else if (scrollY < scrollStart + outboundLength + pauseLength) {
    markerLincoln.setLngLat(lincolnCityRoute[lincolnCityRoute.length - 1]);
    markerAstoria.setLngLat(astoriaRoute[astoriaRoute.length - 1]);
    floatingText.innerHTML = `<h2>Treatment</h2><p>Patients are receiving dialysis. Scroll down to see their return.</p>`;
  }
  else if (scrollY < scrollStart + outboundLength + pauseLength + returnLength) {
    markerLincoln.setLngLat(interpolate(lincolnCityRoute.slice().reverse(), progressBack));
    markerAstoria.setLngLat(interpolate(astoriaRoute.slice().reverse(), progressBack));
    floatingText.innerHTML = `<h2>Return Trip</h2><p>Heading back to Tillamook. ${(progressBack*100).toFixed(0)}% complete.</p>`;
  } else {
    markerLincoln.setLngLat(tillamook);
    markerAstoria.setLngLat(tillamook);
    floatingText.innerHTML = `<h2>Home</h2><p>The long round-trip journey is complete.</p>`;
  }
});



document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
