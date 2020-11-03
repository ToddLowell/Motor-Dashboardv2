<template>
  <simple-bar class="right-sidebar" :class="{ 'right-toggled': colorSwitcherActive }">
    <div class="switcher-icon" @click="colorSwitcherActive = !colorSwitcherActive">
      <fa :icon="['fas', 'cog']" />
    </div>
    <div class="right-sidebar-content">
      <p class="mb-0">Image Backgrounds</p>
      <ul class="switcher">
        <li id="bg-theme1--preview" @click="changeBg(1)"></li>
        <li id="bg-theme2--preview" @click="changeBg(2)"></li>
        <li id="bg-theme3--preview" @click="changeBg(3)"></li>
        <li id="bg-theme4--preview" @click="changeBg(4)"></li>
        <li id="bg-theme5--preview" @click="changeBg(5)"></li>
        <li id="bg-theme6--preview" @click="changeBg(6)"></li>
      </ul>
      <p class="mb-0">Gradient Backgrounds</p>
      <ul class="switcher">
        <li id="bg-theme7--preview" @click="changeBg(7)"></li>
        <li id="bg-theme8--preview" @click="changeBg(8)"></li>
        <li id="bg-theme9--preview" @click="changeBg(9)"></li>
        <li id="bg-theme10--preview" @click="changeBg(10)"></li>
        <li id="bg-theme11--preview" @click="changeBg(11)"></li>
        <li id="bg-theme12--preview" @click="changeBg(12)"></li>
        <li id="bg-theme13--preview" @click="changeBg(13)"></li>
        <li id="bg-theme14--preview" @click="changeBg(14)"></li>
        <li id="bg-theme15--preview" @click="changeBg(15)"></li>
      </ul>
    </div>
  </simple-bar>
</template>

<script>
import SimpleBar from './SimpleBar.vue';

export default {
  components: {
    SimpleBar
  },
  data() {
    return {
      colorSwitcherActive: false
    };
  },
  methods: {
    changeBg(bgNum) {
      setTimeout(() => {
        this.colorSwitcherActive = false;
      }, 200);
      document.querySelector('body').className = `bg-theme bg-theme${bgNum}`;
    }
  },
  mounted() {
    this.changeBg(1);
  }
};
</script>

<style lang="scss">
.right-sidebar {
  width: 245px;
  height: 100vh;
  max-height: 100vh;
  position: fixed !important;
  top: 0;
  right: -300px;
  z-index: 10;
  text-align: center;
  padding: 10px;
  background: #000000;
  box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0 rgba(0, 0, 0, 0.12),
    0 8px 10px -5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &.right-toggled {
    right: 0px;
  }

  &.right-toggled .switcher-icon {
    right: 245px;
  }
}

.switcher-icon {
  width: 40px;
  height: 40px;
  line-height: 40px;
  background: #000;
  text-align: center;
  font-size: 22px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0 rgba(0, 0, 0, 0.12),
    0 8px 10px -5px rgba(0, 0, 0, 0.2);
  position: fixed;
  right: 0;
  top: 25%;
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  transition: all 0.3s ease;
}

.switcher {
  list-style: none;
  margin: 0;
  padding: 1rem 0;
  overflow: hidden;
  margin-left: 20px;

  &:last-child {
    padding-bottom: 0;
  }

  & li {
    float: left;
    width: 85px;
    height: 75px;
    margin: 0 15px 15px 0px;
    border-radius: 4px;
    border: 0px solid black;

    &:nth-child(even) {
      margin-right: 0;
    }
  }
}

#bg-theme2--preview {
  background-image: url(../assets/images/bg-themes/2.png);
  background-size: 100% 100%;
  background-position: center;
  transition: background 0.3s;
}
#bg-theme3--preview {
  background-image: url(../assets/images/bg-themes/3.png);
  background-size: 100% 100%;
  background-position: center;
  transition: background 0.3s;
}
#bg-theme4--preview {
  background-image: url(../assets/images/bg-themes/4.png);
  background-size: 100% 100%;
  background-position: center;
  transition: background 0.3s;
}
#bg-theme5--preview {
  background-image: url(../assets/images/bg-themes/7.jpg);
  background-size: 100% 100%;
  background-position: center;
  transition: background 0.3s;
}
#bg-theme6--preview {
  background-image: url(../assets/images/bg-themes/6.png);
  background-size: 100% 100%;
  background-position: center;
  transition: background 0.3s;
}
#bg-theme7--preview {
  background-image: linear-gradient(45deg, #0c675e, #069e90);
  background-size: 100% 100%;
  background-position: center;
  transition: background 0.3s;
}
#bg-theme8--preview {
  background-image: linear-gradient(
    567deg,
    rgba(165, 42, 4, 0.89),
    rgba(113, 102, 8, 0.89),
    rgba(13, 95, 16, 0.93),
    rgba(4, 79, 88, 0.94),
    rgba(19, 56, 86, 0.9),
    rgba(24, 32, 78, 0.94),
    rgba(100, 8, 115, 0.95)
  );
  background-size: 100% 100%;
  background-position: center;
  transition: background 0.3s;
}
#bg-theme9--preview {
  background-image: linear-gradient(45deg, #29323c, #485563);
  background-size: 100% 100%;
  background-position: center;
  transition: background 0.3s;
}
#bg-theme10--preview {
  background-image: linear-gradient(45deg, #795548, #945c48);
  background-size: 100% 100%;
  background-position: center;
  transition: background 0.3s;
}
#bg-theme11--preview {
  background-image: linear-gradient(45deg, #1565c0, #1e88e5);
  background-size: 100% 100%;
  background-position: center;
  transition: background 0.3s;
}
#bg-theme12--preview {
  background-image: linear-gradient(45deg, #65379b, #886aea);
  background-size: 100% 100%;
  background-position: center;
  transition: background 0.3s;
}

#bg-theme13--preview {
  background-image: linear-gradient(180deg, #ff5447, #f1076f);
  background-size: 100% 100%;
  background-position: center;
  transition: background 0.3s;
}

#bg-theme14--preview {
  background-image: linear-gradient(180deg, #08a50e, #69bb03);
  background-size: 100% 100%;
  background-position: center;
  transition: background 0.3s;
}
#bg-theme15--preview {
  background-image: linear-gradient(45deg, #6a11cb, #2575fc);
  background-size: 100% 100%;
  background-position: center;
  transition: background 0.3s;
}

body.bg-theme {
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background 0.3s;
}

body.bg-theme1 {
  background-image: url(../assets/images/bg-themes/1.png);
}

#bg-theme1--preview {
  background-image: url(../assets/images/bg-themes/1.png);
  background-size: 100% 100%;
  background-position: center;
  transition: background 0.3s;
}

body.bg-theme2 {
  background-image: url(../assets/images/bg-themes/2.png);
}
body.bg-theme3 {
  background-image: url(../assets/images/bg-themes/3.png);
}
body.bg-theme4 {
  background-image: url(../assets/images/bg-themes/4.png);
}
body.bg-theme5 {
  background-image: url(../assets/images/bg-themes/7.jpg);
}
body.bg-theme6 {
  background-image: url(../assets/images/bg-themes/6.png);
}
body.bg-theme7 {
  background-image: linear-gradient(45deg, #0c675e, #069e90);
}
body.bg-theme8 {
  background-image: linear-gradient(
    567deg,
    rgba(165, 42, 4, 0.89),
    rgba(113, 102, 8, 0.89),
    rgba(13, 95, 16, 0.93),
    rgba(4, 79, 88, 0.94),
    rgba(19, 56, 86, 0.9),
    rgba(24, 32, 78, 0.94),
    rgba(100, 8, 115, 0.95)
  );
}
body.bg-theme9 {
  background-image: linear-gradient(45deg, #29323c, #485563);
}
body.bg-theme10 {
  background-image: linear-gradient(45deg, #795548, #945c48);
}
body.bg-theme11 {
  background-image: linear-gradient(45deg, #1565c0, #1e88e5);
}
body.bg-theme12 {
  background-image: linear-gradient(45deg, #65379b, #886aea);
}
body.bg-theme13 {
  background-image: linear-gradient(180deg, #ff5447, #f1076f);
}
body.bg-theme14 {
  background-image: linear-gradient(180deg, #08a50e, #69bb03);
}
body.bg-theme15 {
  background-image: linear-gradient(45deg, #6a11cb, #2575fc);
}
</style>
