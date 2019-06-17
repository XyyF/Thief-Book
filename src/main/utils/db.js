'use strict';
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import LodashId from 'lodash-id'
import { remote, app } from 'electron'

let isMac = 'darwin' === process.platform;
let isInit = false

const dataMap = {
    'current_page': 1, // 当前页码
    'page_size': 20, // 每页文字数量
    'is_english': false, // 是否是英文
    'line_break': ' ', //
    'current_file_path': '', // 文件路径
    'bg_color': 'rgba(0, 0, 0, 0.5)', // 背景色
    'txt_color': '#fff', // 文字色
    'previous_key': 'CommandOrControl+1', // 上一页快捷键
    'next_key': 'CommandOrControl+2', // 下一页快捷键
    'boss_key': 'CommandOrControl+3', // boss快捷键
    'exit_key': 'CommandOrControl+4', // 退出快捷键
    'curr_model': isMac ? 1 : 2, // 当前的模式 - 桌面版本 || 任务栏版本
}

export default {
    data() {
        return {
            db_util: null,
            file_json: ""
        };
    },
    init() {
        // if (process.env.NODE_ENV !== 'development') {
        //     global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
        // }

        // if (process.env.DEBUG_ENV === 'debug') {
        //     global.__static = path.join(__dirname, '../../static').replace(/\\/g, '\\\\')
        // }

        let APP = process.type === 'renderer' ? remote.app : app
        let STORE_PATH = APP.getPath('userData')
        // let STORE_PATH = "/Users/sanjin/work/h5/vue/thief-book/static"

        if (process.type !== 'renderer') {
            if (!fs.pathExistsSync(STORE_PATH)) {
                fs.mkdirpSync(STORE_PATH)
            }
        }

        this.file_json = new FileSync(path.join(STORE_PATH, '/thief_data.json'));
        this.db_util = low(this.file_json)
        this.db_util._.mixin(LodashId)

        Object.entries(dataMap).forEach(([key, value]) => {
            if (!this.db_util.has(key).value()) {
                this.db_util.set(key, value).write()
            }
        })
        isInit = true
    },
    get(key) {
        this.init();
        return this.db_util.get(key).value();
    },
    set(key, value) {
        this.init();
        this.db_util.set(key, value).write();
    }
};