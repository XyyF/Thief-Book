'use strict';
import os from 'os'

export default {
    dealTime(s) {
        let seconds = s || 0;
        let day = (seconds / (3600 * 24)) | 0;
        let hours = (seconds / 3600 % 24) | 0;
        let minutes = (seconds / (3600 * 24) % 60) | 0;
        let second = seconds % 60 | 0;
        (day < 10) && (day = '0' + day);
        (hours < 10) && (hours = '0' + hours);
        (minutes < 10) && (minutes = '0' + minutes);
        (second < 10) && (second = '0' + second);
        return [day, hours, minutes, second].join(':');
    },
    getTime() {
        const updateTime = os.uptime();
        return "您的开机时长：" + this.dealTime(updateTime);
    },
};