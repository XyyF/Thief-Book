<template>
  <el-container class="container">
    <el-form style="width:450px;" ref="form" :model="form" label-width="76px">
      <el-form-item label="小说路径">
        <el-input
          style="width: 73.5%;"
          v-model="form.file_path"
          size="mini"
          placeholder="请选择小说路径"
          prefix-icon="el-icon-tickets"
        ></el-input>
        <el-button type="primary" size="mini" @click="openTxt">
          <i class="el-icon-folder-opened"></i> 选择
        </el-button>
      </el-form-item>

      <el-col :span="12">
        <el-form-item label="当前页数">
          <el-input-number
            size="mini"
            controls-position="right"
            :min="1"
            :max="999999999"
            v-model="form.curr_page"
          ></el-input-number>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="每页数量">
          <el-input-number
            v-if="form.curr_model=='1'"
            size="mini"
            controls-position="right"
            :min="5"
            :max="28"
            v-model="form.page_size"
          ></el-input-number>

          <el-input-number
            v-else
            size="mini"
            controls-position="right"
            :min="5"
            :max="100"
            v-model="form.page_size"
          ></el-input-number>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="是否英文">
          <el-switch v-model="form.is_english"></el-switch>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="换行符号">
          <el-input
            style="width:111px;"
            v-model="form.line_break"
            maxlength="5"
            size="mini"
            placeholder="换行符号"
            prefix-icon="el-icon-smoking"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="背景色">
          <el-color-picker v-model="form.bg_color" show-alpha></el-color-picker>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="文字颜色">
          <el-color-picker v-model="form.txt_color" show-alpha></el-color-picker>
        </el-form-item>
      </el-col>

      <el-button style="width: 100%;" type="primary" size="mini" @click="onSubmit">保存</el-button>
    </el-form>
  </el-container>
</template>

<script>
import db from "../../main/utils/db";
import dialog from "../utils/dialog";
import { ipcRenderer } from "electron";

export default {
  name: "setting",
  data() {
    return {
      form: {
        file_path: "",
        curr_page: 1,
        page_size: 5,
        is_english: false,
        line_break: " ",
        bg_color: "",
        txt_color: "",
        curr_model: "1"
      }
    };
  },
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.form.curr_page = db.get("current_page");
      this.form.page_size = db.get("page_size");
      this.form.is_english = db.get("is_english");
      this.form.line_break = db.get("line_break");
      this.form.file_path = db.get("current_file_path");
      this.form.bg_color = db.get("bg_color");
      this.form.txt_color = db.get("txt_color");
      this.form.curr_model = db.get("curr_model");
    },
    openTxt() {
      var that = this;
      dialog.showOpenFile(function(e) {
        that.form.file_path = e[0];
      });
    },
    onSubmit() {
      db.set("current_page", this.form.curr_page);
      db.set("page_size", this.form.page_size);
      db.set("is_english", this.form.is_english);
      db.set("line_break", this.form.line_break);
      db.set("current_file_path", this.form.file_path);
      db.set("bg_color", this.form.bg_color);
      db.set("txt_color", this.form.txt_color);

      ipcRenderer.send("bg_text_color", "ping");
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  margin: 10px;
}

.el-input-number--mini {
  width: 111px;
  line-height: 26px;
}
</style>
