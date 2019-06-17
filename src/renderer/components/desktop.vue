<template>
    <el-container class="container" :style="color">
        <div class="container__text container__boss" v-if="is_boss">
            <span>{{text}}</span>
        </div>
        <div class="container__text" v-else>{{ text }}</div>
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
                text: ''
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
            }
        }
    };
</script>

<style scoped lang="scss">
    .container {
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
    }
</style>
