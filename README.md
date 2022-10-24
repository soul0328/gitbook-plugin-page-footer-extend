## gitbook-plugin-page-footer-extend

gitbook的页脚插件

### Installation

Add the following plugins to your `book.json` and run `gitbook install`

```json
{
    "plugins": ["page-footer-extend"]
}
```

### Usage

Just find the plugin on gitbook and install it on your gitbook project.

The default configuration is:

```json
{
    "plugins": [
        "page-footer-extend"
    ],
    "pluginsConfig": {
        "page-footer-mofar": {
            "description": "Mofar",
            "signature": "Mofar",
            "wisdom": "生活的痕迹, 默远的猪窝！",
            "format": "yyyy/MM/dd hh:mm:ss",
            "copyright": "Copyright &#169; Mofar",
            "timeColor": "#666",
            "copyrightColor": "#666",
            "utcOffset": "8",
            "isShowQRCode": true,
            "baseUri": "https://www.mofar.top/",
        }
    }
}
```


