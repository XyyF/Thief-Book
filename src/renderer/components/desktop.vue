<template>
  <el-container class="container" :style="color">
    <div class="text boss" v-if="is_boss">
      <span>{{text}}</span>
    </div>
    <div class="text" v-else>{{text}}</div>
  </el-container>
</template>

<script>
import db from "../../main/utils/db";
import { ipcRenderer, remote } from "electron";
import { on } from "cluster";

export default {
  name: "desktop",
  data() {
    return {
      is_boss: true,
      color: "",
      text: ""
    };
  },
  created() {
    this.onLoad();
  },
  mounted() {
    var that = this;
    ipcRenderer.on("bg_text_color", function(event, message) {
      that.onLoad();
    });

    ipcRenderer.on("text", function(event, message) {
      if (message === "boss") {
        that.is_boss = true;
        that.text = remote.getGlobal("text").text;
      } else {
        that.is_boss = false;
        that.text = remote.getGlobal("text").text;
      }
    });
  },
  methods: {
    onLoad() {
      var bg_color = db.get("bg_color");
      var txt_color = db.get("txt_color");
      this.color = "background: " + bg_color + ";color:" + txt_color + ";";
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  height: 100%;

  .text {
    -webkit-app-region: drag;
    margin-left: 10px;
    margin-right: 10px;
    height: 100%;
  }

  .boss {
    text-align: center;
    width: 100%;
  }
}
</style>
