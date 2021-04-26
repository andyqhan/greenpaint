function convertToJson(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    console.log(bytes);
    let puz = new PuzReader(bytes).toJson();
    return puz;
}

class PuzReader {
    // The skeleton of this class is from Phil's (GPL) files.js: https://github.com/keiranking/Phil/blob/master/files.js
    // However, I added circle support and rebus support, with help from AcrossLiteToText's source code and some
    // documentation on this horrible binary format from here: https://code.google.com/archive/p/puz/wikis/FileFormat.wiki
    constructor(buf) {
        this.buf = buf;
    }

    readShort(ix) {
        return this.buf[ix] | (this.buf[ix + 1] << 8);
    }

    readString() {
        let result = [];
        let t = true;
        while (t) {
            let c = this.buf[this.ix++];
            if (c == 0) break;
            result.push(String.fromCodePoint(c));
        }
        return result.join('');
    }

    // readStringFrom(start) {
    //     let result = [];
    //     let i = start;
    //     let c = this.buf[i];
    //     let circleCount = 0;
    //     while (i < this.buf.length) {
    //         result.push(String.fromCodePoint(c));
    //         if (c == 0x80 || c == 0xC0) {
    //             circleCount++;
    //             console.log(`Found 0x80 or 0xC0 at ${c}`);
    //         }
    //         console.log(c);
    //         i++;
    //         c = this.buf[i];
    //     }
    //     console.log(result.length);
    //     console.log(circleCount);
    //     return result.join('');
    // }

    findSpecialRegions() {
        // return the position of GEXT, GRBS, RTBL
        let posObj = {};
        let nameArr = [];
        for (let i = 0; i < this.buf.length - (0x34 + 4); i++) {
            if (!posObj.gext && String.fromCodePoint(this.buf[0x34 + i]) == 'G' && String.fromCodePoint(this.buf[0x34 + i + 1]) == 'E' && String.fromCodePoint(this.buf[0x34 + i + 2]) == 'X' && String.fromCodePoint(this.buf[0x34 + i + 3]) == 'T') {
                posObj.gext = i;
                nameArr.push('gext');
            }
            if (!posObj.grbs && String.fromCodePoint(this.buf[0x34 + i]) == 'G' && String.fromCodePoint(this.buf[0x34 + i + 1]) == 'R' && String.fromCodePoint(this.buf[0x34 + i + 2]) == 'B' && String.fromCodePoint(this.buf[0x34 + i + 3]) == 'S') {
                posObj.grbs = i;
                nameArr.push('grbs');
            }
            if (!posObj.rtbl && String.fromCodePoint(this.buf[0x34 + i]) == 'R' && String.fromCodePoint(this.buf[0x34 + i + 1]) == 'T' && String.fromCodePoint(this.buf[0x34 + i + 2]) == 'B' && String.fromCodePoint(this.buf[0x34 + i + 3]) == 'L') {
                posObj.rtbl = i;
                nameArr.push('rtbl');
            }
            if (!posObj.ltim && String.fromCodePoint(this.buf[0x34 + i]) == 'L' && String.fromCodePoint(this.buf[0x34 + i + 1]) == 'T' && String.fromCodePoint(this.buf[0x34 + i + 2]) == 'I' && String.fromCodePoint(this.buf[0x34 + i + 3]) == 'M') {
                posObj.ltim = i;
                nameArr.push('ltim');
            }
            if (!posObj.rusr && String.fromCodePoint(this.buf[0x34 + i]) == 'R' && String.fromCodePoint(this.buf[0x34 + i + 1]) == 'U' && String.fromCodePoint(this.buf[0x34 + i + 2]) == 'S' && String.fromCodePoint(this.buf[0x34 + i + 3]) == 'R') {
                posObj.rusr = i;
                nameArr.push('rusr');
            }
        }
        // indexArr and nameArr are in the order that the regions were found
        this.specialRegionOrder = nameArr;
        this.specialRegionIndices = posObj;
        return; 
    }

    findCircles() {
        // Return the positions of the circled squares
        let w = this.buf[0x2c];
        let h = this.buf[0x2d];
        if (this.specialRegionIndices.gext) {
            let startCircles = 0x34 + this.specialRegionIndices.gext + 8;
            let pos = [];
            // console.log(`startCircles: ${startCircles}; buf length: ${this.buf.length}`);
            for (let j = startCircles; j<this.buf.length; j++) {
                if (this.buf[j] == 0x80 || this.buf[j] == 0xC0) {
                    // the google code archive docs say that only 0x80 is circle, but acrosslite to
                    // text also uses 0xC0. Without 0xC0, we don't get circles in filled .puz files
                    pos.push(j - startCircles);
                }
                if (j - startCircles === w*h) {
                    // this break might be too eager; i'm not sure how long GEXT is supposed to be (hopefully w*h)
                    break;
                }
            }
            return pos;
        }
        // console.log('No circles found');
        return;
    }

    findRebusTable() {
        // return an object containing the keys and values of rtbl
        if (this.specialRegionIndices.rtbl) {
            let startRtbl = 0x34 + this.specialRegionIndices.rtbl + 8;
            let tblArr = []; 
            for (let i = startRtbl; i<this.buf.length; i++) {
                if (this.buf[i] == 0) break;  // end of rtbl section probably
                tblArr.push(String.fromCodePoint(this.buf[i]));
            }
            // convert the array to a string, and then to an object
            // TODO very inefficient lol
            let tblEntries = tblArr.join('')
                                   .split(';')  // separated by ;
                                   .slice(0, -1);  // remove last empty element (always ends with ;)
            let tblObj = {};
            for (let j = 0; j<tblEntries.length; j++) {
                let pair = tblEntries[j].trim();  // if key is one digit there's whitespace
                let pairArr = pair.split(':');
                tblObj[pairArr[0]] = pairArr[1];  // pairArr[0] is a string containing a number
            }
            // console.log(tblObj);
            return tblObj;
        }
        return;
    }

    findRebus() {
        // return object with keys the index of the letter that needs to be
        // changed to a number and values the number to change it to
        let w = this.buf[0x2c];
        let h = this.buf[0x2d];
        if (this.specialRegionIndices.grbs) {
            let startGrbs = 0x34 + this.specialRegionIndices.grbs + 8;
            let out = {};
            for (let i = startGrbs; i<this.buf.length; i++) {
                if (this.buf[i] == 0) continue;  // 0 means no rebus
                if (i - startGrbs >= w*h) break;  // google code archive says grbs doesn't track blocks but it does?
                let thisCode = this.buf[i] - 1;
                out[`${i-startGrbs}`] = thisCode;
            }
            // console.log(out);
            return out;
        }
        return;
    }

    toJson() {
        let json = {};
        let w = this.buf[0x2c];
        let h = this.buf[0x2d];
        let scrambled = this.readShort(0x32);
        if (scrambled & 0x0004) {
            console.error("Can't read scrambled puzzle");
            return;
        }
        json.Size = {Cols: w, Rows: h};

        let grid = [];
        for (let i = 0; i < w * h; i++) {
            grid.push(String.fromCodePoint(this.buf[0x34 + i]));
        }
        this.findSpecialRegions();

        // add circled squares to grid
        let circles = this.findCircles();
        if (circles && circles.length !== 0) {
            for (let c = 0; c < circles.length; c++) {
                grid[circles[c]] = grid[circles[c]].toLowerCase();
            }
            json.HasCircles = true;
        } else {
            json.HasCircles = false;
        }

        let rebusTable = this.findRebusTable();
        let rebus = this.findRebus();
        if (rebus && rebusTable) {
            // add rebus to grid
            let singleLetterAns = {};  // keeps track of original letters in the rebus. keys are the rebus code; values the original letter
            for (let rebusIndex in rebus) {
                // change letters to numbers
                singleLetterAns[`${rebus[rebusIndex]}`] = grid[rebusIndex];
                grid[rebusIndex] = `${rebus[rebusIndex]}`;
            }
            // add rebus to json
            let codes = '';
            for (let rebusCode in rebusTable) {
                codes += `${rebusCode}:${rebusTable[rebusCode]}:${singleLetterAns[rebusCode]}`;
            }
            json.IsRebus = { Codes: codes, IsRebus: true };
        }

        let newGrid = [];
        for (let r = 0; r < h; r++) {
            let row = grid.slice(r*w, (r*w)+w).join('');
            newGrid.push({ Row: row });
        }
        json.Grid = newGrid;
        this.ix = 0x34 + 2 * w * h;
        json.Title = this.readString();
        json.Author = this.readString();
        json.Copyright = this.readString();
        var across = [];
        var down = [];
        var label = 1;
        for (let i = 0; i < w * h; i++) {
            if (grid[i] == '.') continue;
            var inc = 0;
            if (i % w == 0 || grid[i - 1] == '.') {
                across.push({ Num: label, Clue: this.readString() });
                inc = 1;
            }
            if (i < w || grid[i - w] == '.') {
                down.push({ Num: label, Clue: this.readString() });
                inc = 1;
            }
            label += inc;
        }
        json.Across = across;
        json.Down = down;
        return json;
    }
}

module.exports = convertToJson;
