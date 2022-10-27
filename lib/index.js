/**
 * 主程序入口
 */

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const tplStr = fs.readFileSync(path.resolve(__dirname, './template.hbs'), 'utf8');

/**
 * [request: the request module]
 * @type {[type]}
 */
const syncReq = require('sync-request');

/**
 * [request: the request module]
 * @type {[type]}
 */
const NodeCache = require('node-cache');
const localCache = new NodeCache({});

/** include qrcode.js */
const qrcode = require('./qrcode.js');

/** set Date protocol */
// eslint-disable-next-line no-extend-native
Date.prototype.format = function (format) {
    const date = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        'S+': this.getMilliseconds(),
    };

    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length));
    }

    Object.entries(date).forEach(([k, v]) => {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? v : `00${v}`.substr(`${v}`.length));
        }
    });
    return format;
};

/**
 * [defaultOption: default option]
 * @type {Object}
 */
const defaultOption = {
    description: '修改于',
    signature: 'Mofar',
    wisdom: '生活的痕迹, 默远的猪窝！',
    format: 'yyyy/MM/dd hh:mm:ss',
    copyright: 'Copyright &#169; Mofar',
    timeColor: '#666',
    copyrightColor: '#666',
    utcOffset: '8',
    isShowQRCode: true,
    baseUri: 'https://www.mofar.top/',
    style: 'normal',
    super: '&#174;',
    isShowExtend: true,
    extendContent: '<a href="https://beian.miit.gov.cn/" target="blank">粤ICP备19043283号</a>'
};

// noinspection JSUnusedGlobalSymbols
/**
 * [main module]
 * @type {Object}
 */
module.exports = {
    generate,
    /** Map of new style */
    book: {
        assets: './assets',
        css: ['footer.css'],
    },

    /** Map of hooks */
    hooks: {
        'page:before': function (page) {
            /** add contents to the original content */
            if (this.output.name === 'website') {
                page.content = page.content + generate(this.config.get('pluginsConfig')['page-footer-mofar']);
            }

            return page;
        },
    },

    /** Map of new filters */
    filters: {
        dateFormat: function (d, format, utc) {
            let reservedDate = new Date(d);
            /** convert to UTC firstly */
            reservedDate = new Date(
                reservedDate.getUTCFullYear(),
                reservedDate.getUTCMonth(),
                reservedDate.getUTCDate(),
                reservedDate.getUTCHours(),
                reservedDate.getUTCMinutes(),
                reservedDate.getUTCSeconds(),
            );
            reservedDate.setTime(reservedDate.getTime() + (!utc ? 8 : parseInt(utc)) * 60 * 60 * 1000);
            return reservedDate.format(format);
        },

        currentURI: function (d, baseUri) {
            // noinspection JSUnresolvedFunction
            return this.output.name === 'website' ? createQRCode(baseUri + this.output.toURL(d), 15, 'Q') : '';
        },
    },
};

function hex2rgb(hex) {
    return Array(3).fill('').map((_, i) => parseInt(hex.slice(2 * i, 2 * (i + 1)), 16));
}

function rgb2hsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s;
    let l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
        case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
        case g:
            h = (b - r) / d + 2;
            break;
        case b:
            h = (r - g) / d + 4;
        }
        h /= 6;
    }
    h = h * 360;
    s = s * 100;
    l = l * 100;
    return [h, s, l];
}

function createQRCode(text, typeNumber, errorCorrectLevel) {
    const qr = qrcode(typeNumber || 10, errorCorrectLevel || 'H');
    qr.addData(text);
    qr.make();

    return qr.createSvgTag();
}

function generate(configs) {
    const options = {
        ...defaultOption,
        ...configs,
        copyright: `${configs.copyright || defaultOption.copyright} all right reserved, powered by <a href="https://www.mofar.top/" target="_blank">Mofar</a>`,
    };

    return Handlebars.compile(tplStr)({
        ...options,
        style: /normal|symmetrical/.test(options.style) ? options.style : 'normal',
    });
}

