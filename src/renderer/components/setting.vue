<template>
    <el-container class="container">
        <el-form style="width:450px;" ref="form" :model="form" label-width="76px">
            <el-form-item label="小说路径">
                <el-input
                    style="width: 73.5%;"
                    v-model="form.file_path"
                    size="mini"
                    placeholder="请选择小说路径"
                    prefix-icon="el-icon-tickets">
                </el-input>
                <el-button
                    type="primary"
                    size="mini"
                    @click="openTxt">
                    <i class="el-icon-folder-opened"></i>
                    选择
                </el-button>
            </el-form-item>

            <el-col :span="12">
                <el-form-item label="当前页数">
                    <el-input-number
                        size="mini"
                        controls-position="right"
                        :min="1"
                        :max="999999999"
                        v-model="form.curr_page">
                    </el-input-number>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="每页数量">
                    <el-input-number
                        v-if="form.curr_model === '1'"
                        :value="form.page_size"
                        size="mini"
                        controls-position="right"
                        :min="5"
                        :max="28"
                        @input="handleUpdatePageSize">
                    </el-input-number>

                    <el-input-number
                        v-else
                        size="mini"
                        controls-position="right"
                        :min="5"
                        :max="100"
                        v-model="form.page_size">
                    </el-input-number>
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
                        prefix-icon="el-icon-smoking">
                    </el-input>
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

            <!--快捷键设置-->
            <el-col :span="24">
                <el-form-item label="上一页">
                    <el-input
                        style="width: 73.5%;"
                        :value="form.previous_key"
                        size="mini"
                        placeholder="请设置上一页按键"
                        @keydown.native="val => handleKeyDown(val, 'previous_key')"
                        @keyup.native="handleKeyUp">
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="下一页">
                    <el-input
                        style="width: 73.5%;"
                        :value="form.next_key"
                        size="mini"
                        placeholder="请设置下一页按键"
                        @keydown.native="val => handleKeyDown(val, 'next_key')"
                        @keyup.native="handleKeyUp">
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="boss键">
                    <el-input
                        style="width: 73.5%;"
                        :value="form.boss_key"
                        size="mini"
                        placeholder="请设置boss键按键"
                        @keydown.native="val => handleKeyDown(val, 'boss_key')"
                        @keyup.native="handleKeyUp">
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="退出键">
                    <el-input
                        style="width: 73.5%;"
                        :value="form.exit_key"
                        size="mini"
                        placeholder="请设置退出键按键"
                        @keydown.native="val => handleKeyDown(val, 'exit_key')"
                        @keyup.native="handleKeyUp">
                    </el-input>
                </el-form-item>
            </el-col>

            <el-button
                style="width: 100%;"
                type="primary"
                size="mini"
                @click="onSubmit">
                保存
            </el-button>
        </el-form>
    </el-container>
</template>

<script>
    import {ipcRenderer} from 'electron';

    import helper from '../../main/utils/keys-utils'
    import db from '../../main/utils/db';
    import dialog from '../utils/dialog';

    export default {
        name: 'setting',
        data() {
            return {
                form: {
                    file_path: '',
                    curr_page: 1,
                    page_size: 5,
                    is_english: false,
                    line_break: ' ',
                    bg_color: '',
                    txt_color: '',
                    curr_model: '1',
                    previous_key: '',
                    next_key: '',
                    boss_key: '',
                    exit_key: '',
                },
                tempKeyDown: '',
            };
        },
        methods: {
            onLoad() {
                this.form.curr_page = db.get('current_page');
                this.form.page_size = db.get('page_size');
                this.form.is_english = db.get('is_english');
                this.form.line_break = db.get('line_break');
                this.form.file_path = db.get('current_file_path');
                this.form.bg_color = db.get('bg_color');
                this.form.txt_color = db.get('txt_color');
                this.form.curr_model = db.get('curr_model');
                this.form.previous_key = helper.transElectronKeyToLabel(
                    db.get('previous_key')
                );
                this.form.next_key = helper.transElectronKeyToLabel(
                    db.get('next_key')
                );
                this.form.boss_key = helper.transElectronKeyToLabel(
                    db.get('boss_key')
                );
                this.form.exit_key = helper.transElectronKeyToLabel(
                    db.get('exit_key')
                );
            },
            openTxt() {
                const that = this;
                dialog.showOpenFile(function (e) {
                    that.form.file_path = e[0];
                });
            },
            onSubmit() {
                db.set('current_page', this.form.curr_page);
                db.set('page_size', this.form.page_size);
                db.set('is_english', this.form.is_english);
                db.set('line_break', this.form.line_break);
                db.set('current_file_path', this.form.file_path);
                db.set('bg_color', this.form.bg_color);
                db.set('txt_color', this.form.txt_color);
                console.log(2222, helper.transLabelToElectronKey(
                    this.form.previous_key
                ))
                db.set('previous_key', helper.transLabelToElectronKey(
                    this.form.previous_key
                ));
                db.set('next_key', helper.transLabelToElectronKey(
                    this.form.next_key
                ));
                db.set('boss_key', helper.transLabelToElectronKey(
                    this.form.boss_key
                ));
                db.set('exit_key', helper.transLabelToElectronKey(
                    this.form.exit_key
                ));

                ipcRenderer.send('bg_text_color', 'ping');
                ipcRenderer.send('refresh_register_key', 'ping');
                this.$message({
                    type: 'success',
                    message: '保存成功',
                    duration: 1000
                })
            },
            handleKeyDown(val, keyName) {
                if (!this.tempKeyDown) {
                    this.tempKeyDown = this.form[keyName]
                    this.form[keyName] = ''
                }
                if (this.form[keyName].length >= 5) return
                if (this.assertKeyIsDisabled(val.key)) {
                    this.$message({
                        type: 'warning',
                        message: '存在禁用按键',
                        duration: 1000
                    })
                    this.form[keyName] = this.tempKeyDown
                    this.tempKeyDown = ''
                    return
                }
                const transKey = helper.transBrowserKeyToLabel(val.key)
                if (!this.form[keyName]) {
                    this.form[keyName] = transKey
                    return
                }
                this.form[keyName] += `+${transKey}`
            },
            handleKeyUp() {
                this.tempKeyDown = ''
            },
            assertKeyIsDisabled(key) {
                return helper.disabledKeys.includes(key)
            },
            handleUpdatePageSize(val) {
                const curPage = this.form.curr_page
                const pageSize = this.form.page_size
                this.form.curr_page = Math.floor(curPage * pageSize / val)
                this.form.page_size = val
            },
        },
        created() {
            this.onLoad();
        },
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
