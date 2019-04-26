import { _getLyric } from 'api/song'
import { Base64 } from 'js-base64'
import { getSongVkey } from 'api/song'

//song类
class song {
    constructor({ id, mid, singer, name, album, duration, image, src, rank }) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.filename = `C400${this.mid}.m4a`
        this.src = src
        this.rank = rank
    }
}

song.prototype.getLyric = getLyric

export function getLyric() {
    if (this.lyric) {
        return Promise.resolve(this.lyric)
    }
    else {
        return new Promise((resolve, reject) => {
            _getLyric(this.mid).then(data => {
                if (data.retcode == 0) {
                    this.lyric = Base64.decode(data.lyric);
                    resolve(this.lyric);
                }
                else {
                    reject("暂无歌词")
                }
            })
        })
    }
}

//创建song对象
export function createSong(musicData, vkey, r) {
    return new song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        src: "",
        rank: r
    })
}

function filterSinger(singer) {
    if (!singer) {
        return ''
    }
    return singer.map(function (item) {
        return item.name
    }).join("/");
}

export function _encaseSongList(list, data) {
    let result = [];
    list.forEach((item, i) => {
        let ITEM = item;
        if (data) {
            ITEM = item[data]
        }
        if (ITEM.songid && ITEM.songmid) {
            result.push(createSong(ITEM));
            let song = result[i];
            getSongVkey(song.mid).then((res) => {
                let vkey = res.data.items[0].vkey;
                song.src = vkey ? `http://dl.stream.qqmusic.qq.com/C400${song.mid}.m4a?fromtag=38&guid=5931742855&vkey=${vkey}` : "";
                song.name = vkey ? song.name : `<del>${song.name}(暂无音源)</del>`
            })
        }
    })
    return result;
}

//歌词解析器
export function lyricParser(lyricStr, fn) {
    this.line = -1;
    this.lyricStr = lyricStr;
    this.fn = fn;
    this.curTime = 0;
    this.playing = true;
    this.timer = null;
    // this.title = this.lyricStr.match(/\[ti:(.+?)\]/)[1];
    // this.singer = this.lyricStr.match(/\[ar:(.+?)\]/)[1];
    // this.album = this.lyricStr.match(/\[al:(.+?)\]/)[1];
    this.noLyric = false;
    this.textContent = this.parser(lyricStr);
    // this.lyricDuration = this.textContent[this.textContent.length - 1].time;
}

lyricParser.prototype.parser = function (lyric) {
    let self = this,
        textContent = [];
    let textArr = this.lyricStr.match(/(\[\d{2}:\d{2}\.\d{2}\])(.[^\[\]]*)?/g);
    if(textArr&&textArr.length){
        textArr.forEach(function (c, i) {
            /^(\[\d{2}:\d{2}\.\d{2}\])(.[^\[\]]*)?$/.exec(c);
            let lineItem = { line: i + 1, text: RegExp.$2, time: self.timeParser(RegExp.$1) }
            textContent.push(lineItem)
        })
    }else{
        self.noLyric = true;
    }
    return textContent
}

lyricParser.prototype.timeParser = function (timeStr) {
    let arr = timeStr.match(/\[(.+?)\]/)[1].split(/[^0-9]+/);
    return arr[0] * 60000 + arr[1] * 1000 + arr[2] * 10
}

lyricParser.prototype.play = function (startTime = 0) {
    this.playing = true;
    this.line++;
    let curLine = this.textContent[this.line],
    self = this;
    self.timer && clearTimeout(self.timer);
    if (curLine) {
        self.timer = setTimeout(function () {
            if (self.playing) {
                self.curTime = curLine.time;
                self.fn(curLine.line, curLine.text);
                self.play(self.curTime);
            } else {
                self.line--;
            }
        }, curLine.time - startTime);
    }
}

lyricParser.prototype.pause = function () {
    this.playing = false;
}

lyricParser.prototype.seek = function (seekTime = 0) {
    let self = this;
    self.curTime = seekTime;
    self.timer && clearTimeout(self.timer);
    self.timer = null;
    self.textContent.reduce(function (pre, cur, i, arr) {
        try {
            if (seekTime >= pre.time && seekTime < cur.time) {
                self.line = i - 1;
                self.fn(arr[i - 1].line, arr[i - 1].text)
                throw new Error('break')
            } else {
                return cur
            }
        } catch (e) {
            return
        }
    })
    return this
}