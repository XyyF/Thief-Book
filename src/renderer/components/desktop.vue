<template>
    <el-container class="desktop-root" :style="color">
        <el-button
            icon="el-icon-arrow-left"
            circle
            @click="handlePreviousPage">
        </el-button>
        <div class="container__text container__boss" v-if="is_boss">
            <span>{{text}}</span>
        </div>
        <div class="container__text" v-else>{{ text }}</div>
        <el-button
            icon="el-icon-arrow-right"
            circle
            @click="handleNextPage">
        </el-button>
    </el-container>
</template>

<script>
    import {ipcRenderer, remote} from 'electron';

    import db from '../../main/utils/db';

    export default {
        name: 'desktop',
        data() {
            return {
                is_boss: true,
                color: '',
                text: '',
                showBtn: false,
            };
        },
        created() {
            this.onLoad();
        },
        mounted() {
            const that = this;
            ipcRenderer.on('bg_text_color', function () {
                that.onLoad();
            });

            ipcRenderer.on('text', function (event, message) {
                if (message === 'boss') {
                    that.is_boss = true;
                    that.text = remote.getGlobal('text').text;
                } else {
                    that.is_boss = false;
                    that.text = remote.getGlobal('text').text;
                }
            });
        },
        methods: {
            onLoad() {
                const bg_color = db.get('bg_color');
                const txt_color = db.get('txt_color');
                this.color = 'background: ' + bg_color + ';color:' + txt_color + ';';
            },
            handlePreviousPage() {
                ipcRenderer.send('previous_page', 'ping');
            },
            handleNextPage() {
                ipcRenderer.send('next_page', 'ping');
            },
        }
    };
</script>

<style scoped lang="scss">
    .desktop-root {
        display: flex;
        align-items: center;
        height: 100%;

        .container__text {
            -webkit-app-region: drag;
            margin-left: 10px;
            margin-right: 10px;
            height: 100%;
        }

        .container__boss {
            text-align: center;
            width: 100%;
        }

        .el-button {
            border: none;
            outline: none;
            padding: 0;
            margin: 0 10px;
            height: 36px;
            width: 36px;
            cursor: pointer;
            transition: .3s;
            border-radius: 50%;
            background-color: rgba(31, 45, 61, .11);
            color: #fff;
            text-align: center;
            font-size: 12px;
        }

        .el-button /deep/ i {
            cursor: pointer;
            color: #fff;
        }
    }
</style>
