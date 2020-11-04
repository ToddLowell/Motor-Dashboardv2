<template>
  <div class="card" @click="changeUnit">
    <div class="widget">
      <div class="widget__icon">
        <div class="weather__icon">
          <img :src="imageLocation" />
        </div>
      </div>
      <div class="error" v-if="error">
        {{ errorMsg }}
      </div>
      <div class="widget__body" v-else>
        <div class="weather">
          <div class="weather__container">
            <div class="weather__temp--value">
              {{ showCelsius ? celsius.value : fahrenheit.value }}&#176;
              {{ showCelsius ? celsius.unit : fahrenheit.unit }}
            </div>
            <div class="weather__temp--desc">{{ description }}</div>
            <div class="weather__location">{{ city }}, {{ country }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: false,
      errorMsg: '',
      showCelsius: true,
      celsius: {
        unit: 'C',
        value: '-'
      },
      description: null,
      iconId: null,
      city: null,
      country: null,
      imageLocation: '/assets/images/weather-icons/unknown.png',
      key: 'ec1dc2eb50aa1eb3308566f19bddaf71'
    };
  },
  computed: {
    fahrenheit() {
      return {
        unit: 'F',
        value: Math.floor((this.celsius.value * 9) / 5 + 32)
      };
    }
  },
  methods: {
    changeUnit() {
      if (this.celsius.value == '-') return;

      this.showCelsius = !this.showCelsius;
    },
    // get user's lat and long
    setPosition(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // get weather from API
      const api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.key}`;

      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.celsius.value = Math.floor(data.main.temp - 273);
          this.description = data.weather[0].description;
          this.iconId = data.weather[0].icon;
          this.city = data.name;
          this.country = data.sys.country;
          this.imageLocation = `/assets/images/weather-icons/${this.iconId}.png`;
        });
    },
    // hardcoded to KL
    setKLPosition() {
      const latitude = 3.1523;
      const longitude = 101.708;

      // get weather from API
      const api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.key}`;

      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.celsius.value = Math.floor(data.main.temp - 273);
          this.description = data.weather[0].description;
          this.iconId = data.weather[0].icon;
          this.city = data.name;
          this.country = data.sys.country;
          this.imageLocation = `/assets/images/weather-icons/${this.iconId}.png`;
        });
    },
    // display error
    // eslint-disable-next-line no-unused-vars
    showError(error) {
      // NOTE: commenting out the error handling
      // this.error = true;
      // this.errorMsg = error.message;
      // NOTE: display hardcoded coordinates
      this.setKLPosition();
    }
  },
  mounted() {
    // check for browser support
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(this.setPosition, this.showError);
    } else {
      this.error = true;
      this.errorMsg = "Browser doesn't Support Geolocation";
    }
  }
};
</script>
