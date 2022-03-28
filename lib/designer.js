var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __pow = Math.pow;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/qrcode-generator/qrcode.js
var require_qrcode = __commonJS({
  "src/qrcode-generator/qrcode.js"(exports, module2) {
    var qrcode2 = function() {
      var qrcode3 = function(typeNumber, errorCorrectionLevel) {
        var PAD0 = 236;
        var PAD1 = 17;
        var _typeNumber = typeNumber;
        var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
        var _modules = null;
        var _moduleCount = 0;
        var _dataCache = null;
        var _dataList = [];
        var _this = {};
        var makeImpl = function(test, maskPattern) {
          _moduleCount = _typeNumber * 4 + 17;
          _modules = function(moduleCount) {
            var modules = new Array(moduleCount);
            for (var row = 0; row < moduleCount; row += 1) {
              modules[row] = new Array(moduleCount);
              for (var col = 0; col < moduleCount; col += 1) {
                modules[row][col] = null;
              }
            }
            return modules;
          }(_moduleCount);
          setupPositionProbePattern(0, 0);
          setupPositionProbePattern(_moduleCount - 7, 0);
          setupPositionProbePattern(0, _moduleCount - 7);
          setupPositionAdjustPattern();
          setupTimingPattern();
          setupTypeInfo(test, maskPattern);
          if (_typeNumber >= 7) {
            setupTypeNumber(test);
          }
          if (_dataCache == null) {
            _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
          }
          mapData(_dataCache, maskPattern);
        };
        var setupPositionProbePattern = function(row, col) {
          for (var r = -1; r <= 7; r += 1) {
            if (row + r <= -1 || _moduleCount <= row + r)
              continue;
            for (var c = -1; c <= 7; c += 1) {
              if (col + c <= -1 || _moduleCount <= col + c)
                continue;
              if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        };
        var getBestMaskPattern = function() {
          var minLostPoint = 0;
          var pattern = 0;
          for (var i = 0; i < 8; i += 1) {
            makeImpl(true, i);
            var lostPoint = QRUtil.getLostPoint(_this);
            if (i == 0 || minLostPoint > lostPoint) {
              minLostPoint = lostPoint;
              pattern = i;
            }
          }
          return pattern;
        };
        var setupTimingPattern = function() {
          for (var r = 8; r < _moduleCount - 8; r += 1) {
            if (_modules[r][6] != null) {
              continue;
            }
            _modules[r][6] = r % 2 == 0;
          }
          for (var c = 8; c < _moduleCount - 8; c += 1) {
            if (_modules[6][c] != null) {
              continue;
            }
            _modules[6][c] = c % 2 == 0;
          }
        };
        var setupPositionAdjustPattern = function() {
          var pos = QRUtil.getPatternPosition(_typeNumber);
          for (var i = 0; i < pos.length; i += 1) {
            for (var j = 0; j < pos.length; j += 1) {
              var row = pos[i];
              var col = pos[j];
              if (_modules[row][col] != null) {
                continue;
              }
              for (var r = -2; r <= 2; r += 1) {
                for (var c = -2; c <= 2; c += 1) {
                  if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
                    _modules[row + r][col + c] = true;
                  } else {
                    _modules[row + r][col + c] = false;
                  }
                }
              }
            }
          }
        };
        var setupTypeNumber = function(test) {
          var bits = QRUtil.getBCHTypeNumber(_typeNumber);
          for (var i = 0; i < 18; i += 1) {
            var mod = !test && (bits >> i & 1) == 1;
            _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
          }
          for (var i = 0; i < 18; i += 1) {
            var mod = !test && (bits >> i & 1) == 1;
            _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
          }
        };
        var setupTypeInfo = function(test, maskPattern) {
          var data = _errorCorrectionLevel << 3 | maskPattern;
          var bits = QRUtil.getBCHTypeInfo(data);
          for (var i = 0; i < 15; i += 1) {
            var mod = !test && (bits >> i & 1) == 1;
            if (i < 6) {
              _modules[i][8] = mod;
            } else if (i < 8) {
              _modules[i + 1][8] = mod;
            } else {
              _modules[_moduleCount - 15 + i][8] = mod;
            }
          }
          for (var i = 0; i < 15; i += 1) {
            var mod = !test && (bits >> i & 1) == 1;
            if (i < 8) {
              _modules[8][_moduleCount - i - 1] = mod;
            } else if (i < 9) {
              _modules[8][15 - i - 1 + 1] = mod;
            } else {
              _modules[8][15 - i - 1] = mod;
            }
          }
          _modules[_moduleCount - 8][8] = !test;
        };
        var mapData = function(data, maskPattern) {
          var inc = -1;
          var row = _moduleCount - 1;
          var bitIndex = 7;
          var byteIndex = 0;
          var maskFunc = QRUtil.getMaskFunction(maskPattern);
          for (var col = _moduleCount - 1; col > 0; col -= 2) {
            if (col == 6)
              col -= 1;
            while (true) {
              for (var c = 0; c < 2; c += 1) {
                if (_modules[row][col - c] == null) {
                  var dark = false;
                  if (byteIndex < data.length) {
                    dark = (data[byteIndex] >>> bitIndex & 1) == 1;
                  }
                  var mask = maskFunc(row, col - c);
                  if (mask) {
                    dark = !dark;
                  }
                  _modules[row][col - c] = dark;
                  bitIndex -= 1;
                  if (bitIndex == -1) {
                    byteIndex += 1;
                    bitIndex = 7;
                  }
                }
              }
              row += inc;
              if (row < 0 || _moduleCount <= row) {
                row -= inc;
                inc = -inc;
                break;
              }
            }
          }
        };
        var createBytes = function(buffer, rsBlocks) {
          var offset = 0;
          var maxDcCount = 0;
          var maxEcCount = 0;
          var dcdata = new Array(rsBlocks.length);
          var ecdata = new Array(rsBlocks.length);
          for (var r = 0; r < rsBlocks.length; r += 1) {
            var dcCount = rsBlocks[r].dataCount;
            var ecCount = rsBlocks[r].totalCount - dcCount;
            maxDcCount = Math.max(maxDcCount, dcCount);
            maxEcCount = Math.max(maxEcCount, ecCount);
            dcdata[r] = new Array(dcCount);
            for (var i = 0; i < dcdata[r].length; i += 1) {
              dcdata[r][i] = 255 & buffer.getBuffer()[i + offset];
            }
            offset += dcCount;
            var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
            var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);
            var modPoly = rawPoly.mod(rsPoly);
            ecdata[r] = new Array(rsPoly.getLength() - 1);
            for (var i = 0; i < ecdata[r].length; i += 1) {
              var modIndex = i + modPoly.getLength() - ecdata[r].length;
              ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
            }
          }
          var totalCodeCount = 0;
          for (var i = 0; i < rsBlocks.length; i += 1) {
            totalCodeCount += rsBlocks[i].totalCount;
          }
          var data = new Array(totalCodeCount);
          var index = 0;
          for (var i = 0; i < maxDcCount; i += 1) {
            for (var r = 0; r < rsBlocks.length; r += 1) {
              if (i < dcdata[r].length) {
                data[index] = dcdata[r][i];
                index += 1;
              }
            }
          }
          for (var i = 0; i < maxEcCount; i += 1) {
            for (var r = 0; r < rsBlocks.length; r += 1) {
              if (i < ecdata[r].length) {
                data[index] = ecdata[r][i];
                index += 1;
              }
            }
          }
          return data;
        };
        var createData = function(typeNumber2, errorCorrectionLevel2, dataList) {
          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, errorCorrectionLevel2);
          var buffer = qrBitBuffer();
          for (var i = 0; i < dataList.length; i += 1) {
            var data = dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
            data.write(buffer);
          }
          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i += 1) {
            totalDataCount += rsBlocks[i].dataCount;
          }
          if (buffer.getLengthInBits() > totalDataCount * 8) {
            throw "code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")";
          }
          if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
            buffer.put(0, 4);
          }
          while (buffer.getLengthInBits() % 8 != 0) {
            buffer.putBit(false);
          }
          while (true) {
            if (buffer.getLengthInBits() >= totalDataCount * 8) {
              break;
            }
            buffer.put(PAD0, 8);
            if (buffer.getLengthInBits() >= totalDataCount * 8) {
              break;
            }
            buffer.put(PAD1, 8);
          }
          return createBytes(buffer, rsBlocks);
        };
        _this.addData = function(data, mode) {
          mode = mode || "Byte";
          var newData = null;
          switch (mode) {
            case "Numeric":
              newData = qrNumber(data);
              break;
            case "Alphanumeric":
              newData = qrAlphaNum(data);
              break;
            case "Byte":
              newData = qr8BitByte(data);
              break;
            case "Kanji":
              newData = qrKanji(data);
              break;
            default:
              throw "mode:" + mode;
          }
          _dataList.push(newData);
          _dataCache = null;
        };
        _this.isDark = function(row, col) {
          if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
            throw row + "," + col;
          }
          return _modules[row][col];
        };
        _this.getModuleCount = function() {
          return _moduleCount;
        };
        _this.make = function() {
          if (_typeNumber < 1) {
            var typeNumber2 = 1;
            for (; typeNumber2 < 40; typeNumber2++) {
              var rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, _errorCorrectionLevel);
              var buffer = qrBitBuffer();
              for (var i = 0; i < _dataList.length; i++) {
                var data = _dataList[i];
                buffer.put(data.getMode(), 4);
                buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
                data.write(buffer);
              }
              var totalDataCount = 0;
              for (var i = 0; i < rsBlocks.length; i++) {
                totalDataCount += rsBlocks[i].dataCount;
              }
              if (buffer.getLengthInBits() <= totalDataCount * 8) {
                break;
              }
            }
            _typeNumber = typeNumber2;
          }
          makeImpl(false, getBestMaskPattern());
        };
        _this.createTableTag = function(cellSize, margin) {
          cellSize = cellSize || 2;
          margin = typeof margin == "undefined" ? cellSize * 4 : margin;
          var qrHtml = "";
          qrHtml += '<table style="';
          qrHtml += " border-width: 0px; border-style: none;";
          qrHtml += " border-collapse: collapse;";
          qrHtml += " padding: 0px; margin: " + margin + "px;";
          qrHtml += '">';
          qrHtml += "<tbody>";
          for (var r = 0; r < _this.getModuleCount(); r += 1) {
            qrHtml += "<tr>";
            for (var c = 0; c < _this.getModuleCount(); c += 1) {
              qrHtml += '<td style="';
              qrHtml += " border-width: 0px; border-style: none;";
              qrHtml += " border-collapse: collapse;";
              qrHtml += " padding: 0px; margin: 0px;";
              qrHtml += " width: " + cellSize + "px;";
              qrHtml += " height: " + cellSize + "px;";
              qrHtml += " background-color: ";
              qrHtml += _this.isDark(r, c) ? "#000000" : "#ffffff";
              qrHtml += ";";
              qrHtml += '"/>';
            }
            qrHtml += "</tr>";
          }
          qrHtml += "</tbody>";
          qrHtml += "</table>";
          return qrHtml;
        };
        _this.createSvgTag = function(cellSize, margin, alt, title) {
          var opts = {};
          if (typeof arguments[0] == "object") {
            opts = arguments[0];
            cellSize = opts.cellSize;
            margin = opts.margin;
            alt = opts.alt;
            title = opts.title;
          }
          cellSize = cellSize || 2;
          margin = typeof margin == "undefined" ? cellSize * 4 : margin;
          alt = typeof alt === "string" ? { text: alt } : alt || {};
          alt.text = alt.text || null;
          alt.id = alt.text ? alt.id || "qrcode-description" : null;
          title = typeof title === "string" ? { text: title } : title || {};
          title.text = title.text || null;
          title.id = title.text ? title.id || "qrcode-title" : null;
          var size = _this.getModuleCount() * cellSize + margin * 2;
          var c, mc, r, mr, qrSvg = "", rect;
          rect = "l" + cellSize + ",0 0," + cellSize + " -" + cellSize + ",0 0,-" + cellSize + "z ";
          qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
          qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : "";
          qrSvg += ' viewBox="0 0 ' + size + " " + size + '" ';
          qrSvg += ' preserveAspectRatio="xMinYMin meet"';
          qrSvg += title.text || alt.text ? ' role="img" aria-labelledby="' + escapeXml([title.id, alt.id].join(" ").trim()) + '"' : "";
          qrSvg += ">";
          qrSvg += title.text ? '<title id="' + escapeXml(title.id) + '">' + escapeXml(title.text) + "</title>" : "";
          qrSvg += alt.text ? '<description id="' + escapeXml(alt.id) + '">' + escapeXml(alt.text) + "</description>" : "";
          qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
          qrSvg += '<path d="';
          for (r = 0; r < _this.getModuleCount(); r += 1) {
            mr = r * cellSize + margin;
            for (c = 0; c < _this.getModuleCount(); c += 1) {
              if (_this.isDark(r, c)) {
                mc = c * cellSize + margin;
                qrSvg += "M" + mc + "," + mr + rect;
              }
            }
          }
          qrSvg += '" stroke="transparent" fill="black"/>';
          qrSvg += "</svg>";
          return qrSvg;
        };
        _this.createDataURL = function(cellSize, margin) {
          cellSize = cellSize || 2;
          margin = typeof margin == "undefined" ? cellSize * 4 : margin;
          var size = _this.getModuleCount() * cellSize + margin * 2;
          var min = margin;
          var max = size - margin;
          return createDataURL(size, size, function(x, y) {
            if (min <= x && x < max && min <= y && y < max) {
              var c = Math.floor((x - min) / cellSize);
              var r = Math.floor((y - min) / cellSize);
              return _this.isDark(r, c) ? 0 : 1;
            } else {
              return 1;
            }
          });
        };
        _this.createImgTag = function(cellSize, margin, alt) {
          cellSize = cellSize || 2;
          margin = typeof margin == "undefined" ? cellSize * 4 : margin;
          var size = _this.getModuleCount() * cellSize + margin * 2;
          var img = "";
          img += "<img";
          img += ' src="';
          img += _this.createDataURL(cellSize, margin);
          img += '"';
          img += ' width="';
          img += size;
          img += '"';
          img += ' height="';
          img += size;
          img += '"';
          if (alt) {
            img += ' alt="';
            img += escapeXml(alt);
            img += '"';
          }
          img += "/>";
          return img;
        };
        var escapeXml = function(s) {
          var escaped = "";
          for (var i = 0; i < s.length; i += 1) {
            var c = s.charAt(i);
            switch (c) {
              case "<":
                escaped += "&lt;";
                break;
              case ">":
                escaped += "&gt;";
                break;
              case "&":
                escaped += "&amp;";
                break;
              case '"':
                escaped += "&quot;";
                break;
              default:
                escaped += c;
                break;
            }
          }
          return escaped;
        };
        var _createHalfASCII = function(margin) {
          var cellSize = 1;
          margin = typeof margin == "undefined" ? cellSize * 2 : margin;
          var size = _this.getModuleCount() * cellSize + margin * 2;
          var min = margin;
          var max = size - margin;
          var y, x, r1, r2, p;
          var blocks = {
            "\u2588\u2588": "\u2588",
            "\u2588 ": "\u2580",
            " \u2588": "\u2584",
            "  ": " "
          };
          var blocksLastLineNoMargin = {
            "\u2588\u2588": "\u2580",
            "\u2588 ": "\u2580",
            " \u2588": " ",
            "  ": " "
          };
          var ascii = "";
          for (y = 0; y < size; y += 2) {
            r1 = Math.floor((y - min) / cellSize);
            r2 = Math.floor((y + 1 - min) / cellSize);
            for (x = 0; x < size; x += 1) {
              p = "\u2588";
              if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
                p = " ";
              }
              if (min <= x && x < max && min <= y + 1 && y + 1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
                p += " ";
              } else {
                p += "\u2588";
              }
              ascii += margin < 1 && y + 1 >= max ? blocksLastLineNoMargin[p] : blocks[p];
            }
            ascii += "\n";
          }
          if (size % 2 && margin > 0) {
            return ascii.substring(0, ascii.length - size - 1) + Array(size + 1).join("\u2580");
          }
          return ascii.substring(0, ascii.length - 1);
        };
        _this.createASCII = function(cellSize, margin) {
          cellSize = cellSize || 1;
          if (cellSize < 2) {
            return _createHalfASCII(margin);
          }
          cellSize -= 1;
          margin = typeof margin == "undefined" ? cellSize * 2 : margin;
          var size = _this.getModuleCount() * cellSize + margin * 2;
          var min = margin;
          var max = size - margin;
          var y, x, r, p;
          var white = Array(cellSize + 1).join("\u2588\u2588");
          var black = Array(cellSize + 1).join("  ");
          var ascii = "";
          var line = "";
          for (y = 0; y < size; y += 1) {
            r = Math.floor((y - min) / cellSize);
            line = "";
            for (x = 0; x < size; x += 1) {
              p = 1;
              if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
                p = 0;
              }
              line += p ? white : black;
            }
            for (r = 0; r < cellSize; r += 1) {
              ascii += line + "\n";
            }
          }
          return ascii.substring(0, ascii.length - 1);
        };
        _this.renderTo2dContext = function(context, cellSize) {
          cellSize = cellSize || 2;
          var length = _this.getModuleCount();
          for (var row = 0; row < length; row++) {
            for (var col = 0; col < length; col++) {
              context.fillStyle = _this.isDark(row, col) ? "black" : "white";
              context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
            }
          }
        };
        return _this;
      };
      qrcode3.stringToBytesFuncs = {
        "default": function(s) {
          var bytes = [];
          for (var i = 0; i < s.length; i += 1) {
            var c = s.charCodeAt(i);
            bytes.push(c & 255);
          }
          return bytes;
        }
      };
      qrcode3.stringToBytes = qrcode3.stringToBytesFuncs["default"];
      qrcode3.createStringToBytes = function(unicodeData, numChars) {
        var unicodeMap = function() {
          var bin = base64DecodeInputStream(unicodeData);
          var read = function() {
            var b = bin.read();
            if (b == -1)
              throw "eof";
            return b;
          };
          var count = 0;
          var unicodeMap2 = {};
          while (true) {
            var b0 = bin.read();
            if (b0 == -1)
              break;
            var b1 = read();
            var b2 = read();
            var b3 = read();
            var k = String.fromCharCode(b0 << 8 | b1);
            var v = b2 << 8 | b3;
            unicodeMap2[k] = v;
            count += 1;
          }
          if (count != numChars) {
            throw count + " != " + numChars;
          }
          return unicodeMap2;
        }();
        var unknownChar = "?".charCodeAt(0);
        return function(s) {
          var bytes = [];
          for (var i = 0; i < s.length; i += 1) {
            var c = s.charCodeAt(i);
            if (c < 128) {
              bytes.push(c);
            } else {
              var b = unicodeMap[s.charAt(i)];
              if (typeof b == "number") {
                if ((b & 255) == b) {
                  bytes.push(b);
                } else {
                  bytes.push(b >>> 8);
                  bytes.push(b & 255);
                }
              } else {
                bytes.push(unknownChar);
              }
            }
          }
          return bytes;
        };
      };
      var QRMode = {
        MODE_NUMBER: 1 << 0,
        MODE_ALPHA_NUM: 1 << 1,
        MODE_8BIT_BYTE: 1 << 2,
        MODE_KANJI: 1 << 3
      };
      var QRErrorCorrectionLevel = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
      };
      var QRMaskPattern = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      };
      var QRUtil = function() {
        var PATTERN_POSITION_TABLE = [
          [],
          [6, 18],
          [6, 22],
          [6, 26],
          [6, 30],
          [6, 34],
          [6, 22, 38],
          [6, 24, 42],
          [6, 26, 46],
          [6, 28, 50],
          [6, 30, 54],
          [6, 32, 58],
          [6, 34, 62],
          [6, 26, 46, 66],
          [6, 26, 48, 70],
          [6, 26, 50, 74],
          [6, 30, 54, 78],
          [6, 30, 56, 82],
          [6, 30, 58, 86],
          [6, 34, 62, 90],
          [6, 28, 50, 72, 94],
          [6, 26, 50, 74, 98],
          [6, 30, 54, 78, 102],
          [6, 28, 54, 80, 106],
          [6, 32, 58, 84, 110],
          [6, 30, 58, 86, 114],
          [6, 34, 62, 90, 118],
          [6, 26, 50, 74, 98, 122],
          [6, 30, 54, 78, 102, 126],
          [6, 26, 52, 78, 104, 130],
          [6, 30, 56, 82, 108, 134],
          [6, 34, 60, 86, 112, 138],
          [6, 30, 58, 86, 114, 142],
          [6, 34, 62, 90, 118, 146],
          [6, 30, 54, 78, 102, 126, 150],
          [6, 24, 50, 76, 102, 128, 154],
          [6, 28, 54, 80, 106, 132, 158],
          [6, 32, 58, 84, 110, 136, 162],
          [6, 26, 54, 82, 110, 138, 166],
          [6, 30, 58, 86, 114, 142, 170]
        ];
        var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
        var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
        var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
        var _this = {};
        var getBCHDigit = function(data) {
          var digit = 0;
          while (data != 0) {
            digit += 1;
            data >>>= 1;
          }
          return digit;
        };
        _this.getBCHTypeInfo = function(data) {
          var d = data << 10;
          while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
            d ^= G15 << getBCHDigit(d) - getBCHDigit(G15);
          }
          return (data << 10 | d) ^ G15_MASK;
        };
        _this.getBCHTypeNumber = function(data) {
          var d = data << 12;
          while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
            d ^= G18 << getBCHDigit(d) - getBCHDigit(G18);
          }
          return data << 12 | d;
        };
        _this.getPatternPosition = function(typeNumber) {
          return PATTERN_POSITION_TABLE[typeNumber - 1];
        };
        _this.getMaskFunction = function(maskPattern) {
          switch (maskPattern) {
            case QRMaskPattern.PATTERN000:
              return function(i, j) {
                return (i + j) % 2 == 0;
              };
            case QRMaskPattern.PATTERN001:
              return function(i, j) {
                return i % 2 == 0;
              };
            case QRMaskPattern.PATTERN010:
              return function(i, j) {
                return j % 3 == 0;
              };
            case QRMaskPattern.PATTERN011:
              return function(i, j) {
                return (i + j) % 3 == 0;
              };
            case QRMaskPattern.PATTERN100:
              return function(i, j) {
                return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
              };
            case QRMaskPattern.PATTERN101:
              return function(i, j) {
                return i * j % 2 + i * j % 3 == 0;
              };
            case QRMaskPattern.PATTERN110:
              return function(i, j) {
                return (i * j % 2 + i * j % 3) % 2 == 0;
              };
            case QRMaskPattern.PATTERN111:
              return function(i, j) {
                return (i * j % 3 + (i + j) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + maskPattern;
          }
        };
        _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
          var a = qrPolynomial([1], 0);
          for (var i = 0; i < errorCorrectLength; i += 1) {
            a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
          }
          return a;
        };
        _this.getLengthInBits = function(mode, type) {
          if (1 <= type && type < 10) {
            switch (mode) {
              case QRMode.MODE_NUMBER:
                return 10;
              case QRMode.MODE_ALPHA_NUM:
                return 9;
              case QRMode.MODE_8BIT_BYTE:
                return 8;
              case QRMode.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + mode;
            }
          } else if (type < 27) {
            switch (mode) {
              case QRMode.MODE_NUMBER:
                return 12;
              case QRMode.MODE_ALPHA_NUM:
                return 11;
              case QRMode.MODE_8BIT_BYTE:
                return 16;
              case QRMode.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + mode;
            }
          } else if (type < 41) {
            switch (mode) {
              case QRMode.MODE_NUMBER:
                return 14;
              case QRMode.MODE_ALPHA_NUM:
                return 13;
              case QRMode.MODE_8BIT_BYTE:
                return 16;
              case QRMode.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + mode;
            }
          } else {
            throw "type:" + type;
          }
        };
        _this.getLostPoint = function(qrcode4) {
          var moduleCount = qrcode4.getModuleCount();
          var lostPoint = 0;
          for (var row = 0; row < moduleCount; row += 1) {
            for (var col = 0; col < moduleCount; col += 1) {
              var sameCount = 0;
              var dark = qrcode4.isDark(row, col);
              for (var r = -1; r <= 1; r += 1) {
                if (row + r < 0 || moduleCount <= row + r) {
                  continue;
                }
                for (var c = -1; c <= 1; c += 1) {
                  if (col + c < 0 || moduleCount <= col + c) {
                    continue;
                  }
                  if (r == 0 && c == 0) {
                    continue;
                  }
                  if (dark == qrcode4.isDark(row + r, col + c)) {
                    sameCount += 1;
                  }
                }
              }
              if (sameCount > 5) {
                lostPoint += 3 + sameCount - 5;
              }
            }
          }
          ;
          for (var row = 0; row < moduleCount - 1; row += 1) {
            for (var col = 0; col < moduleCount - 1; col += 1) {
              var count = 0;
              if (qrcode4.isDark(row, col))
                count += 1;
              if (qrcode4.isDark(row + 1, col))
                count += 1;
              if (qrcode4.isDark(row, col + 1))
                count += 1;
              if (qrcode4.isDark(row + 1, col + 1))
                count += 1;
              if (count == 0 || count == 4) {
                lostPoint += 3;
              }
            }
          }
          for (var row = 0; row < moduleCount; row += 1) {
            for (var col = 0; col < moduleCount - 6; col += 1) {
              if (qrcode4.isDark(row, col) && !qrcode4.isDark(row, col + 1) && qrcode4.isDark(row, col + 2) && qrcode4.isDark(row, col + 3) && qrcode4.isDark(row, col + 4) && !qrcode4.isDark(row, col + 5) && qrcode4.isDark(row, col + 6)) {
                lostPoint += 40;
              }
            }
          }
          for (var col = 0; col < moduleCount; col += 1) {
            for (var row = 0; row < moduleCount - 6; row += 1) {
              if (qrcode4.isDark(row, col) && !qrcode4.isDark(row + 1, col) && qrcode4.isDark(row + 2, col) && qrcode4.isDark(row + 3, col) && qrcode4.isDark(row + 4, col) && !qrcode4.isDark(row + 5, col) && qrcode4.isDark(row + 6, col)) {
                lostPoint += 40;
              }
            }
          }
          var darkCount = 0;
          for (var col = 0; col < moduleCount; col += 1) {
            for (var row = 0; row < moduleCount; row += 1) {
              if (qrcode4.isDark(row, col)) {
                darkCount += 1;
              }
            }
          }
          var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
          lostPoint += ratio * 10;
          return lostPoint;
        };
        return _this;
      }();
      var QRMath = function() {
        var EXP_TABLE = new Array(256);
        var LOG_TABLE = new Array(256);
        for (var i = 0; i < 8; i += 1) {
          EXP_TABLE[i] = 1 << i;
        }
        for (var i = 8; i < 256; i += 1) {
          EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
        }
        for (var i = 0; i < 255; i += 1) {
          LOG_TABLE[EXP_TABLE[i]] = i;
        }
        var _this = {};
        _this.glog = function(n) {
          if (n < 1) {
            throw "glog(" + n + ")";
          }
          return LOG_TABLE[n];
        };
        _this.gexp = function(n) {
          while (n < 0) {
            n += 255;
          }
          while (n >= 256) {
            n -= 255;
          }
          return EXP_TABLE[n];
        };
        return _this;
      }();
      function qrPolynomial(num, shift) {
        if (typeof num.length == "undefined") {
          throw num.length + "/" + shift;
        }
        var _num = function() {
          var offset = 0;
          while (offset < num.length && num[offset] == 0) {
            offset += 1;
          }
          var _num2 = new Array(num.length - offset + shift);
          for (var i = 0; i < num.length - offset; i += 1) {
            _num2[i] = num[i + offset];
          }
          return _num2;
        }();
        var _this = {};
        _this.getAt = function(index) {
          return _num[index];
        };
        _this.getLength = function() {
          return _num.length;
        };
        _this.multiply = function(e) {
          var num2 = new Array(_this.getLength() + e.getLength() - 1);
          for (var i = 0; i < _this.getLength(); i += 1) {
            for (var j = 0; j < e.getLength(); j += 1) {
              num2[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j)));
            }
          }
          return qrPolynomial(num2, 0);
        };
        _this.mod = function(e) {
          if (_this.getLength() - e.getLength() < 0) {
            return _this;
          }
          var ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e.getAt(0));
          var num2 = new Array(_this.getLength());
          for (var i = 0; i < _this.getLength(); i += 1) {
            num2[i] = _this.getAt(i);
          }
          for (var i = 0; i < e.getLength(); i += 1) {
            num2[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
          }
          return qrPolynomial(num2, 0).mod(e);
        };
        return _this;
      }
      ;
      var QRRSBlock = function() {
        var RS_BLOCK_TABLE = [
          [1, 26, 19],
          [1, 26, 16],
          [1, 26, 13],
          [1, 26, 9],
          [1, 44, 34],
          [1, 44, 28],
          [1, 44, 22],
          [1, 44, 16],
          [1, 70, 55],
          [1, 70, 44],
          [2, 35, 17],
          [2, 35, 13],
          [1, 100, 80],
          [2, 50, 32],
          [2, 50, 24],
          [4, 25, 9],
          [1, 134, 108],
          [2, 67, 43],
          [2, 33, 15, 2, 34, 16],
          [2, 33, 11, 2, 34, 12],
          [2, 86, 68],
          [4, 43, 27],
          [4, 43, 19],
          [4, 43, 15],
          [2, 98, 78],
          [4, 49, 31],
          [2, 32, 14, 4, 33, 15],
          [4, 39, 13, 1, 40, 14],
          [2, 121, 97],
          [2, 60, 38, 2, 61, 39],
          [4, 40, 18, 2, 41, 19],
          [4, 40, 14, 2, 41, 15],
          [2, 146, 116],
          [3, 58, 36, 2, 59, 37],
          [4, 36, 16, 4, 37, 17],
          [4, 36, 12, 4, 37, 13],
          [2, 86, 68, 2, 87, 69],
          [4, 69, 43, 1, 70, 44],
          [6, 43, 19, 2, 44, 20],
          [6, 43, 15, 2, 44, 16],
          [4, 101, 81],
          [1, 80, 50, 4, 81, 51],
          [4, 50, 22, 4, 51, 23],
          [3, 36, 12, 8, 37, 13],
          [2, 116, 92, 2, 117, 93],
          [6, 58, 36, 2, 59, 37],
          [4, 46, 20, 6, 47, 21],
          [7, 42, 14, 4, 43, 15],
          [4, 133, 107],
          [8, 59, 37, 1, 60, 38],
          [8, 44, 20, 4, 45, 21],
          [12, 33, 11, 4, 34, 12],
          [3, 145, 115, 1, 146, 116],
          [4, 64, 40, 5, 65, 41],
          [11, 36, 16, 5, 37, 17],
          [11, 36, 12, 5, 37, 13],
          [5, 109, 87, 1, 110, 88],
          [5, 65, 41, 5, 66, 42],
          [5, 54, 24, 7, 55, 25],
          [11, 36, 12, 7, 37, 13],
          [5, 122, 98, 1, 123, 99],
          [7, 73, 45, 3, 74, 46],
          [15, 43, 19, 2, 44, 20],
          [3, 45, 15, 13, 46, 16],
          [1, 135, 107, 5, 136, 108],
          [10, 74, 46, 1, 75, 47],
          [1, 50, 22, 15, 51, 23],
          [2, 42, 14, 17, 43, 15],
          [5, 150, 120, 1, 151, 121],
          [9, 69, 43, 4, 70, 44],
          [17, 50, 22, 1, 51, 23],
          [2, 42, 14, 19, 43, 15],
          [3, 141, 113, 4, 142, 114],
          [3, 70, 44, 11, 71, 45],
          [17, 47, 21, 4, 48, 22],
          [9, 39, 13, 16, 40, 14],
          [3, 135, 107, 5, 136, 108],
          [3, 67, 41, 13, 68, 42],
          [15, 54, 24, 5, 55, 25],
          [15, 43, 15, 10, 44, 16],
          [4, 144, 116, 4, 145, 117],
          [17, 68, 42],
          [17, 50, 22, 6, 51, 23],
          [19, 46, 16, 6, 47, 17],
          [2, 139, 111, 7, 140, 112],
          [17, 74, 46],
          [7, 54, 24, 16, 55, 25],
          [34, 37, 13],
          [4, 151, 121, 5, 152, 122],
          [4, 75, 47, 14, 76, 48],
          [11, 54, 24, 14, 55, 25],
          [16, 45, 15, 14, 46, 16],
          [6, 147, 117, 4, 148, 118],
          [6, 73, 45, 14, 74, 46],
          [11, 54, 24, 16, 55, 25],
          [30, 46, 16, 2, 47, 17],
          [8, 132, 106, 4, 133, 107],
          [8, 75, 47, 13, 76, 48],
          [7, 54, 24, 22, 55, 25],
          [22, 45, 15, 13, 46, 16],
          [10, 142, 114, 2, 143, 115],
          [19, 74, 46, 4, 75, 47],
          [28, 50, 22, 6, 51, 23],
          [33, 46, 16, 4, 47, 17],
          [8, 152, 122, 4, 153, 123],
          [22, 73, 45, 3, 74, 46],
          [8, 53, 23, 26, 54, 24],
          [12, 45, 15, 28, 46, 16],
          [3, 147, 117, 10, 148, 118],
          [3, 73, 45, 23, 74, 46],
          [4, 54, 24, 31, 55, 25],
          [11, 45, 15, 31, 46, 16],
          [7, 146, 116, 7, 147, 117],
          [21, 73, 45, 7, 74, 46],
          [1, 53, 23, 37, 54, 24],
          [19, 45, 15, 26, 46, 16],
          [5, 145, 115, 10, 146, 116],
          [19, 75, 47, 10, 76, 48],
          [15, 54, 24, 25, 55, 25],
          [23, 45, 15, 25, 46, 16],
          [13, 145, 115, 3, 146, 116],
          [2, 74, 46, 29, 75, 47],
          [42, 54, 24, 1, 55, 25],
          [23, 45, 15, 28, 46, 16],
          [17, 145, 115],
          [10, 74, 46, 23, 75, 47],
          [10, 54, 24, 35, 55, 25],
          [19, 45, 15, 35, 46, 16],
          [17, 145, 115, 1, 146, 116],
          [14, 74, 46, 21, 75, 47],
          [29, 54, 24, 19, 55, 25],
          [11, 45, 15, 46, 46, 16],
          [13, 145, 115, 6, 146, 116],
          [14, 74, 46, 23, 75, 47],
          [44, 54, 24, 7, 55, 25],
          [59, 46, 16, 1, 47, 17],
          [12, 151, 121, 7, 152, 122],
          [12, 75, 47, 26, 76, 48],
          [39, 54, 24, 14, 55, 25],
          [22, 45, 15, 41, 46, 16],
          [6, 151, 121, 14, 152, 122],
          [6, 75, 47, 34, 76, 48],
          [46, 54, 24, 10, 55, 25],
          [2, 45, 15, 64, 46, 16],
          [17, 152, 122, 4, 153, 123],
          [29, 74, 46, 14, 75, 47],
          [49, 54, 24, 10, 55, 25],
          [24, 45, 15, 46, 46, 16],
          [4, 152, 122, 18, 153, 123],
          [13, 74, 46, 32, 75, 47],
          [48, 54, 24, 14, 55, 25],
          [42, 45, 15, 32, 46, 16],
          [20, 147, 117, 4, 148, 118],
          [40, 75, 47, 7, 76, 48],
          [43, 54, 24, 22, 55, 25],
          [10, 45, 15, 67, 46, 16],
          [19, 148, 118, 6, 149, 119],
          [18, 75, 47, 31, 76, 48],
          [34, 54, 24, 34, 55, 25],
          [20, 45, 15, 61, 46, 16]
        ];
        var qrRSBlock = function(totalCount, dataCount) {
          var _this2 = {};
          _this2.totalCount = totalCount;
          _this2.dataCount = dataCount;
          return _this2;
        };
        var _this = {};
        var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {
          switch (errorCorrectionLevel) {
            case QRErrorCorrectionLevel.L:
              return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
            case QRErrorCorrectionLevel.M:
              return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
            case QRErrorCorrectionLevel.Q:
              return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
            case QRErrorCorrectionLevel.H:
              return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
            default:
              return void 0;
          }
        };
        _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {
          var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);
          if (typeof rsBlock == "undefined") {
            throw "bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel;
          }
          var length = rsBlock.length / 3;
          var list = [];
          for (var i = 0; i < length; i += 1) {
            var count = rsBlock[i * 3 + 0];
            var totalCount = rsBlock[i * 3 + 1];
            var dataCount = rsBlock[i * 3 + 2];
            for (var j = 0; j < count; j += 1) {
              list.push(qrRSBlock(totalCount, dataCount));
            }
          }
          return list;
        };
        return _this;
      }();
      var qrBitBuffer = function() {
        var _buffer = [];
        var _length = 0;
        var _this = {};
        _this.getBuffer = function() {
          return _buffer;
        };
        _this.getAt = function(index) {
          var bufIndex = Math.floor(index / 8);
          return (_buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
        };
        _this.put = function(num, length) {
          for (var i = 0; i < length; i += 1) {
            _this.putBit((num >>> length - i - 1 & 1) == 1);
          }
        };
        _this.getLengthInBits = function() {
          return _length;
        };
        _this.putBit = function(bit) {
          var bufIndex = Math.floor(_length / 8);
          if (_buffer.length <= bufIndex) {
            _buffer.push(0);
          }
          if (bit) {
            _buffer[bufIndex] |= 128 >>> _length % 8;
          }
          _length += 1;
        };
        return _this;
      };
      var qrNumber = function(data) {
        var _mode = QRMode.MODE_NUMBER;
        var _data = data;
        var _this = {};
        _this.getMode = function() {
          return _mode;
        };
        _this.getLength = function(buffer) {
          return _data.length;
        };
        _this.write = function(buffer) {
          var data2 = _data;
          var i = 0;
          while (i + 2 < data2.length) {
            buffer.put(strToNum(data2.substring(i, i + 3)), 10);
            i += 3;
          }
          if (i < data2.length) {
            if (data2.length - i == 1) {
              buffer.put(strToNum(data2.substring(i, i + 1)), 4);
            } else if (data2.length - i == 2) {
              buffer.put(strToNum(data2.substring(i, i + 2)), 7);
            }
          }
        };
        var strToNum = function(s) {
          var num = 0;
          for (var i = 0; i < s.length; i += 1) {
            num = num * 10 + chatToNum(s.charAt(i));
          }
          return num;
        };
        var chatToNum = function(c) {
          if ("0" <= c && c <= "9") {
            return c.charCodeAt(0) - "0".charCodeAt(0);
          }
          throw "illegal char :" + c;
        };
        return _this;
      };
      var qrAlphaNum = function(data) {
        var _mode = QRMode.MODE_ALPHA_NUM;
        var _data = data;
        var _this = {};
        _this.getMode = function() {
          return _mode;
        };
        _this.getLength = function(buffer) {
          return _data.length;
        };
        _this.write = function(buffer) {
          var s = _data;
          var i = 0;
          while (i + 1 < s.length) {
            buffer.put(getCode(s.charAt(i)) * 45 + getCode(s.charAt(i + 1)), 11);
            i += 2;
          }
          if (i < s.length) {
            buffer.put(getCode(s.charAt(i)), 6);
          }
        };
        var getCode = function(c) {
          if ("0" <= c && c <= "9") {
            return c.charCodeAt(0) - "0".charCodeAt(0);
          } else if ("A" <= c && c <= "Z") {
            return c.charCodeAt(0) - "A".charCodeAt(0) + 10;
          } else {
            switch (c) {
              case " ":
                return 36;
              case "$":
                return 37;
              case "%":
                return 38;
              case "*":
                return 39;
              case "+":
                return 40;
              case "-":
                return 41;
              case ".":
                return 42;
              case "/":
                return 43;
              case ":":
                return 44;
              default:
                throw "illegal char :" + c;
            }
          }
        };
        return _this;
      };
      var qr8BitByte = function(data) {
        var _mode = QRMode.MODE_8BIT_BYTE;
        var _data = data;
        var _bytes = qrcode3.stringToBytes(data);
        var _this = {};
        _this.getMode = function() {
          return _mode;
        };
        _this.getLength = function(buffer) {
          return _bytes.length;
        };
        _this.write = function(buffer) {
          for (var i = 0; i < _bytes.length; i += 1) {
            buffer.put(_bytes[i], 8);
          }
        };
        return _this;
      };
      var qrKanji = function(data) {
        var _mode = QRMode.MODE_KANJI;
        var _data = data;
        var stringToBytes = qrcode3.stringToBytesFuncs["SJIS"];
        if (!stringToBytes) {
          throw "sjis not supported.";
        }
        !function(c, code) {
          var test = stringToBytes(c);
          if (test.length != 2 || (test[0] << 8 | test[1]) != code) {
            throw "sjis not supported.";
          }
        }("\u53CB", 38726);
        var _bytes = stringToBytes(data);
        var _this = {};
        _this.getMode = function() {
          return _mode;
        };
        _this.getLength = function(buffer) {
          return ~~(_bytes.length / 2);
        };
        _this.write = function(buffer) {
          var data2 = _bytes;
          var i = 0;
          while (i + 1 < data2.length) {
            var c = (255 & data2[i]) << 8 | 255 & data2[i + 1];
            if (33088 <= c && c <= 40956) {
              c -= 33088;
            } else if (57408 <= c && c <= 60351) {
              c -= 49472;
            } else {
              throw "illegal char at " + (i + 1) + "/" + c;
            }
            c = (c >>> 8 & 255) * 192 + (c & 255);
            buffer.put(c, 13);
            i += 2;
          }
          if (i < data2.length) {
            throw "illegal char at " + (i + 1);
          }
        };
        return _this;
      };
      var byteArrayOutputStream = function() {
        var _bytes = [];
        var _this = {};
        _this.writeByte = function(b) {
          _bytes.push(b & 255);
        };
        _this.writeShort = function(i) {
          _this.writeByte(i);
          _this.writeByte(i >>> 8);
        };
        _this.writeBytes = function(b, off, len) {
          off = off || 0;
          len = len || b.length;
          for (var i = 0; i < len; i += 1) {
            _this.writeByte(b[i + off]);
          }
        };
        _this.writeString = function(s) {
          for (var i = 0; i < s.length; i += 1) {
            _this.writeByte(s.charCodeAt(i));
          }
        };
        _this.toByteArray = function() {
          return _bytes;
        };
        _this.toString = function() {
          var s = "";
          s += "[";
          for (var i = 0; i < _bytes.length; i += 1) {
            if (i > 0) {
              s += ",";
            }
            s += _bytes[i];
          }
          s += "]";
          return s;
        };
        return _this;
      };
      var base64EncodeOutputStream = function() {
        var _buffer = 0;
        var _buflen = 0;
        var _length = 0;
        var _base64 = "";
        var _this = {};
        var writeEncoded = function(b) {
          _base64 += String.fromCharCode(encode(b & 63));
        };
        var encode = function(n) {
          if (n < 0) {
          } else if (n < 26) {
            return 65 + n;
          } else if (n < 52) {
            return 97 + (n - 26);
          } else if (n < 62) {
            return 48 + (n - 52);
          } else if (n == 62) {
            return 43;
          } else if (n == 63) {
            return 47;
          }
          throw "n:" + n;
        };
        _this.writeByte = function(n) {
          _buffer = _buffer << 8 | n & 255;
          _buflen += 8;
          _length += 1;
          while (_buflen >= 6) {
            writeEncoded(_buffer >>> _buflen - 6);
            _buflen -= 6;
          }
        };
        _this.flush = function() {
          if (_buflen > 0) {
            writeEncoded(_buffer << 6 - _buflen);
            _buffer = 0;
            _buflen = 0;
          }
          if (_length % 3 != 0) {
            var padlen = 3 - _length % 3;
            for (var i = 0; i < padlen; i += 1) {
              _base64 += "=";
            }
          }
        };
        _this.toString = function() {
          return _base64;
        };
        return _this;
      };
      var base64DecodeInputStream = function(str) {
        var _str = str;
        var _pos = 0;
        var _buffer = 0;
        var _buflen = 0;
        var _this = {};
        _this.read = function() {
          while (_buflen < 8) {
            if (_pos >= _str.length) {
              if (_buflen == 0) {
                return -1;
              }
              throw "unexpected end of file./" + _buflen;
            }
            var c = _str.charAt(_pos);
            _pos += 1;
            if (c == "=") {
              _buflen = 0;
              return -1;
            } else if (c.match(/^\s$/)) {
              continue;
            }
            _buffer = _buffer << 6 | decode(c.charCodeAt(0));
            _buflen += 6;
          }
          var n = _buffer >>> _buflen - 8 & 255;
          _buflen -= 8;
          return n;
        };
        var decode = function(c) {
          if (65 <= c && c <= 90) {
            return c - 65;
          } else if (97 <= c && c <= 122) {
            return c - 97 + 26;
          } else if (48 <= c && c <= 57) {
            return c - 48 + 52;
          } else if (c == 43) {
            return 62;
          } else if (c == 47) {
            return 63;
          } else {
            throw "c:" + c;
          }
        };
        return _this;
      };
      var gifImage = function(width, height) {
        var _width = width;
        var _height = height;
        var _data = new Array(width * height);
        var _this = {};
        _this.setPixel = function(x, y, pixel) {
          _data[y * _width + x] = pixel;
        };
        _this.write = function(out) {
          out.writeString("GIF87a");
          out.writeShort(_width);
          out.writeShort(_height);
          out.writeByte(128);
          out.writeByte(0);
          out.writeByte(0);
          out.writeByte(0);
          out.writeByte(0);
          out.writeByte(0);
          out.writeByte(255);
          out.writeByte(255);
          out.writeByte(255);
          out.writeString(",");
          out.writeShort(0);
          out.writeShort(0);
          out.writeShort(_width);
          out.writeShort(_height);
          out.writeByte(0);
          var lzwMinCodeSize = 2;
          var raster = getLZWRaster(lzwMinCodeSize);
          out.writeByte(lzwMinCodeSize);
          var offset = 0;
          while (raster.length - offset > 255) {
            out.writeByte(255);
            out.writeBytes(raster, offset, 255);
            offset += 255;
          }
          out.writeByte(raster.length - offset);
          out.writeBytes(raster, offset, raster.length - offset);
          out.writeByte(0);
          out.writeString(";");
        };
        var bitOutputStream = function(out) {
          var _out = out;
          var _bitLength = 0;
          var _bitBuffer = 0;
          var _this2 = {};
          _this2.write = function(data, length) {
            if (data >>> length != 0) {
              throw "length over";
            }
            while (_bitLength + length >= 8) {
              _out.writeByte(255 & (data << _bitLength | _bitBuffer));
              length -= 8 - _bitLength;
              data >>>= 8 - _bitLength;
              _bitBuffer = 0;
              _bitLength = 0;
            }
            _bitBuffer = data << _bitLength | _bitBuffer;
            _bitLength = _bitLength + length;
          };
          _this2.flush = function() {
            if (_bitLength > 0) {
              _out.writeByte(_bitBuffer);
            }
          };
          return _this2;
        };
        var getLZWRaster = function(lzwMinCodeSize) {
          var clearCode = 1 << lzwMinCodeSize;
          var endCode = (1 << lzwMinCodeSize) + 1;
          var bitLength = lzwMinCodeSize + 1;
          var table = lzwTable();
          for (var i = 0; i < clearCode; i += 1) {
            table.add(String.fromCharCode(i));
          }
          table.add(String.fromCharCode(clearCode));
          table.add(String.fromCharCode(endCode));
          var byteOut = byteArrayOutputStream();
          var bitOut = bitOutputStream(byteOut);
          bitOut.write(clearCode, bitLength);
          var dataIndex = 0;
          var s = String.fromCharCode(_data[dataIndex]);
          dataIndex += 1;
          while (dataIndex < _data.length) {
            var c = String.fromCharCode(_data[dataIndex]);
            dataIndex += 1;
            if (table.contains(s + c)) {
              s = s + c;
            } else {
              bitOut.write(table.indexOf(s), bitLength);
              if (table.size() < 4095) {
                if (table.size() == 1 << bitLength) {
                  bitLength += 1;
                }
                table.add(s + c);
              }
              s = c;
            }
          }
          bitOut.write(table.indexOf(s), bitLength);
          bitOut.write(endCode, bitLength);
          bitOut.flush();
          return byteOut.toByteArray();
        };
        var lzwTable = function() {
          var _map = {};
          var _size = 0;
          var _this2 = {};
          _this2.add = function(key) {
            if (_this2.contains(key)) {
              throw "dup key:" + key;
            }
            _map[key] = _size;
            _size += 1;
          };
          _this2.size = function() {
            return _size;
          };
          _this2.indexOf = function(key) {
            return _map[key];
          };
          _this2.contains = function(key) {
            return typeof _map[key] != "undefined";
          };
          return _this2;
        };
        return _this;
      };
      var createDataURL = function(width, height, getPixel) {
        var gif = gifImage(width, height);
        for (var y = 0; y < height; y += 1) {
          for (var x = 0; x < width; x += 1) {
            gif.setPixel(x, y, getPixel(x, y));
          }
        }
        var b = byteArrayOutputStream();
        gif.write(b);
        var base64 = base64EncodeOutputStream();
        var bytes = b.toByteArray();
        for (var i = 0; i < bytes.length; i += 1) {
          base64.writeByte(bytes[i]);
        }
        base64.flush();
        return "data:image/gif;base64," + base64;
      };
      return qrcode3;
    }();
    !function() {
      qrcode2.stringToBytesFuncs["UTF-8"] = function(s) {
        function toUTF8Array(str) {
          var utf8 = [];
          for (var i = 0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 128)
              utf8.push(charcode);
            else if (charcode < 2048) {
              utf8.push(192 | charcode >> 6, 128 | charcode & 63);
            } else if (charcode < 55296 || charcode >= 57344) {
              utf8.push(224 | charcode >> 12, 128 | charcode >> 6 & 63, 128 | charcode & 63);
            } else {
              i++;
              charcode = 65536 + ((charcode & 1023) << 10 | str.charCodeAt(i) & 1023);
              utf8.push(240 | charcode >> 18, 128 | charcode >> 12 & 63, 128 | charcode >> 6 & 63, 128 | charcode & 63);
            }
          }
          return utf8;
        }
        return toUTF8Array(s);
      };
    }();
    (function(factory) {
      if (typeof define === "function" && define.amd) {
        define([], factory);
      } else if (typeof exports === "object") {
        module2.exports = factory();
      }
    })(function() {
      return qrcode2;
    });
    !function(qrcode3) {
      qrcode3.stringToBytes = qrcode3.stringToBytesFuncs["UTF-8"];
    }(qrcode2);
  }
});

// src/designer.ts
var designer_exports = {};
__export(designer_exports, {
  default: () => designer_default
});
module.exports = __toCommonJS(designer_exports);

// src/receiptline.ts
var iconv;
var PNG;
var stream;
var decoder;
var qrcode = require_qrcode();
var getLangEncoding = (lang) => {
  let encoding = "cp437";
  switch (lang.slice(0, 2)) {
    case "ja":
      encoding = "cp932";
      break;
    case "zh":
      encoding = /^zh-(tw|hk)/i.test(lang) ? "cp950" : "cp936";
      break;
    case "ko":
      encoding = "cp949";
      break;
  }
  return encoding;
};
function transform(doc, printer) {
  qrcode = qrcode || window.qrcode;
  const state = {
    wrap: true,
    border: 1,
    width: [],
    align: 1,
    option: {
      type: "code128",
      width: 2,
      height: 72,
      hri: false,
      cell: 3,
      level: "l"
    },
    line: "waiting",
    rules: {
      left: 0,
      width: 0,
      right: 0,
      widths: []
    }
  };
  const ptr = parseOption(printer);
  let result = ptr.command.open(ptr);
  if (doc[0] === "\uFEFF") {
    doc = doc.slice(1);
  }
  const res = doc.normalize().split(/\n|\r\n|\r/).map((line) => createLine(parseLine(line, state), ptr, state));
  switch (state.line) {
    case "ready":
      state.line = "waiting";
      break;
    case "running":
    case "horizontal":
      res.push(ptr.command.normal() + ptr.command.area(state.rules.left, state.rules.width, state.rules.right) + ptr.command.align(0) + ptr.command.vrstop(state.rules.widths) + ptr.command.vrlf(false));
      state.line = "waiting";
      break;
    default:
      break;
  }
  if (ptr.upsideDown) {
    res.reverse();
  }
  result += res.join("");
  result += ptr.command.close();
  return result;
}
function createTransform(printer) {
  const state = {
    wrap: true,
    border: 1,
    width: [],
    align: 1,
    option: {
      type: "code128",
      width: 2,
      height: 72,
      hri: false,
      cell: 3,
      level: "l"
    },
    line: "waiting",
    rules: {
      left: 0,
      width: 0,
      right: 0,
      widths: []
    }
  };
  const ptr = parseOption(printer);
  const transform2 = new stream.Transform({
    construct(callback) {
      this.bom = true;
      this.decoder = new decoder.StringDecoder("utf8");
      this.data = "";
      this.encoding = null;
      this._push = function(chunk) {
        if (chunk.length > 0) {
          if (!this.encoding) {
            this.encoding = /^<svg/.test(chunk) ? "utf8" : "binary";
          }
          this.push(chunk, this.encoding);
        }
      };
      this.buffer = [];
      this._push(ptr.command.open(ptr));
      callback();
    },
    transform(chunk, encoding, callback) {
      this.data += this.decoder.write(chunk);
      if (this.bom) {
        if (this.data[0] === "\uFEFF") {
          this.data = this.data.slice(1);
        }
        this.bom = false;
      }
      const lines = this.data.split(/\n|\r\n|\r/);
      while (lines.length > 1) {
        const s = createLine(parseLine(lines.shift().normalize(), state), ptr, state);
        ptr.upsideDown ? this.buffer.push(s) : this._push(s);
      }
      this.data = lines.shift();
      callback();
    },
    flush(callback) {
      const s = createLine(parseLine(this.data.normalize(), state), ptr, state);
      ptr.upsideDown ? this.buffer.push(s) : this._push(s);
      switch (state.line) {
        case "ready":
          state.line = "waiting";
          break;
        case "running":
        case "horizontal":
          const s2 = ptr.command.normal() + ptr.command.area(state.rules.left, state.rules.width, state.rules.right) + ptr.command.align(0) + ptr.command.vrstop(state.rules.widths) + ptr.command.vrlf(false);
          ptr.upsideDown ? this.buffer.push(s2) : this._push(s2);
          state.line = "waiting";
          break;
        default:
          break;
      }
      if (ptr.upsideDown) {
        this._push(this.buffer.reverse().join(""));
      }
      this._push(ptr.command.close());
      callback();
    }
  });
  return transform2;
}
function parseOption(printer) {
  const p = __spreadValues({}, printer);
  return {
    cpl: p.cpl || 48,
    encoding: /^(cp(437|85[28]|86[0356]|1252|93[26]|949|950)|multilingual|shiftjis|gb18030|ksc5601|big5)$/.test(p.encoding) ? p.encoding : "cp437",
    upsideDown: !!p.upsideDown,
    spacing: !!p.spacing,
    cutting: "cutting" in p ? !!p.cutting : true,
    gradient: "gradient" in p ? !!p.gradient : true,
    gamma: p.gamma || 1.8,
    threshold: p.threshold || 128,
    command: __spreadValues({}, (typeof p.command !== "object" ? commands[p.command] : p.command) || commands.svg)
  };
}
function parseLine(columns, state) {
  const line = columns.replace(/^[\t ]+|[\t ]+$/g, "").replace(/\\[\\{|}]/g, (match) => `\\x${match.charCodeAt(1).toString(16)}`).replace(/^[^|]*[^\t |]\|/, " $&").replace(/\|[^\t |][^|]*$/, "$& ").replace(/^\|(.*)$/, "$1").replace(/^(.*)\|$/, "$1").split("|").map((column, index, array) => {
    const result = {};
    const element = column.replace(/^[\t ]+|[\t ]+$/g, "");
    result.align = 1 + /^[\t ]/.test(column) - /[\t ]$/.test(column);
    if (/^\{[^{}]*\}$/.test(element)) {
      result.property = element.slice(1, -1).replace(/\\;/g, "\\x3b").split(";").reduce((obj, member) => {
        const abbr = {
          a: "align",
          b: "border",
          c: "code",
          i: "image",
          o: "option",
          t: "text",
          w: "width",
          x: "command",
          _: "comment"
        };
        if (!/^[\t ]*$/.test(member) && member.replace(/^[\t ]*([A-Za-z_]\w*)[\t ]*:[\t ]*([^\t ].*?)[\t ]*$/, (match, key, value) => obj[key.replace(/^[abciotwx_]$/, (m) => abbr[m])] = parseEscape(value.replace(/\\n/g, "\n"))) === member) {
          result.error = element;
        }
        return obj;
      }, {});
      if (array.length === 1) {
        if ("text" in result.property) {
          const c = result.property.text.toLowerCase();
          state.wrap = !/^nowrap$/.test(c);
        }
        if ("border" in result.property) {
          const c = result.property.border.toLowerCase();
          const border = { line: -1, space: 1, none: 0 };
          const previous = state.border;
          state.border = /^(line|space|none)$/.test(c) ? border[c.toLowerCase()] : /^\d+$/.test(c) && Number(c) <= 2 ? Number(c) : 1;
          if (previous >= 0 && state.border < 0) {
            result.vr = "+";
          }
          if (previous < 0 && state.border >= 0) {
            result.vr = "-";
          }
        }
        if ("width" in result.property) {
          const width = result.property.width.toLowerCase().split(/[\t ]+|,/);
          state.width = width.find((c) => /^auto$/.test(c)) ? [] : width.map((c) => /^\*$/.test(c) ? -1 : /^\d+$/.test(c) ? Number(c) : 0);
        }
        if ("align" in result.property) {
          const c = result.property.align.toLowerCase();
          const align = { left: 0, center: 1, right: 2 };
          state.align = /^(left|center|right)$/.test(c) ? align[c.toLowerCase()] : 1;
        }
        if ("option" in result.property) {
          const option = result.property.option.toLowerCase().split(/[\t ]+|,/);
          state.option = {
            type: option.find((c) => /^(upc|ean|jan|code39|itf|codabar|nw7|code93|code128|qrcode)$/.test(c)) || "code128",
            width: Number(option.find((c) => /^\d+$/.test(c) && Number(c) >= 2 && Number(c) <= 4) || "2"),
            height: Number(option.find((c) => /^\d+$/.test(c) && Number(c) >= 24 && Number(c) <= 240) || "72"),
            hri: !!option.find((c) => /^hri$/.test(c)),
            cell: Number(option.find((c) => /^\d+$/.test(c) && Number(c) >= 3 && Number(c) <= 8) || "3"),
            level: option.find((c) => /^[lmqh]$/.test(c)) || "l"
          };
        }
        if ("code" in result.property) {
          result.code = __spreadValues({ data: result.property.code }, state.option);
        }
        if ("image" in result.property) {
          result.image = result.property.image;
        }
        if ("command" in result.property) {
          result.command = result.property.command;
        }
        if ("comment" in result.property) {
          result.comment = result.property.comment;
        }
      }
    } else if (/[{}]/.test(element)) {
      result.error = element;
    } else if (array.length === 1 && /^-+$|^=+$/.test(element)) {
      result.hr = element.slice(-1);
    } else {
      result.text = element.replace(/[\x00-\x1f\x7f]|\\x[01][\dA-Fa-f]|\\x7[Ff]/g, "").replace(/\\[-=_"`^~]/g, (match) => `\\x${match.charCodeAt(1).toString(16)}`).replace(/\\n/g, "\n").replace(/~/g, " ").split(/([_"`\n]|\^+)/).map((text) => parseEscape(text));
    }
    result.wrap = state.wrap;
    result.border = state.border;
    if (state.width.length === 0) {
      result.width = -1;
    } else if ("text" in result) {
      result.width = index < state.width.length ? state.width[index] : 0;
    } else if (state.width.find((c) => c < 0)) {
      result.width = -1;
    } else {
      const w = state.width.filter((c) => c > 0);
      result.width = w.length > 0 ? w.reduce((a, c) => a + c, result.border < 0 ? w.length + 1 : (w.length - 1) * result.border) : 0;
    }
    result.alignment = state.align;
    return result;
  });
  if (line.every((el) => "text" in el) && state.width.length > 0) {
    while (line.length < state.width.length) {
      line.push({
        align: 1,
        text: [""],
        wrap: state.wrap,
        border: state.border,
        width: state.width[line.length]
      });
    }
  }
  return line;
}
function parseEscape(chars) {
  return chars.replace(/\\$|\\x(.?$|[^\dA-Fa-f].|.[^\dA-Fa-f])/g, "").replace(/\\[^x]/g, "").replace(/\\x([\dA-Fa-f]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
}
function createLine(line, printer, state) {
  const result = [];
  const text = line.every((el) => "text" in el);
  const column = line[0];
  let columns = line.filter((el) => el.width !== 0);
  if (text) {
    columns = columns.slice(0, Math.floor(column.border < 0 ? (printer.cpl - 1) / 2 : (printer.cpl + column.border) / (column.border + 1)));
  }
  const f = columns.filter((el) => el.width > 0);
  const g = columns.filter((el) => el.width < 0);
  const u = f.reduce((a, el) => a + el.width, 0);
  let v = printer.cpl - u;
  if (text && columns.length > 0) {
    v -= column.border < 0 ? columns.length + 1 : (columns.length - 1) * column.border;
  }
  const n = g.length;
  while (n > v) {
    f.reduce((a, el) => a.width > el.width ? a : el).width--;
    v++;
  }
  if (n > 0) {
    g.forEach((el, i) => el.width = Math.floor((v + i) / n));
    v = 0;
  }
  const left = Math.floor(v * column.alignment / 2);
  const width = printer.cpl - v;
  const right = v - left;
  if (text) {
    const cols = columns.map((column2) => wrapText(column2, printer));
    const widths = columns.map((column2) => column2.width);
    switch (state.line) {
      case "ready":
        result.push(printer.command.normal() + printer.command.area(left, width, right) + printer.command.align(0) + printer.command.vrstart(widths) + printer.command.vrlf(true));
        state.line = "running";
        break;
      case "horizontal":
        const m = left - state.rules.left;
        const w = width - state.rules.width;
        const l = Math.min(left, state.rules.left);
        const r = Math.min(right, state.rules.right);
        result.push(printer.command.normal() + printer.command.area(l, printer.cpl - l - r, r) + printer.command.align(0) + printer.command.vrhr(state.rules.widths, widths, m, m + w) + printer.command.lf());
        state.line = "running";
        break;
      default:
        break;
    }
    state.rules = {
      left,
      width,
      right,
      widths
    };
    const row = column.wrap ? cols.reduce((a, col) => Math.max(a, col.length), 1) : 1;
    for (let j = 0; j < row; j++) {
      let res = printer.command.normal() + printer.command.area(left, width, right) + printer.command.align(0);
      let p = 0;
      if (state.line === "running") {
        const height = cols.reduce((a, col) => j < col.length ? Math.max(a, col[j].height) : a, 1);
        res += printer.command.normal() + printer.command.absolute(p++) + printer.command.vr(widths, height);
      }
      cols.forEach((col, i) => {
        res += printer.command.absolute(p);
        if (j < col.length) {
          res += printer.command.relative(col[j].margin);
          const { data } = col[j];
          for (let k = 0; k < data.length; k += 2) {
            const ul = Number(data[k][0]);
            const em = Number(data[k][1]);
            const iv = Number(data[k][2]);
            const wh = Number(data[k][3]);
            res += printer.command.normal();
            if (ul) {
              res += printer.command.ul();
            }
            if (em) {
              res += printer.command.em();
            }
            if (iv) {
              res += printer.command.iv();
            }
            if (wh) {
              res += printer.command.wh(wh);
            }
            res += printer.command.text(data[k + 1], printer.encoding);
          }
        } else {
          res += printer.command.normal() + printer.command.text(" ", printer.encoding);
        }
        p += columns[i].width + Math.abs(column.border);
      });
      res += printer.command.lf();
      result.push(res);
    }
  }
  if ("hr" in column) {
    if (column.hr === "=") {
      switch (state.line) {
        case "running":
        case "horizontal":
          result.push(printer.command.normal() + printer.command.area(state.rules.left, state.rules.width, state.rules.right) + printer.command.align(0) + printer.command.vrstop(state.rules.widths) + printer.command.vrlf(false));
          result.push(printer.command.cut());
          state.line = "ready";
          break;
        default:
          result.push(printer.command.cut());
          break;
      }
    } else {
      switch (state.line) {
        case "waiting":
          result.push(printer.command.normal() + printer.command.area(left, width, right) + printer.command.align(0) + printer.command.hr(width) + printer.command.lf());
          break;
        case "running":
          state.line = "horizontal";
          break;
        default:
          break;
      }
    }
  }
  if ("vr" in column) {
    if (column.vr === "+") {
      state.line = "ready";
    } else {
      switch (state.line) {
        case "ready":
          state.line = "waiting";
          break;
        case "running":
        case "horizontal":
          result.push(printer.command.normal() + printer.command.area(state.rules.left, state.rules.width, state.rules.right) + printer.command.align(0) + printer.command.vrstop(state.rules.widths) + printer.command.vrlf(false));
          state.line = "waiting";
          break;
        default:
          break;
      }
    }
  }
  if ("image" in column) {
    result.push(printer.command.normal() + printer.command.image(column.image, column.align, left, width, right));
  }
  if ("code" in column) {
    if (column.code.type === "qrcode") {
      result.push(printer.command.normal() + printer.command.area(left, width, right) + printer.command.align(column.align) + printer.command.qrcode(column.code, printer.encoding));
    } else {
      result.push(printer.command.normal() + printer.command.area(left, width, right) + printer.command.align(column.align) + printer.command.barcode(column.code, printer.encoding));
    }
  }
  if ("command" in column) {
    result.push(printer.command.normal() + printer.command.area(left, width, right) + printer.command.align(column.align) + printer.command.command(column.command));
  }
  if (printer.upsideDown) {
    result.reverse();
  }
  return result.join("");
}
function wrapText(column, printer) {
  const result = [];
  let space = column.width;
  let height = 1;
  let res = [];
  let ul = false;
  let em = false;
  let iv = false;
  let wh = 0;
  column.text.forEach((text, i) => {
    if (i % 2 === 0) {
      let t = Array.from(text);
      while (t.length > 0) {
        let w = 0;
        let j = 0;
        while (j < t.length) {
          w = printer.command.measureText(t[j], printer.encoding) * (wh < 2 ? wh + 1 : wh - 1);
          if (w > space) {
            break;
          }
          space -= w;
          w = 0;
          j++;
        }
        if (j > 0) {
          res.push((ul ? "1" : "0") + (em ? "1" : "0") + (iv ? "1" : "0") + wh);
          res.push(t.slice(0, j).join(""));
          height = Math.max(height, wh < 3 ? wh : wh - 1);
          t = t.slice(j);
        }
        if (w > column.width) {
          t = t.slice(1);
          continue;
        }
        if (w > space || space === 0) {
          result.push({ data: res, margin: space * column.align / 2, height });
          space = column.width;
          res = [];
          height = 1;
        }
      }
    } else {
      switch (text) {
        case "\n":
          result.push({ data: res, margin: space * column.align / 2, height });
          space = column.width;
          res = [];
          height = 1;
          break;
        case "_":
          ul = !ul;
          break;
        case '"':
          em = !em;
          break;
        case "`":
          iv = !iv;
          break;
        default:
          const d = Math.min(text.length, 7);
          wh = wh === d ? 0 : d;
          break;
      }
    }
  });
  if (res.length > 0) {
    result.push({ data: res, margin: space * column.align / 2, height });
  }
  return result;
}
var $ = String.fromCharCode;
var _base = {
  charWidth: 12,
  measureText(text, encoding) {
    let r = 0;
    const t = Array.from(text);
    switch (encoding) {
      case "cp932":
      case "shiftjis":
        r = t.map((c) => c.codePointAt(0)).reduce((a, d) => a + (d < 128 || d === 165 || d === 8254 || d > 65376 && d < 65440 ? 1 : 2), 0);
        break;
      case "cp936":
      case "gb18030":
      case "cp949":
      case "ksc5601":
      case "cp950":
      case "big5":
        r = t.map((c) => c.codePointAt(0)).reduce((a, d) => a + (d < 128 ? 1 : 2), 0);
        break;
      default:
        r = t.length;
        break;
    }
    return r;
  },
  open: (printer) => "",
  close: () => "",
  area: (left, width, right) => "",
  align: (align) => "",
  absolute: (position) => "",
  relative: (position) => "",
  hr: (width) => "",
  vr: (widths, height) => "",
  vrstart: (widths) => "",
  vrstop: (widths) => "",
  vrhr: (widths1, widths2, dl, dr) => "",
  vrlf: (vr) => "",
  cut: () => "",
  ul: () => "",
  em: () => "",
  iv: () => "",
  wh: (wh) => "",
  normal: () => "",
  text: (text, encoding) => "",
  lf: () => "",
  command: (command) => "",
  image: (image, align, left, width, right) => "",
  qrcode: (symbol, encoding) => "",
  barcode: (symbol, encoding) => ""
};
var _svg = {
  svgWidth: 576,
  svgHeight: 0,
  svgContent: "",
  lineMargin: 0,
  lineAlign: 0,
  lineWidth: 48,
  lineHeight: 1,
  textElement: "",
  textAttributes: {},
  textPosition: 0,
  textScale: 1,
  textEncoding: "",
  feedMinimum: 24,
  spacing: false,
  open(printer) {
    this.svgWidth = printer.cpl * this.charWidth;
    this.svgHeight = 0;
    this.svgContent = "";
    this.lineMargin = 0;
    this.lineAlign = 0;
    this.lineWidth = printer.cpl;
    this.lineHeight = 1;
    this.textElement = "";
    this.textAttributes = {};
    this.textPosition = 0;
    this.textScale = 1;
    this.textEncoding = printer.encoding;
    this.feedMinimum = Number(this.charWidth * (printer.spacing ? 2.5 : 2));
    this.spacing = printer.spacing;
    return "";
  },
  close() {
    const p = {
      font: "monospace",
      size: this.charWidth * 2,
      style: "",
      lang: ""
    };
    switch (this.textEncoding) {
      case "cp932":
      case "shiftjis":
        p.font = "'Kosugi Maru', 'MS Gothic', 'San Francisco', 'Osaka-Mono', monospace";
        p.style = '@import url("https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap");';
        p.lang = "ja";
        break;
      case "cp936":
      case "gb18030":
        p.size -= 2;
        p.lang = "zh-Hans";
        break;
      case "cp949":
      case "ksc5601":
        p.size -= 2;
        p.lang = "ko";
        break;
      case "cp950":
      case "big5":
        p.size -= 2;
        p.lang = "zh-Hant";
        break;
      default:
        p.font = "'Courier Prime', 'Courier New', 'Courier', monospace";
        p.size -= 2;
        p.style = '@import url("https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap");';
        break;
    }
    if (p.style.length > 0) {
      p.style = `<style type="text/css"><![CDATA[${p.style}]]></style>`;
    }
    if (p.lang.length > 0) {
      p.lang = ` xml:lang="${p.lang}"`;
    }
    return `<svg width="${this.svgWidth}px" height="${this.svgHeight}px" viewBox="0 0 ${this.svgWidth} ${this.svgHeight}" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">${p.style}<defs><filter id="receiptlineinvert" x="0" y="0" width="100%" height="100%"><feFlood flood-color="#000"/><feComposite in="SourceGraphic" operator="xor"/></filter></defs><g font-family="${p.font}" fill="#000" font-size="${p.size}" dominant-baseline="text-after-edge" text-anchor="middle"${p.lang}>${this.svgContent}</g></svg>
`;
  },
  area(left, width, right) {
    this.lineMargin = left;
    this.lineWidth = width;
    return "";
  },
  align(align) {
    this.lineAlign = align;
    return "";
  },
  absolute(position) {
    this.textPosition = position;
    return "";
  },
  relative(position) {
    this.textPosition += position;
    return "";
  },
  hr(width) {
    const w = this.charWidth;
    const path = `<path d="M0,${w}h${w * width}" fill="none" stroke="#000" stroke-width="2"/>`;
    this.svgContent += `<g transform="translate(${this.lineMargin * w},${this.svgHeight})">${path}</g>`;
    return "";
  },
  vr(widths, height) {
    const w = this.charWidth;
    const u = w / 2;
    const v = (w + w) * height;
    const path = `<path d="${widths.reduce((a, width) => `${a}m${w * width + w},${-v}v${v}`, `M${u},0v${v}`)}" fill="none" stroke="#000" stroke-width="2"/>`;
    this.svgContent += `<g transform="translate(${this.lineMargin * w},${this.svgHeight})">${path}</g>`;
    return "";
  },
  vrstart(widths) {
    const w = this.charWidth;
    const u = w / 2;
    const path = `<path d="${widths.reduce((a, width) => `${a}h${w * width}h${u}v${w}m0,${-w}h${u}`, `M${u},${w + w}v${-u}q0,${-u},${u},${-u}`).replace(/h\d+v\d+m0,-\d+h\d+$/, `q${u},0,${u},${u}v${u}`)}" fill="none" stroke="#000" stroke-width="2"/>`;
    this.svgContent += `<g transform="translate(${this.lineMargin * w},${this.svgHeight})">${path}</g>`;
    return "";
  },
  vrstop(widths) {
    const w = this.charWidth;
    const u = w / 2;
    const path = `<path d="${widths.reduce((a, width) => `${a}h${w * width}h${u}v${-w}m0,${w}h${u}`, `M${u},0v${u}q0,${u},${u},${u}`).replace(/h\d+v-\d+m0,\d+h\d+$/, `q${u},0,${u},${-u}v${-u}`)}" fill="none" stroke="#000" stroke-width="2"/>`;
    this.svgContent += `<g transform="translate(${this.lineMargin * w},${this.svgHeight})">${path}</g>`;
    return "";
  },
  vrhr(widths1, widths2, dl, dr) {
    const w = this.charWidth;
    const u = w / 2;
    const path1 = `<path d="${widths1.reduce((a, width) => `${a}h${w * width}h${u}v${-w}m0,${w}h${u}`, `M${u},0${dl > 0 ? `v${u}q0,${u},${u},${u}` : `v${w}h${u}`}`).replace(/h\d+v-\d+m0,\d+h\d+$/, dr < 0 ? `q${u},0,${u},${-u}v${-u}` : `h${u}v${-w}`)}" fill="none" stroke="#000" stroke-width="2"/>`;
    this.svgContent += `<g transform="translate(${(this.lineMargin + Math.max(-dl, 0)) * w},${this.svgHeight})">${path1}</g>`;
    const path2 = `<path d="${widths2.reduce((a, width) => `${a}h${w * width}h${u}v${w}m0,${-w}h${u}`, `M${u},${w + w}${dl < 0 ? `v${-u}q0,${-u},${u},${-u}` : `v${-w}h${u}`}`).replace(/h\d+v\d+m0,-\d+h\d+$/, dr > 0 ? `q${u},0,${u},${u}v${u}` : `h${u}v${w}`)}" fill="none" stroke="#000" stroke-width="2"/>`;
    this.svgContent += `<g transform="translate(${(this.lineMargin + Math.max(dl, 0)) * w},${this.svgHeight})">${path2}</g>`;
    return "";
  },
  vrlf(vr) {
    this.feedMinimum = Number(this.charWidth * (!vr && this.spacing ? 2.5 : 2));
    return this.lf();
  },
  cut() {
    const path = `<path d="M12,12.5l-7.5,-3a2,2,0,1,1,.5,0M12,11.5l-7.5,3a2,2,0,1,0,.5,0" fill="none" stroke="#000" stroke-width="1"/><path d="M12,12l10,-4q-1,-1,-2.5,-1l-10,4v2l10,4q1.5,0,2.5,-1z" fill="#000"/><path d="M24,12h${this.svgWidth - 24}" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="2"/>`;
    this.svgContent += `<g transform="translate(0,${this.svgHeight})">${path}</g>`;
    return this.lf();
  },
  ul() {
    this.textAttributes["text-decoration"] = "underline";
    return "";
  },
  em() {
    this.textAttributes.stroke = "#000";
    return "";
  },
  iv() {
    this.textAttributes.filter = "url(#receiptlineinvert)";
    return "";
  },
  wh(wh) {
    const w = wh < 2 ? wh + 1 : wh - 1;
    const h = wh < 3 ? wh : wh - 1;
    this.textAttributes.transform = `scale(${w},${h})`;
    this.lineHeight = Math.max(this.lineHeight, h);
    this.textScale = w;
    return "";
  },
  normal() {
    this.textAttributes = {};
    this.textScale = 1;
    return "";
  },
  text(text, encoding) {
    let p = this.textPosition;
    this.textAttributes.x = Array.from(text).map((c) => {
      const q = this.measureText(c, encoding) * this.textScale;
      const r = (p + q / 2) * this.charWidth / this.textScale;
      p += q;
      return r;
    }).join();
    const attr = Object.keys(this.textAttributes).reduce((a, key) => `${a} ${key}="${this.textAttributes[key]}"`, "");
    this.textElement += `<text${attr}>${text.replace(/[ &<>]/g, (r) => ({
      " ": "&#xa0;",
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;"
    })[r])}</text>`;
    this.textPosition += this.measureText(text, encoding) * this.textScale;
    return "";
  },
  lf() {
    const h = this.lineHeight * this.charWidth * 2;
    if (this.textElement.length > 0) {
      this.svgContent += `<g transform="translate(${this.lineMargin * this.charWidth},${this.svgHeight + h})">${this.textElement}</g>`;
    }
    this.svgHeight += Math.max(h, this.feedMinimum);
    this.lineHeight = 1;
    this.textElement = "";
    this.textPosition = 0;
    return "";
  },
  command: (command) => "",
  image(image, align, left, width, right) {
    const png = typeof window !== "undefined" ? window.atob(image) : Buffer.from(image, "base64").toString("binary");
    let imgWidth = 0;
    let imgHeight = 0;
    png.replace(/^\x89PNG\x0d\x0a\x1a\x0a\x00\x00\x00\x0dIHDR(.{4})(.{4})/, (match, w, h) => {
      imgWidth = w.charCodeAt(0) << 24 | w.charCodeAt(1) << 16 | w.charCodeAt(2) << 8 | w.charCodeAt(3);
      imgHeight = h.charCodeAt(0) << 24 | h.charCodeAt(1) << 16 | h.charCodeAt(2) << 8 | h.charCodeAt(3);
    });
    const imgData = `<image xlink:href="data:image/png;base64,${image}" x="0" y="0" width="${imgWidth}" height="${imgHeight}"/>`;
    this.align(align);
    this.area(left, width, right);
    const margin = this.lineMargin * this.charWidth + (this.lineWidth * this.charWidth - imgWidth) * this.lineAlign / 2;
    this.svgContent += `<g transform="translate(${margin},${this.svgHeight})">${imgData}</g>`;
    this.svgHeight += imgHeight;
    return "";
  },
  qrcode(symbol, encoding) {
    if (typeof qrcode !== "undefined") {
      const qr = qrcode(0, symbol.level.toUpperCase());
      qr.addData(symbol.data);
      qr.make();
      qr.createSvgTag(symbol.cell, 0).replace(/width="(\d+)px".*height="(\d+)px".*(<path.*?>)/, (match, w, h, path) => {
        const margin = this.lineMargin * this.charWidth + (this.lineWidth * this.charWidth - Number(w)) * this.lineAlign / 2;
        this.svgContent += `<g transform="translate(${margin},${this.svgHeight})">${path}</g>`;
        this.svgHeight += Number(h);
      });
    }
    return "";
  },
  barcode(symbol, encoding) {
    let bar = {};
    const { data } = symbol;
    const h = symbol.height;
    let x = symbol.width;
    switch (symbol.type) {
      case "upc":
        bar = data.length < 9 ? this.upce(data) : this.upca(data);
        break;
      case "ean":
      case "jan":
        bar = data.length < 9 ? this.ean8(data) : this.ean13(data);
        break;
      case "code39":
        bar = this.code39(data);
        x = Math.floor((x + 1) / 2);
        break;
      case "itf":
        bar = this.itf(data);
        x = Math.floor((x + 1) / 2);
        break;
      case "codabar":
      case "nw7":
        bar = this.codabar(data);
        x = Math.floor((x + 1) / 2);
        break;
      case "code93":
        bar = this.code93(data);
        break;
      case "code128":
        bar = this.code128(data);
        break;
      default:
        break;
    }
    if ("module" in bar) {
      const width = x * bar.length;
      const height = h + this.charWidth * (symbol.hri ? 2 : 0);
      let path = '<path d="';
      bar.module.split("").reduce((p, c, i) => {
        const w = x * parseInt(c, 16);
        if (i % 2 === 1) {
          path += `M${p},${0}h${w}v${h}h${-w}z`;
        }
        return p + w;
      }, 0);
      path += '" fill="#000"/>';
      if (symbol.hri) {
        const m = (width - bar.hri.length * this.charWidth) / 2;
        path += `<text x="${bar.hri.split("").map((c, i) => m + this.charWidth * i).join()}" y="${height}">${bar.hri.replace(/[ &<>]/g, (r) => ({
          " ": "&#xa0;",
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;"
        })[r])}</text>`;
      }
      const margin = this.lineMargin * this.charWidth + (this.lineWidth * this.charWidth - width) * this.lineAlign / 2;
      this.svgContent += `<g transform="translate(${margin},${this.svgHeight})">${path}</g>`;
      this.svgHeight += height;
    }
    return "";
  },
  c128: {
    element: "212222,222122,222221,121223,121322,131222,122213,122312,132212,221213,221312,231212,112232,122132,122231,113222,123122,123221,223211,221132,221231,213212,223112,312131,311222,321122,321221,312212,322112,322211,212123,212321,232121,111323,131123,131321,112313,132113,132311,211313,231113,231311,112133,112331,132131,113123,113321,133121,313121,211331,231131,213113,213311,213131,311123,311321,331121,312113,312311,332111,314111,221411,431111,111224,111422,121124,121421,141122,141221,112214,112412,122114,122411,142112,142211,241211,221114,413111,241112,134111,111242,121142,121241,114212,124112,124211,411212,421112,421211,212141,214121,412121,111143,111341,131141,114113,114311,411113,411311,113141,114131,311141,411131,211412,211214,211232,2331112".split(","),
    starta: 103,
    startb: 104,
    startc: 105,
    atob: 100,
    atoc: 99,
    btoa: 101,
    btoc: 99,
    ctoa: 101,
    ctob: 100,
    shift: 98,
    stop: 106
  },
  code128(data) {
    const r = {};
    const s = data.replace(/((?!^[\x00-\x7f]+$).)*/, "");
    if (s.length > 0) {
      r.hri = s.replace(/[\x00- \x7f]/g, " ");
      const d = [];
      const p = s.search(/[^ -_]/);
      if (/^\d{2}$/.test(s)) {
        d.push(this.c128.startc, Number(s));
      } else if (/^\d{4,}/.test(s)) {
        this.code128c(this.c128.startc, s, d);
      } else if (p >= 0 && s.charCodeAt(p) < 32) {
        this.code128a(this.c128.starta, s, d);
      } else if (s.length > 0) {
        this.code128b(this.c128.startb, s, d);
      } else {
      }
      d.push(d.reduce((a, c, i) => a + c * i) % 103, this.c128.stop);
      r.module = `0${d.map((c) => this.c128.element[c]).join("")}`;
      r.length = d.length * 11 + 2;
    }
    return r;
  },
  code128a(x, s, d) {
    if (x !== this.c128.shift) {
      d.push(x);
    }
    s = s.replace(/^((?!\d{4,})[\x00-_])+/, (m) => (m.split("").forEach((c) => d.push((c.charCodeAt(0) + 64) % 96)), ""));
    s = s.replace(/^\d(?=\d{4}(\d{2})*)/, (m) => (d.push((m.charCodeAt(0) + 64) % 96), ""));
    const t = s.slice(1);
    const p = t.search(/[^ -_]/);
    if (/^\d{4,}/.test(s)) {
      this.code128c(this.c128.atoc, s, d);
    } else if (p >= 0 && t.charCodeAt(p) < 32) {
      d.push(this.c128.shift, s.charCodeAt(0) - 32);
      this.code128a(this.c128.shift, t, d);
    } else if (s.length > 0) {
      this.code128b(this.c128.atob, s, d);
    } else {
    }
  },
  code128b(x, s, d) {
    if (x !== this.c128.shift) {
      d.push(x);
    }
    s = s.replace(/^((?!\d{4,})[ -\x7f])+/, (m) => (m.split("").forEach((c) => d.push(c.charCodeAt(0) - 32)), ""));
    s = s.replace(/^\d(?=\d{4}(\d{2})*)/, (m) => (d.push(m.charCodeAt(0) - 32), ""));
    const t = s.slice(1);
    const p = t.search(/[^ -_]/);
    if (/^\d{4,}/.test(s)) {
      this.code128c(this.c128.btoc, s, d);
    } else if (p >= 0 && t.charCodeAt(p) > 95) {
      d.push(this.c128.shift, s.charCodeAt(0) + 64);
      this.code128b(this.c128.shift, t, d);
    } else if (s.length > 0) {
      this.code128a(this.c128.btoa, s, d);
    } else {
    }
  },
  code128c(x, s, d) {
    if (x !== this.c128.shift) {
      d.push(x);
    }
    s = s.replace(/^\d{4,}/g, (m) => m.replace(/\d{2}/g, (c) => (d.push(Number(c)), "")));
    const p = s.search(/[^ -_]/);
    if (p >= 0 && s.charCodeAt(p) < 32) {
      this.code128a(this.c128.ctoa, s, d);
    } else if (s.length > 0) {
      this.code128b(this.c128.ctob, s, d);
    } else {
    }
  },
  c93: {
    escape: "cU,dA,dB,dC,dD,dE,dF,dG,dH,dI,dJ,dK,dL,dM,dN,dO,dP,dQ,dR,dS,dT,dU,dV,dW,dX,dY,dZ,cA,cB,cC,cD,cE, ,sA,sB,sC,$,%,sF,sG,sH,sI,sJ,+,sL,-,.,/,0,1,2,3,4,5,6,7,8,9,sZ,cF,cG,cH,cI,cJ,cV,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,cK,cL,cM,cN,cO,cW,pA,pB,pC,pD,pE,pF,pG,pH,pI,pJ,pK,pL,pM,pN,pO,pP,pQ,pR,pS,pT,pU,pV,pW,pX,pY,pZ,cP,cQ,cR,cS,cT".split(","),
    code: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%dcsp".split("").reduce((a, c, i) => (a[c] = i, a), {}),
    element: "131112,111213,111312,111411,121113,121212,121311,111114,131211,141111,211113,211212,211311,221112,221211,231111,112113,112212,112311,122112,132111,111123,111222,111321,121122,131121,212112,212211,211122,211221,221121,222111,112122,112221,122121,123111,121131,311112,311211,321111,112131,113121,211131,121221,312111,311121,122211,111141,1111411".split(","),
    start: 47,
    stop: 48
  },
  code93(data) {
    const r = {};
    const s = data.replace(/((?!^[\x00-\x7f]+$).)*/, "");
    if (s.length > 0) {
      r.hri = s.replace(/[\x00- \x7f]/g, " ");
      const d = s.split("").map((c) => this.c93.escape[c.charCodeAt(0)]).join("").split("").map((c) => this.c93.code[c]);
      d.push(d.reduceRight((a, c, i) => a + c * ((d.length - 1 - i) % 20 + 1)) % 47);
      d.push(d.reduceRight((a, c, i) => a + c * ((d.length - 1 - i) % 15 + 1)) % 47);
      d.unshift(this.c93.start);
      d.push(this.c93.stop);
      r.module = `0${d.map((c) => this.c93.element[c]).join("")}`;
      r.length = d.length * 9 + 1;
    }
    return r;
  },
  nw7: {
    0: "2222255",
    1: "2222552",
    2: "2225225",
    3: "5522222",
    4: "2252252",
    5: "5222252",
    6: "2522225",
    7: "2522522",
    8: "2552222",
    9: "5225222",
    "-": "2225522",
    $: "2255222",
    ":": "5222525",
    "/": "5252225",
    ".": "5252522",
    "+": "2252525",
    A: "2255252",
    B: "2525225",
    C: "2225255",
    D: "2225552"
  },
  codabar(data) {
    const r = {};
    const s = data.replace(/((?!^[A-D][0-9\-$:/.+]+[A-D]$).)*/i, "");
    if (s.length > 0) {
      r.hri = s;
      r.module = `0${s.toUpperCase().split("").map((c) => this.nw7[c]).join("2")}`;
      r.length = s.length * 25 - (`${s}$`.match(/[\d\-$]/g).length - 1) * 3 - 2;
    }
    return r;
  },
  i25: {
    element: "22552,52225,25225,55222,22525,52522,25522,22255,52252,25252".split(","),
    start: "2222",
    stop: "522"
  },
  itf(data) {
    const r = {};
    const s = data.replace(/((?!^(\d{2})+$).)*/, "");
    if (s.length > 0) {
      r.hri = s;
      const d = data.replace(/((?!^(\d{2})+$).)*/, "", "").split("").map((c) => Number(c));
      let x = this.i25.start;
      let i = 0;
      while (i < d.length) {
        const b = this.i25.element[d[i++]];
        const s2 = this.i25.element[d[i++]];
        x += b.split("").map((c, j) => c + s2[j]).join("");
      }
      x += this.i25.stop;
      r.module = `0${x}`;
      r.length = s.length * 16 + 17;
    }
    return r;
  },
  c39: {
    0: "222552522",
    1: "522522225",
    2: "225522225",
    3: "525522222",
    4: "222552225",
    5: "522552222",
    6: "225552222",
    7: "222522525",
    8: "522522522",
    9: "225522522",
    A: "522225225",
    B: "225225225",
    C: "525225222",
    D: "222255225",
    E: "522255222",
    F: "225255222",
    G: "222225525",
    H: "522225522",
    I: "225225522",
    J: "222255522",
    K: "522222255",
    L: "225222255",
    M: "525222252",
    N: "222252255",
    O: "522252252",
    P: "225252252",
    Q: "222222555",
    R: "522222552",
    S: "225222552",
    T: "222252552",
    U: "552222225",
    V: "255222225",
    W: "555222222",
    X: "252252225",
    Y: "552252222",
    Z: "255252222",
    "-": "252222525",
    ".": "552222522",
    " ": "255222522",
    $: "252525222",
    "/": "252522252",
    "+": "252225252",
    "%": "222525252",
    "*": "252252522"
  },
  code39(data) {
    const r = {};
    let s = data.replace(/((?!^\*?[0-9A-Z\-. $/+%]+\*?$).)*/, "");
    if (s.length > 0) {
      s = s.replace(/^\*?([^*]+)\*?$/, "*$1*");
      r.hri = s;
      r.module = `0${s.split("").map((c) => this.c39[c]).join("2")}`;
      r.length = s.length * 29 - 2;
    }
    return r;
  },
  ean: {
    a: "3211,2221,2122,1411,1132,1231,1114,1312,1213,3112".split(","),
    b: "1123,1222,2212,1141,2311,1321,4111,2131,3121,2113".split(","),
    c: "3211,2221,2122,1411,1132,1231,1114,1312,1213,3112".split(","),
    g: "111,11111,111111,11,112".split(","),
    p: "aaaaaa,aababb,aabbab,aabbba,abaabb,abbaab,abbbaa,ababab,ababba,abbaba".split(","),
    e: "bbbaaa,bbabaa,bbaaba,bbaaab,babbaa,baabba,baaabb,bababa,babaab,baabab".split(",")
  },
  upca(data) {
    const r = this.ean13(`0${data}`);
    if ("module" in r) {
      r.hri = r.hri.slice(1);
    }
    return r;
  },
  upce(data) {
    const r = {};
    const d = data.replace(/((?!^0\d{6,7}$).)*/, "").split("").map((c) => Number(c));
    if (d.length > 0) {
      d[7] = 0;
      d[7] = (10 - this.upcetoa(d).reduce((a, c, i) => a + c * (3 - i % 2 * 2), 0) % 10) % 10;
      r.hri = d.join("");
      let m = this.ean.g[0];
      for (let i = 1; i < 7; i++)
        m += this.ean[this.ean.e[d[7]][i - 1]][d[i]];
      m += this.ean.g[2];
      r.module = `0${m}`;
      r.length = 51;
    }
    return r;
  },
  upcetoa: (e) => {
    const a = e.slice(0, 3);
    switch (e[6]) {
      case 0:
      case 1:
      case 2:
        a.push(e[6], 0, 0, 0, 0, e[3], e[4], e[5]);
        break;
      case 3:
        a.push(e[3], 0, 0, 0, 0, 0, e[4], e[5]);
        break;
      case 4:
        a.push(e[3], e[4], 0, 0, 0, 0, 0, e[5]);
        break;
      default:
        a.push(e[3], e[4], e[5], 0, 0, 0, 0, e[6]);
        break;
    }
    a.push(e[7]);
    return a;
  },
  ean13(data) {
    const r = {};
    const d = data.replace(/((?!^\d{12,13}$).)*/, "").split("").map((c) => Number(c));
    if (d.length > 0) {
      d[12] = 0;
      d[12] = (10 - d.reduce((a, c, i) => a + c * (i % 2 * 2 + 1)) % 10) % 10;
      r.hri = d.join("");
      let m = this.ean.g[0];
      for (let i = 1; i < 7; i++)
        m += this.ean[this.ean.p[d[0]][i - 1]][d[i]];
      m += this.ean.g[1];
      for (let i = 7; i < 13; i++)
        m += this.ean.c[d[i]];
      m += this.ean.g[0];
      r.module = `0${m}`;
      r.length = 95;
    }
    return r;
  },
  ean8(data) {
    const r = {};
    const d = data.replace(/((?!^\d{7,8}$).)*/, "").split("").map((c) => Number(c));
    if (d.length > 0) {
      d[7] = 0;
      d[7] = (10 - d.reduce((a, c, i) => a + c * (3 - i % 2 * 2), 0) % 10) % 10;
      r.hri = d.join("");
      let m = this.ean.g[0];
      for (let i = 0; i < 4; i++)
        m += this.ean.a[d[i]];
      m += this.ean.g[1];
      for (let i = 4; i < 8; i++)
        m += this.ean.c[d[i]];
      m += this.ean.g[0];
      r.module = `0${m}`;
      r.length = 67;
    }
    return r;
  }
};
var multitable = {};
var multipage = {
  "\0": "\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xA2\xA3\xA5\u20A7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0",
  "": "\u20AC\uFFFD\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\uFFFD\u017D\uFFFD\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\uFFFD\u017E\u0178\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE\xBF\xC0\xC1\xC2\xC3\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\xD0\xD1\xD2\xD3\xD4\xD5\xD6\xD7\xD8\xD9\xDA\xDB\xDC\xDD\xDE\xDF\xE0\xE1\xE2\xE3\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\xF0\xF1\xF2\xF3\xF4\xF5\xF6\xF7\xF8\xF9\xFA\xFB\xFC\xFD\xFE\xFF",
  "": "\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E\u044F\u0401\u0451\u0404\u0454\u0407\u0457\u040E\u045E\xB0\u2219\xB7\u221A\u2116\xA4\u25A0\xA0",
  "": "\xC7\xFC\xE9\xE2\xE4\u016F\u0107\xE7\u0142\xEB\u0150\u0151\xEE\u0179\xC4\u0106\xC9\u0139\u013A\xF4\xF6\u013D\u013E\u015A\u015B\xD6\xDC\u0164\u0165\u0141\xD7\u010D\xE1\xED\xF3\xFA\u0104\u0105\u017D\u017E\u0118\u0119\xAC\u017A\u010C\u015F\xAB\xBB\u2591\u2592\u2593\u2502\u2524\xC1\xC2\u011A\u015E\u2563\u2551\u2557\u255D\u017B\u017C\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u0102\u0103\u255A\u2554\u2569\u2566\u2560\u2550\u256C\xA4\u0111\u0110\u010E\xCB\u010F\u0147\xCD\xCE\u011B\u2518\u250C\u2588\u2584\u0162\u016E\u2580\xD3\xDF\xD4\u0143\u0144\u0148\u0160\u0161\u0154\xDA\u0155\u0170\xFD\xDD\u0163\xB4\xAD\u02DD\u02DB\u02C7\u02D8\xA7\xF7\xB8\xB0\xA8\u02D9\u0171\u0158\u0159\u25A0\xA0",
  "": "\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xF8\xA3\xD8\xD7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\xAE\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\xC1\xC2\xC0\xA9\u2563\u2551\u2557\u255D\xA2\xA5\u2510\u2514\u2534\u252C\u251C\u2500\u253C\xE3\xC3\u255A\u2554\u2569\u2566\u2560\u2550\u256C\xA4\xF0\xD0\xCA\xCB\xC8\u20AC\xCD\xCE\xCF\u2518\u250C\u2588\u2584\xA6\xCC\u2580\xD3\xDF\xD4\xD2\xF5\xD5\xB5\xFE\xDE\xDA\xDB\xD9\xFD\xDD\xAF\xB4\xAD\xB1\u2017\xBE\xB6\xA7\xF7\xB8\xB0\xA8\xB7\xB9\xB3\xB2\u25A0\xA0"
};
var starpage = {
  "\0": "",
  "": " ",
  "": "\n",
  "": "",
  "": ""
};
for (const p of Object.keys(multipage)) {
  const s = multipage[p];
  for (let i = 0; i < 128; i++) {
    const c = s[i];
    if (!multitable[c]) {
      multitable[c] = p + $(i + 128);
    }
  }
}
var _escpos = {
  upsideDown: false,
  spacing: false,
  cutting: true,
  gradient: true,
  gamma: 1.8,
  threshold: 128,
  vrtable: {
    " ": {
      " ": " ",
      "\x90": "\x90",
      "\x95": "\x95",
      "\x9A": "\x9A",
      "\x9B": "\x9B",
      "\x9E": "\x9E",
      "\x9F": "\x9F"
    },
    "\x91": {
      " ": "\x91",
      "\x90": "\x8F",
      "\x95": "\x91",
      "\x9A": "\x8F",
      "\x9B": "\x8F",
      "\x9E": "\x8F",
      "\x9F": "\x8F"
    },
    "\x95": {
      " ": "\x95",
      "\x90": "\x90",
      "\x95": "\x95",
      "\x9A": "\x90",
      "\x9B": "\x90",
      "\x9E": "\x90",
      "\x9F": "\x90"
    },
    "\x98": {
      " ": "\x98",
      "\x90": "\x8F",
      "\x95": "\x91",
      "\x9A": "\x93",
      "\x9B": "\x8F",
      "\x9E": "\x93",
      "\x9F": "\x8F"
    },
    "\x99": {
      " ": "\x99",
      "\x90": "\x8F",
      "\x95": "\x91",
      "\x9A": "\x8F",
      "\x9B": "\x92",
      "\x9E": "\x8F",
      "\x9F": "\x92"
    },
    "\x9C": {
      " ": "\x9C",
      "\x90": "\x8F",
      "\x95": "\x91",
      "\x9A": "\x93",
      "\x9B": "\x8F",
      "\x9E": "\x93",
      "\x9F": "\x8F"
    },
    "\x9D": {
      " ": "\x9D",
      "\x90": "\x8F",
      "\x95": "\x91",
      "\x9A": "\x8F",
      "\x9B": "\x92",
      "\x9E": "\x8F",
      "\x9F": "\x92"
    }
  },
  codepage: {
    cp437: "\x1Bt\0",
    cp852: "\x1Bt",
    cp858: "\x1Bt",
    cp860: "\x1Bt",
    cp863: "\x1Bt",
    cp865: "\x1Bt",
    cp866: "\x1Bt",
    cp1252: "\x1Bt",
    cp932: "\x1BtC1\x1BR\b",
    cp936: "\x1Bt\0&",
    cp949: "\x1Bt\0&\x1BR\r",
    cp950: "\x1Bt\0&",
    shiftjis: "\x1BtC1\x1BR\b",
    gb18030: "\x1Bt\0&",
    ksc5601: "\x1Bt\0&\x1BR\r",
    big5: "\x1Bt\0&"
  },
  multiconv: (text) => {
    let p = "";
    let r = "";
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c > "\x7F") {
        const d = multitable[c];
        if (d) {
          const q = d[0];
          if (p === q) {
            r += d[1];
          } else {
            r += `\x1Bt${d}`;
            p = q;
          }
        } else {
          r += "?";
        }
      } else {
        r += c;
      }
    }
    return r;
  }
};
var _thermal = {
  open(printer) {
    this.upsideDown = printer.upsideDown;
    this.spacing = printer.spacing;
    this.cutting = printer.cutting;
    this.gradient = printer.gradient;
    this.gamma = printer.gamma;
    this.threshold = printer.threshold;
    return `\x1B@a\0\x1BM0(A${$(2, 0, 48, 0)}\x1B \0S\0\0${this.spacing ? "\x1B2" : "\x1B3\0"}\x1B{${$(this.upsideDown)}.`;
  },
  close() {
    return `${this.cutting ? this.cut() : ""}r1`;
  },
  area(left, width, right) {
    const m = left * this.charWidth;
    const w = width * this.charWidth;
    return `L${$(m & 255, m >> 8 & 255)}W${$(w & 255, w >> 8 & 255)}`;
  },
  align: (align) => `\x1Ba${$(align)}`,
  absolute(position) {
    const p = position * this.charWidth;
    return `\x1B$${$(p & 255, p >> 8 & 255)}`;
  },
  relative(position) {
    const p = position * this.charWidth;
    return `\x1B\\${$(p & 255, p >> 8 & 255)}`;
  },
  hr: (width) => `C0.\x1Bt${"\x95".repeat(width)}`,
  vr(widths, height) {
    return widths.reduce((a, w) => `${a + this.relative(w)}\x96`, `!${$(height - 1)}C0.\x1Bt\x96`);
  },
  vrstart: (widths) => `C0.\x1Bt${widths.reduce((a, w) => `${a + "\x95".repeat(w)}\x91`, "\x9C").slice(0, -1)}\x9D`,
  vrstop: (widths) => `C0.\x1Bt${widths.reduce((a, w) => `${a + "\x95".repeat(w)}\x90`, "\x9E").slice(0, -1)}\x9F`,
  vrhr(widths1, widths2, dl, dr) {
    const r1 = " ".repeat(Math.max(-dl, 0)) + widths1.reduce((a, w) => `${a + "\x95".repeat(w)}\x90`, dl > 0 ? "\x9E" : "\x9A").slice(0, -1) + (dr < 0 ? "\x9F" : "\x9B") + " ".repeat(Math.max(dr, 0));
    const r2 = " ".repeat(Math.max(dl, 0)) + widths2.reduce((a, w) => `${a + "\x95".repeat(w)}\x91`, dl < 0 ? "\x9C" : "\x98").slice(0, -1) + (dr > 0 ? "\x9D" : "\x99") + " ".repeat(Math.max(-dr, 0));
    return `C0.\x1Bt${r2.split("").map((c, i) => this.vrtable[c][r1[i]]).join("")}`;
  },
  vrlf(vr) {
    return (vr === this.upsideDown && this.spacing ? "\x1B2" : "\x1B3\0") + this.lf();
  },
  cut: () => "VB\0",
  ul: () => "\x1B-1-1",
  em: () => "\x1BE1",
  iv: () => "B1",
  wh: (wh) => `!${wh < 3 ? $((wh & 1) << 4 | wh >> 1 & 1) : $(wh - 2 << 4 | wh - 2)}`,
  normal: () => "\x1B-0-0\x1BE0B0!\0",
  text(text, encoding) {
    return encoding === "multilingual" ? this.multiconv(text) : this.codepage[encoding] + iconv.encode(text, encoding).toString("binary");
  },
  lf: () => "\n",
  command: (command) => command,
  split: 512,
  image(image, align, left, width, right) {
    let r = this.upsideDown ? this.area(right, width, left) + this.align(2 - align) : this.area(left, width, right) + this.align(align);
    const img = PNG.sync.read(Buffer.from(image, "base64"));
    const w = img.width;
    const d = Array(w).fill(0);
    let j = this.upsideDown ? img.data.length - 4 : 0;
    for (let z = 0; z < img.height; z += this.split) {
      const h = Math.min(this.split, img.height - z);
      const l = (w + 7 >> 3) * h + 10;
      r += `8L${$(l & 255, l >> 8 & 255, l >> 16 & 255, l >> 24 & 255, 48, 112, 48, 1, 1, 49, w & 255, w >> 8 & 255, h & 255, h >> 8 & 255)}`;
      for (let y = 0; y < h; y++) {
        let i = 0;
        let e = 0;
        for (let x = 0; x < w; x += 8) {
          let b = 0;
          const q = Math.min(w - x, 8);
          for (let p = 0; p < q; p++) {
            const f = Math.floor((d[i] + e * 5) / 16 + __pow(((img.data[j] * 0.299 + img.data[j + 1] * 0.587 + img.data[j + 2] * 0.114 - 255) * img.data[j + 3] + 65525) / 65525, 1 / this.gamma) * 255);
            j += this.upsideDown ? -4 : 4;
            if (this.gradient) {
              d[i] = e * 3;
              e = f < this.threshold ? (b |= 128 >> p, f) : f - 255;
              if (i > 0) {
                d[i - 1] += e;
              }
              d[i++] += e * 7;
            } else if (f < this.threshold) {
              b |= 128 >> p;
            }
          }
          r += $(b);
        }
      }
      r += `(L${$(2, 0, 48, 50)}`;
    }
    return r;
  },
  qrcode(symbol, encoding) {
    const d = iconv.encode(symbol.data, encoding === "multilingual" ? "ascii" : encoding).toString("binary").slice(0, 7089);
    return `(k${$(4, 0, 49, 65, 50, 0)}(k${$(3, 0, 49, 67, symbol.cell)}(k${$(3, 0, 49, 69, this.qrlevel[symbol.level])}(k${$(d.length + 3 & 255, d.length + 3 >> 8 & 255, 49, 80, 48)}${d}(k${$(3, 0, 49, 81, 48)}`;
  },
  qrlevel: {
    l: 48,
    m: 49,
    q: 50,
    h: 51
  },
  barcode(symbol, encoding) {
    let d = iconv.encode(symbol.data, encoding === "multilingual" ? "ascii" : encoding).toString("binary");
    const b = this.bartype[symbol.type] + (/upc|[ej]an/.test(symbol.type) && symbol.data.length < 9);
    switch (b) {
      case this.bartype.upc + 1:
        d = this.upce(d);
        break;
      case this.bartype.code128:
        d = this.code128(d);
        break;
      default:
        break;
    }
    d = d.slice(0, 255);
    return `w${$(symbol.width)}h${$(symbol.height)}H${$(symbol.hri ? 2 : 0)}k${$(b, d.length)}${d}`;
  },
  bartype: {
    upc: 65,
    ean: 67,
    jan: 67,
    code39: 69,
    itf: 70,
    codabar: 71,
    nw7: 71,
    code93: 72,
    code128: 73
  },
  upce: (data) => {
    let r = "";
    const s = data.replace(/((?!^0\d{6,7}$).)*/, "");
    if (s.length > 0) {
      r += s.slice(0, 3);
      switch (s[6]) {
        case "0":
        case "1":
        case "2":
          r += `${s[6]}0000${s[3]}${s[4]}${s[5]}`;
          break;
        case "3":
          r += `${s[3]}00000${s[4]}${s[5]}`;
          break;
        case "4":
          r += `${s[3] + s[4]}00000${s[5]}`;
          break;
        default:
          r += `${s[3] + s[4] + s[5]}0000${s[6]}`;
          break;
      }
    }
    return r;
  },
  c128: {
    special: 123,
    codea: 65,
    codeb: 66,
    codec: 67,
    shift: 83
  },
  code128(data) {
    let r = "";
    const s = data.replace(/((?!^[\x00-\x7f]+$).)*/, "").replace(/{/g, "{{");
    if (s.length > 0) {
      const d = [];
      const p = s.search(/[^ -_]/);
      if (/^\d{2}$/.test(s)) {
        d.push(this.c128.special, this.c128.codec, Number(s));
      } else if (/^\d{4,}/.test(s)) {
        this.code128c(this.c128.codec, s, d);
      } else if (p >= 0 && s.charCodeAt(p) < 32) {
        this.code128a(this.c128.codea, s, d);
      } else if (s.length > 0) {
        this.code128b(this.c128.codeb, s, d);
      } else {
      }
      r = d.map((c) => $(c)).join("");
    }
    return r;
  },
  code128a(x, s, d) {
    if (x !== this.c128.shift) {
      d.push(this.c128.special, x);
    }
    s = s.replace(/^((?!\d{4,})[\x00-_])+/, (m) => (m.split("").forEach((c) => d.push(c.charCodeAt(0))), ""));
    s = s.replace(/^\d(?=\d{4}(\d{2})*)/, (m) => (d.push(m.charCodeAt(0)), ""));
    const t = s.slice(1);
    const p = t.search(/[^ -_]/);
    if (/^\d{4,}/.test(s)) {
      this.code128c(this.c128.codec, s, d);
    } else if (p >= 0 && t.charCodeAt(p) < 32) {
      d.push(this.c128.special, this.c128.shift, s.charCodeAt(0));
      this.code128a(this.c128.shift, t, d);
    } else if (s.length > 0) {
      this.code128b(this.c128.codeb, s, d);
    } else {
    }
  },
  code128b(x, s, d) {
    if (x !== this.c128.shift) {
      d.push(this.c128.special, x);
    }
    s = s.replace(/^((?!\d{4,})[ -\x7f])+/, (m) => (m.split("").forEach((c) => d.push(c.charCodeAt(0))), ""));
    s = s.replace(/^\d(?=\d{4}(\d{2})*)/, (m) => (d.push(m.charCodeAt(0)), ""));
    const t = s.slice(1);
    const p = t.search(/[^ -_]/);
    if (/^\d{4,}/.test(s)) {
      this.code128c(this.c128.codec, s, d);
    } else if (p >= 0 && t.charCodeAt(p) > 95) {
      d.push(this.c128.special, this.c128.shift, s.charCodeAt(0));
      this.code128b(this.c128.shift, t, d);
    } else if (s.length > 0) {
      this.code128a(this.c128.codea, s, d);
    } else {
    }
  },
  code128c(x, s, d) {
    if (x !== this.c128.shift) {
      d.push(this.c128.special, x);
    }
    s = s.replace(/^\d{4,}/g, (m) => m.replace(/\d{2}/g, (c) => (d.push(Number(c)), "")));
    const p = s.search(/[^ -_]/);
    if (p >= 0 && s.charCodeAt(p) < 32) {
      this.code128a(this.c128.codea, s, d);
    } else if (s.length > 0) {
      this.code128b(this.c128.codeb, s, d);
    } else {
    }
  }
};
var _sii = {
  open(printer) {
    this.upsideDown = printer.upsideDown;
    this.spacing = printer.spacing;
    this.cutting = printer.cutting;
    this.gradient = printer.gradient;
    this.gamma = printer.gamma;
    this.threshold = printer.threshold;
    return `\x1B@a\0\x1BM0\x1B \0S\0\0${this.spacing ? "\x1B2" : "\x1B3\0"}\x1B{${$(this.upsideDown)}.`;
  },
  close() {
    return `${this.cutting ? this.cut() : ""}q\0`;
  },
  area(left, width, right) {
    const m = (this.upsideDown ? right : left) * this.charWidth;
    const w = width * this.charWidth;
    return `L${$(m & 255, m >> 8 & 255)}W${$(w & 255, w >> 8 & 255)}`;
  },
  split: 1662,
  qrcode(symbol, encoding) {
    const d = iconv.encode(symbol.data, encoding === "multilingual" ? "ascii" : encoding).toString("binary").slice(0, 7089);
    return `;${$(symbol.cell)}p${$(1, 2, this.qrlevel[symbol.level], 0, 77, d.length & 255, d.length >> 8 & 255)}${d}`;
  },
  qrlevel: {
    l: 76,
    m: 77,
    q: 81,
    h: 72
  },
  barcode(symbol, encoding) {
    let d = iconv.encode(symbol.data, encoding === "multilingual" ? "ascii" : encoding).toString("binary");
    const b = this.bartype[symbol.type] + (/upc|[ej]an/.test(symbol.type) && symbol.data.length < 9);
    switch (b) {
      case this.bartype.upc + 1:
        d = this.upce(d);
        break;
      case this.bartype.codabar:
        d = this.codabar(d);
        break;
      case this.bartype.code93:
        d = this.code93(d);
        break;
      case this.bartype.code128:
        d = this.code128(d);
        break;
      default:
        break;
    }
    d = d.slice(0, 255);
    return `w${$(symbol.width)}h${$(symbol.height)}H${$(symbol.hri ? 2 : 0)}k${$(b, d.length)}${d}`;
  },
  codabar: (data) => data.toUpperCase(),
  c93: {
    escape: "cU,dA,dB,dC,dD,dE,dF,dG,dH,dI,dJ,dK,dL,dM,dN,dO,dP,dQ,dR,dS,dT,dU,dV,dW,dX,dY,dZ,cA,cB,cC,cD,cE, ,sA,sB,sC,$,%,sF,sG,sH,sI,sJ,+,sL,-,.,/,0,1,2,3,4,5,6,7,8,9,sZ,cF,cG,cH,cI,cJ,cV,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,cK,cL,cM,cN,cO,cW,pA,pB,pC,pD,pE,pF,pG,pH,pI,pJ,pK,pL,pM,pN,pO,pP,pQ,pR,pS,pT,pU,pV,pW,pX,pY,pZ,cP,cQ,cR,cS,cT".split(","),
    code: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%dcsp".split("").reduce((a, c, i) => (a[c] = i, a), {}),
    start: 47,
    stop: 48
  },
  code93(data) {
    let r = "";
    const s = data.replace(/((?!^[\x00-\x7f]+$).)*/, "");
    if (s.length > 0) {
      const d = s.split("").map((c) => this.c93.escape[c.charCodeAt(0)]).join("").split("").map((c) => this.c93.code[c]);
      d.push(this.c93.stop);
      r = d.map((c) => $(c)).join("");
    }
    return r;
  },
  c128: {
    starta: 103,
    startb: 104,
    startc: 105,
    atob: 100,
    atoc: 99,
    btoa: 101,
    btoc: 99,
    ctoa: 101,
    ctob: 100,
    shift: 98,
    stop: 105
  },
  code128(data) {
    let r = "";
    const s = data.replace(/((?!^[\x00-\x7f]+$).)*/, "");
    if (s.length > 0) {
      const d = [];
      const p = s.search(/[^ -_]/);
      if (/^\d{2}$/.test(s)) {
        d.push(this.c128.startc, Number(s));
      } else if (/^\d{4,}/.test(s)) {
        this.code128c(this.c128.startc, s, d);
      } else if (p >= 0 && s.charCodeAt(p) < 32) {
        this.code128a(this.c128.starta, s, d);
      } else if (s.length > 0) {
        this.code128b(this.c128.startb, s, d);
      } else {
      }
      d.push(this.c128.stop);
      r = d.map((c) => $(c)).join("");
    }
    return r;
  },
  code128a(x, s, d) {
    if (x !== this.c128.shift) {
      d.push(x);
    }
    s = s.replace(/^((?!\d{4,})[\x00-_])+/, (m) => (m.split("").forEach((c) => d.push((c.charCodeAt(0) + 64) % 96)), ""));
    s = s.replace(/^\d(?=\d{4}(\d{2})*)/, (m) => (d.push((m.charCodeAt(0) + 64) % 96), ""));
    const t = s.slice(1);
    const p = t.search(/[^ -_]/);
    if (/^\d{4,}/.test(s)) {
      this.code128c(this.c128.atoc, s, d);
    } else if (p >= 0 && t.charCodeAt(p) < 32) {
      d.push(this.c128.shift, s.charCodeAt(0) - 32);
      this.code128a(this.c128.shift, t, d);
    } else if (s.length > 0) {
      this.code128b(this.c128.atob, s, d);
    } else {
    }
  },
  code128b(x, s, d) {
    if (x !== this.c128.shift) {
      d.push(x);
    }
    s = s.replace(/^((?!\d{4,})[ -\x7f])+/, (m) => (m.split("").forEach((c) => d.push(c.charCodeAt(0) - 32)), ""));
    s = s.replace(/^\d(?=\d{4}(\d{2})*)/, (m) => (d.push(m.charCodeAt(0) - 32), ""));
    const t = s.slice(1);
    const p = t.search(/[^ -_]/);
    if (/^\d{4,}/.test(s)) {
      this.code128c(this.c128.btoc, s, d);
    } else if (p >= 0 && t.charCodeAt(p) > 95) {
      d.push(this.c128.shift, s.charCodeAt(0) + 64);
      this.code128b(this.c128.shift, t, d);
    } else if (s.length > 0) {
      this.code128a(this.c128.btoa, s, d);
    } else {
    }
  },
  code128c(x, s, d) {
    if (x !== this.c128.shift) {
      d.push(x);
    }
    s = s.replace(/^\d{4,}/g, (m) => m.replace(/\d{2}/g, (c) => (d.push(Number(c)), "")));
    const p = s.search(/[^ -_]/);
    if (p >= 0 && s.charCodeAt(p) < 32) {
      this.code128a(this.c128.ctoa, s, d);
    } else if (s.length > 0) {
      this.code128b(this.c128.ctob, s, d);
    } else {
    }
  }
};
var _citizen = {
  split: 1662
};
var _fit = {
  split: 1662,
  image(image, align, left, width, right) {
    let r = (this.upsideDown && align === 2 ? this.area(right, width, left) : this.area(left, width, right)) + this.align(align);
    const img = PNG.sync.read(Buffer.from(image, "base64"));
    const w = img.width;
    const d = Array(w).fill(0);
    let j = 0;
    for (let z = 0; z < img.height; z += this.split) {
      const h = Math.min(this.split, img.height - z);
      const l = (w + 7 >> 3) * h + 10;
      r += `8L${$(l & 255, l >> 8 & 255, l >> 16 & 255, l >> 24 & 255, 48, 112, 48, 1, 1, 49, w & 255, w >> 8 & 255, h & 255, h >> 8 & 255)}`;
      for (let y = 0; y < h; y++) {
        let i = 0;
        let e = 0;
        for (let x = 0; x < w; x += 8) {
          let b = 0;
          const q = Math.min(w - x, 8);
          for (let p = 0; p < q; p++) {
            const f = Math.floor((d[i] + e * 5) / 16 + __pow(((img.data[j] * 0.299 + img.data[j + 1] * 0.587 + img.data[j + 2] * 0.114 - 255) * img.data[j + 3] + 65525) / 65525, 1 / this.gamma) * 255);
            j += 4;
            if (this.gradient) {
              d[i] = e * 3;
              e = f < this.threshold ? (b |= 128 >> p, f) : f - 255;
              if (i > 0) {
                d[i - 1] += e;
              }
              d[i++] += e * 7;
            } else if (f < this.threshold) {
              b |= 128 >> p;
            }
          }
          r += $(b);
        }
      }
      r += `(L${$(2, 0, 48, 50)}`;
    }
    return r;
  }
};
var _impact = {
  font: 0,
  style: 0,
  color: 0,
  margin: 0,
  position: 0,
  red: [],
  black: [],
  open(printer) {
    this.style = this.font;
    this.color = 0;
    this.margin = 0;
    this.position = 0;
    this.red = [];
    this.black = [];
    this.upsideDown = printer.upsideDown;
    this.spacing = printer.spacing;
    this.cutting = printer.cutting;
    this.gradient = printer.gradient;
    this.gamma = printer.gamma;
    this.threshold = printer.threshold;
    return `\x1B@a\0\x1BM${$(this.font)}${this.spacing ? "\x1B2" : "\x1B3"}\x1B{${$(this.upsideDown)}.`;
  },
  close() {
    return `${this.cutting ? this.cut() : ""}r1`;
  },
  area(left, width, right) {
    this.margin = left;
    return "";
  },
  align: (align) => `\x1Ba${$(align)}`,
  absolute(position) {
    this.position = position;
    return "";
  },
  relative(position) {
    this.position += Math.round(position);
    return "";
  },
  hr(width) {
    return `\x1B!${$(this.font)}${" ".repeat(this.margin)}\x1Bt${"\x95".repeat(width)}`;
  },
  vr(widths, height) {
    const d = `\x1B!${$(this.font + (height > 1 ? 16 : 0))}\x1Bt\x96`;
    this.black.push({ data: d, index: this.position, length: 1 });
    widths.forEach((w) => {
      this.position += w + 1;
      this.black.push({ data: d, index: this.position, length: 1 });
    });
    return "";
  },
  vrstart(widths) {
    return `\x1B!${$(this.font)}${" ".repeat(this.margin)}\x1Bt${widths.reduce((a, w) => `${a + "\x95".repeat(w)}\x91`, "\x9C").slice(0, -1)}\x9D`;
  },
  vrstop(widths) {
    return `\x1B!${$(this.font)}${" ".repeat(this.margin)}\x1Bt${widths.reduce((a, w) => `${a + "\x95".repeat(w)}\x90`, "\x9E").slice(0, -1)}\x9F`;
  },
  vrhr(widths1, widths2, dl, dr) {
    const r1 = " ".repeat(Math.max(-dl, 0)) + widths1.reduce((a, w) => `${a + "\x95".repeat(w)}\x90`, dl > 0 ? "\x9E" : "\x9A").slice(0, -1) + (dr < 0 ? "\x9F" : "\x9B") + " ".repeat(Math.max(dr, 0));
    const r2 = " ".repeat(Math.max(dl, 0)) + widths2.reduce((a, w) => `${a + "\x95".repeat(w)}\x91`, dl < 0 ? "\x9C" : "\x98").slice(0, -1) + (dr > 0 ? "\x9D" : "\x99") + " ".repeat(Math.max(-dr, 0));
    return `\x1B!${$(this.font)}${" ".repeat(this.margin)}\x1Bt${r2.split("").map((c, i) => this.vrtable[c][r1[i]]).join("")}`;
  },
  vrlf(vr) {
    return (vr === this.upsideDown && this.spacing ? "\x1B2" : "\x1B3") + this.lf();
  },
  cut: () => "VB\0",
  ul() {
    this.style += 128;
    return "";
  },
  em() {
    this.style += 8;
    return "";
  },
  iv() {
    this.color = 1;
    return "";
  },
  wh(wh) {
    if (wh > 0) {
      this.style += wh < 3 ? 64 >> wh : 48;
    }
    return "";
  },
  normal() {
    this.style = this.font;
    this.color = 0;
    return "";
  },
  text(text, encoding) {
    const t = iconv.encode(text, encoding === "multilingual" ? "ascii" : encoding).toString("binary");
    const d = `\x1B!${$(this.style)}${encoding === "multilingual" ? this.multiconv(text) : this.codepage[encoding] + iconv.encode(text, encoding).toString("binary")}`;
    const l = t.length * (this.style & 32 ? 2 : 1);
    if (this.color > 0) {
      this.red.push({ data: d, index: this.position, length: l });
    } else {
      this.black.push({ data: d, index: this.position, length: l });
    }
    this.position += l;
    return "";
  },
  lf() {
    let r = "";
    if (this.red.length > 0) {
      let p = 0;
      r += `${this.red.sort((a, b) => a.index - b.index).reduce((a, c) => {
        const s = `${a}\x1B!${$(this.font)}${" ".repeat(c.index - p)}${c.data}`;
        p = c.index + c.length;
        return s;
      }, `\x1Br\x1B!${$(this.font)}${" ".repeat(this.margin)}`)}\r\x1Br\0`;
    }
    if (this.black.length > 0) {
      let p = 0;
      r += this.black.sort((a, b) => a.index - b.index).reduce((a, c) => {
        const s = `${a}\x1B!${$(this.font)}${" ".repeat(c.index - p)}${c.data}`;
        p = c.index + c.length;
        return s;
      }, `\x1B!${$(this.font)}${" ".repeat(this.margin)}`);
    }
    r += "\n";
    this.position = 0;
    this.red = [];
    this.black = [];
    return r;
  },
  command: (command) => command,
  image(image, align, left, width, right) {
    let r = this.align(align);
    const img = PNG.sync.read(Buffer.from(image, "base64"));
    const w = img.width;
    if (w < 1024) {
      const d = Array(w).fill(0);
      let j = this.upsideDown ? img.data.length - 4 : 0;
      for (let y = 0; y < img.height; y += 8) {
        const b = Array(w).fill(0);
        const h = Math.min(8, img.height - y);
        for (let p = 0; p < h; p++) {
          let i = 0;
          let e = 0;
          for (let x = 0; x < w; x++) {
            const f = Math.floor((d[i] + e * 5) / 16 + __pow(((img.data[j] * 0.299 + img.data[j + 1] * 0.587 + img.data[j + 2] * 0.114 - 255) * img.data[j + 3] + 65525) / 65525, 1 / this.gamma) * 255);
            j += this.upsideDown ? -4 : 4;
            if (this.gradient) {
              d[i] = e * 3;
              e = f < this.threshold ? (this.upsideDown ? b[w - x - 1] |= 1 << p : b[x] |= 128 >> p, f) : f - 255;
              if (i > 0) {
                d[i - 1] += e;
              }
              d[i++] += e * 7;
            } else if (f < this.threshold) {
              this.upsideDown ? b[w - x - 1] |= 1 << p : b[x] |= 128 >> p;
            }
          }
        }
        r += `\x1B*\0${$(w & 255, w >> 8 & 255)}${b.map((c) => $(c)).join("")}\x1BJ${$(h * 2)}`;
      }
    }
    return r;
  }
};
var _fontb = {
  font: 1
};
var _star = {
  upsideDown: false,
  spacing: false,
  cutting: true,
  gradient: true,
  gamma: 1.8,
  threshold: 128,
  open(printer) {
    this.upsideDown = printer.upsideDown;
    this.spacing = printer.spacing;
    this.cutting = printer.cutting;
    this.gradient = printer.gradient;
    this.gamma = printer.gamma;
    this.threshold = printer.threshold;
    return `\x1B@\x1Ba\0\x1BF\0\x1B 0\x1Bs00${this.spacing ? "\x1Bz1" : "\x1B0"}${this.upsideDown ? "" : ""}`;
  },
  close() {
    return `${this.cutting ? this.cut() : ""}\x1B\0\0`;
  },
  area: (left, width, right) => `\x1Bl${$(0)}\x1BQ${$(left + width + right)}\x1Bl${$(left)}\x1BQ${$(left + width)}`,
  align: (align) => `\x1Ba${$(align)}`,
  absolute(position) {
    const p = position * this.charWidth;
    return `\x1BA${$(p & 255, p >> 8 & 255)}`;
  },
  relative(position) {
    const p = position * this.charWidth;
    return `\x1BR${$(p & 255, p >> 8 & 255)}`;
  },
  vrlf(vr) {
    return (this.upsideDown ? this.lf() : "") + (vr === this.upsideDown && this.spacing ? "\x1Bz1" : "\x1B0") + (this.upsideDown ? "" : this.lf());
  },
  cut: () => "\x1Bd3",
  ul: () => "\x1B-1",
  em: () => "\x1BE",
  iv: () => "\x1B4",
  wh: (wh) => `\x1Bi${wh < 3 ? $(wh >> 1 & 1, wh & 1) : $(wh - 2, wh - 2)}`,
  normal: () => `\x1B-0\x1BF\x1B5\x1Bi${$(0, 0)}`,
  text(text, encoding) {
    return encoding === "multilingual" ? this.multiconv(text) : this.codepage[encoding] + iconv.encode(text, encoding).toString("binary");
  },
  codepage: {
    cp437: "\x1Bt",
    cp852: "\x1Bt",
    cp858: "\x1Bt",
    cp860: "\x1Bt",
    cp863: "\x1Bt\b",
    cp865: "\x1Bt	",
    cp866: "\x1Bt\n",
    cp1252: "\x1Bt ",
    cp932: "\x1B$1\x1BR8",
    cp936: "",
    cp949: "\x1BRD",
    cp950: "",
    shiftjis: "\x1B$1\x1BR8",
    gb18030: "",
    ksc5601: "\x1BRD",
    big5: ""
  },
  multiconv: (text) => {
    let p = "";
    let r = "";
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c > "\x7F") {
        const d = multitable[c];
        if (d) {
          const q = d[0];
          if (p === q) {
            r += d[1];
          } else {
            r += `\x1Bt${starpage[q]}${d[1]}`;
            p = q;
          }
        } else {
          r += "?";
        }
      } else {
        r += c;
      }
    }
    return r;
  },
  lf: () => "\n",
  command: (command) => command,
  split: 2400,
  image(image, align, left, width, right) {
    const img = PNG.sync.read(Buffer.from(image, "base64"));
    const w = img.width;
    const d = Array(w).fill(0);
    const l = w + 7 >> 3;
    const s = [];
    let j = 0;
    for (let z = 0; z < img.height; z += this.split) {
      const h = Math.min(this.split, img.height - z);
      let r = `\x1BS${$(1, l & 255, l >> 8 & 255, h & 255, h >> 8 & 255, 0)}`;
      for (let y = 0; y < h; y++) {
        let i = 0;
        let e = 0;
        for (let x = 0; x < w; x += 8) {
          let b = 0;
          const q = Math.min(w - x, 8);
          for (let p = 0; p < q; p++) {
            const f = Math.floor((d[i] + e * 5) / 16 + __pow(((img.data[j] * 0.299 + img.data[j + 1] * 0.587 + img.data[j + 2] * 0.114 - 255) * img.data[j + 3] + 65525) / 65525, 1 / this.gamma) * 255);
            j += 4;
            if (this.gradient) {
              d[i] = e * 3;
              e = f < this.threshold ? (b |= 128 >> p, f) : f - 255;
              if (i > 0) {
                d[i - 1] += e;
              }
              d[i++] += e * 7;
            } else if (f < this.threshold) {
              b |= 128 >> p;
            }
          }
          r += $(b);
        }
      }
      s.push(r);
    }
    if (this.upsideDown) {
      s.reverse();
    }
    return this.area(left, width, right) + this.align(align) + s.join("");
  },
  qrcode(symbol, encoding) {
    const d = iconv.encode(symbol.data, encoding === "multilingual" ? "ascii" : encoding).toString("binary").slice(0, 7089);
    return `\x1ByS0${$(2)}\x1ByS1${$(this.qrlevel[symbol.level])}\x1ByS2${$(symbol.cell)}\x1ByD1${$(0, d.length & 255, d.length >> 8 & 255)}${d}\x1ByP`;
  },
  qrlevel: {
    l: 0,
    m: 1,
    q: 2,
    h: 3
  },
  barcode(symbol, encoding) {
    let d = iconv.encode(symbol.data, encoding === "multilingual" ? "ascii" : encoding).toString("binary");
    const b = this.bartype[symbol.type] - (/upc|[ej]an/.test(symbol.type) && symbol.data.length < 9);
    switch (b) {
      case this.bartype.upc - 1:
        d = this.upce(d);
        break;
      case this.bartype.code128:
        d = this.code128(d);
        break;
      default:
        break;
    }
    return `\x1Bb${$(b, symbol.hri ? 50 : 49, symbol.width + 47, symbol.height)}${d}`;
  },
  bartype: {
    upc: 49,
    ean: 51,
    jan: 51,
    code39: 52,
    itf: 53,
    codabar: 56,
    nw7: 56,
    code93: 55,
    code128: 54
  },
  upce: (data) => {
    let r = "";
    const s = data.replace(/((?!^0\d{6,7}$).)*/, "");
    if (s.length > 0) {
      r += s.slice(0, 3);
      switch (s[6]) {
        case "0":
        case "1":
        case "2":
          r += `${s[6]}0000${s[3]}${s[4]}${s[5]}`;
          break;
        case "3":
          r += `${s[3]}00000${s[4]}${s[5]}`;
          break;
        case "4":
          r += `${s[3] + s[4]}00000${s[5]}`;
          break;
        default:
          r += `${s[3] + s[4] + s[5]}0000${s[6]}`;
          break;
      }
    }
    return r;
  },
  code128: (data) => data.replace(/((?!^[\x00-\x7f]+$).)*/, "").replace(/%/g, "%0").replace(/[\x00-\x1f]/g, (m) => `%${$(m.charCodeAt(0) + 64)}`).replace(/\x7f/g, "%5")
};
var _line = {
  close() {
    return `${this.cutting ? this.cut() : ""}\x1B\0\0`;
  },
  image(image, align, left, width, right) {
    const img = PNG.sync.read(Buffer.from(image, "base64"));
    const w = img.width;
    const h = img.height;
    const d = Array(w).fill(0);
    const l = w + 7 >> 3;
    const s = [];
    let j = 0;
    for (let y = 0; y < h; y += 24) {
      let r = `\x1Bk${$(l & 255, l >> 8 & 255)}`;
      for (let z = 0; z < 24; z++) {
        if (y + z < h) {
          let i = 0;
          let e = 0;
          for (let x = 0; x < w; x += 8) {
            let b = 0;
            const q = Math.min(w - x, 8);
            for (let p = 0; p < q; p++) {
              const f = Math.floor((d[i] + e * 5) / 16 + __pow(((img.data[j] * 0.299 + img.data[j + 1] * 0.587 + img.data[j + 2] * 0.114 - 255) * img.data[j + 3] + 65525) / 65525, 1 / this.gamma) * 255);
              j += 4;
              if (this.gradient) {
                d[i] = e * 3;
                e = f < this.threshold ? (b |= 128 >> p, f) : f - 255;
                if (i > 0) {
                  d[i - 1] += e;
                }
                d[i++] += e * 7;
              } else if (f < this.threshold) {
                b |= 128 >> p;
              }
            }
            r += $(b);
          }
        } else {
          r += "\0".repeat(l);
        }
      }
      s.push(`${r}
`);
    }
    if (this.upsideDown) {
      s.reverse();
    }
    return `\x1B0${this.area(left, width, right)}${this.align(align)}${s.join("")}${this.spacing ? "\x1Bz1" : "\x1B0"}`;
  }
};
var _emu = {
  vrlf(vr) {
    return (vr === this.upsideDown && this.spacing ? "\x1Bz1" : "\x1B0") + this.lf();
  }
};
var _sbcs = {
  hr: (width) => `\x1Bt${"\xC4".repeat(width)}`,
  vr(widths, height) {
    return widths.reduce((a, w) => `${a + this.relative(w)}\xB3`, `\x1Bi${$(height - 1, 0)}\x1Bt\xB3`);
  },
  vrstart: (widths) => `\x1Bt${widths.reduce((a, w) => `${a + "\xC4".repeat(w)}\xC2`, "\xDA").slice(0, -1)}\xBF`,
  vrstop: (widths) => `\x1Bt${widths.reduce((a, w) => `${a + "\xC4".repeat(w)}\xC1`, "\xC0").slice(0, -1)}\xD9`,
  vrhr(widths1, widths2, dl, dr) {
    const r1 = `${" ".repeat(Math.max(-dl, 0)) + widths1.reduce((a, w) => `${a + "\xC4".repeat(w)}\xC1`, "\xC0").slice(0, -1)}\xD9${" ".repeat(Math.max(dr, 0))}`;
    const r2 = `${" ".repeat(Math.max(dl, 0)) + widths2.reduce((a, w) => `${a + "\xC4".repeat(w)}\xC2`, "\xDA").slice(0, -1)}\xBF${" ".repeat(Math.max(-dr, 0))}`;
    return `\x1Bt${r2.split("").map((c, i) => this.vrtable[c][r1[i]]).join("")}`;
  },
  vrtable: {
    " ": {
      " ": " ",
      \u00C0: "\xC0",
      \u00C1: "\xC1",
      \u00C4: "\xC4",
      \u00D9: "\xD9"
    },
    "\xBF": {
      " ": "\xBF",
      \u00C0: "\xC5",
      \u00C1: "\xC5",
      \u00C4: "\xC2",
      \u00D9: "\xB4"
    },
    \u00C2: {
      " ": "\xC2",
      \u00C0: "\xC5",
      \u00C1: "\xC5",
      \u00C4: "\xC2",
      \u00D9: "\xC5"
    },
    \u00C4: {
      " ": "\xC4",
      \u00C0: "\xC1",
      \u00C1: "\xC1",
      \u00C4: "\xC4",
      \u00D9: "\xC1"
    },
    \u00DA: {
      " ": "\xDA",
      \u00C0: "\xC3",
      \u00C1: "\xC5",
      \u00C4: "\xC2",
      \u00D9: "\xC5"
    }
  }
};
var _mbcs = {
  hr: (width) => `\x1B$0${"\x95".repeat(width)}`,
  vr(widths, height) {
    return widths.reduce((a, w) => `${a + this.relative(w)}\x96`, `\x1Bi${$(height - 1, 0)}\x1B$0\x96`);
  },
  vrstart: (widths) => `\x1B$0${widths.reduce((a, w) => `${a + "\x95".repeat(w)}\x91`, "\x9C").slice(0, -1)}\x9D`,
  vrstop: (widths) => `\x1B$0${widths.reduce((a, w) => `${a + "\x95".repeat(w)}\x90`, "\x9E").slice(0, -1)}\x9F`,
  vrhr(widths1, widths2, dl, dr) {
    const r1 = " ".repeat(Math.max(-dl, 0)) + widths1.reduce((a, w) => `${a + "\x95".repeat(w)}\x90`, dl > 0 ? "\x9E" : "\x9A").slice(0, -1) + (dr < 0 ? "\x9F" : "\x9B") + " ".repeat(Math.max(dr, 0));
    const r2 = " ".repeat(Math.max(dl, 0)) + widths2.reduce((a, w) => `${a + "\x95".repeat(w)}\x91`, dl < 0 ? "\x9C" : "\x98").slice(0, -1) + (dr > 0 ? "\x9D" : "\x99") + " ".repeat(Math.max(-dr, 0));
    return `\x1B$0${r2.split("").map((c, i) => this.vrtable[c][r1[i]]).join("")}`;
  },
  vrtable: {
    " ": {
      " ": " ",
      "\x90": "\x90",
      "\x95": "\x95",
      "\x9A": "\x9A",
      "\x9B": "\x9B",
      "\x9E": "\x9E",
      "\x9F": "\x9F"
    },
    "\x91": {
      " ": "\x91",
      "\x90": "\x8F",
      "\x95": "\x91",
      "\x9A": "\x8F",
      "\x9B": "\x8F",
      "\x9E": "\x8F",
      "\x9F": "\x8F"
    },
    "\x95": {
      " ": "\x95",
      "\x90": "\x90",
      "\x95": "\x95",
      "\x9A": "\x90",
      "\x9B": "\x90",
      "\x9E": "\x90",
      "\x9F": "\x90"
    },
    "\x98": {
      " ": "\x98",
      "\x90": "\x8F",
      "\x95": "\x91",
      "\x9A": "\x93",
      "\x9B": "\x8F",
      "\x9E": "\x93",
      "\x9F": "\x8F"
    },
    "\x99": {
      " ": "\x99",
      "\x90": "\x8F",
      "\x95": "\x91",
      "\x9A": "\x8F",
      "\x9B": "\x92",
      "\x9E": "\x8F",
      "\x9F": "\x92"
    },
    "\x9C": {
      " ": "\x9C",
      "\x90": "\x8F",
      "\x95": "\x91",
      "\x9A": "\x93",
      "\x9B": "\x8F",
      "\x9E": "\x93",
      "\x9F": "\x8F"
    },
    "\x9D": {
      " ": "\x9D",
      "\x90": "\x8F",
      "\x95": "\x91",
      "\x9A": "\x8F",
      "\x9B": "\x92",
      "\x9E": "\x8F",
      "\x9F": "\x92"
    }
  }
};
var _mbcs2 = {
  hr: (width) => "-".repeat(width),
  vr(widths, height) {
    return widths.reduce((a, w) => `${a + this.relative(w)}|`, `\x1Bi${$(height - 1, 0)}|`);
  },
  vrstart: (widths) => widths.reduce((a, w) => `${a + "-".repeat(w)}+`, "+"),
  vrstop: (widths) => widths.reduce((a, w) => `${a + "-".repeat(w)}+`, "+"),
  vrhr(widths1, widths2, dl, dr) {
    const r1 = " ".repeat(Math.max(-dl, 0)) + widths1.reduce((a, w) => `${a + "-".repeat(w)}+`, "+") + " ".repeat(Math.max(dr, 0));
    const r2 = " ".repeat(Math.max(dl, 0)) + widths2.reduce((a, w) => `${a + "-".repeat(w)}+`, "+") + " ".repeat(Math.max(-dr, 0));
    return r2.split("").map((c, i) => this.vrtable[c][r1[i]]).join("");
  },
  vrtable: {
    " ": { " ": " ", "+": "+", "-": "-" },
    "+": { " ": "+", "+": "+", "-": "+" },
    "-": { " ": "-", "+": "+", "-": "-" }
  }
};
var _stargraphic = {
  upsideDown: false,
  spacing: false,
  cutting: true,
  gradient: true,
  gamma: 1.8,
  threshold: 128,
  open(printer) {
    this.upsideDown = printer.upsideDown;
    this.spacing = printer.spacing;
    this.cutting = printer.cutting;
    this.gradient = printer.gradient;
    this.gamma = printer.gamma;
    this.threshold = printer.threshold;
    return `\x1Ba\0\x1B*rA\x1B*rP0\0${this.cutting ? "" : "\x1B*rE1\0"}`;
  },
  close() {
    return "\x1B*rB\x1B";
  },
  cut: () => "\x1B\f\0",
  lf() {
    return `\x1B*rY${this.charWidth * (this.spacing ? 2.5 : 2)}\0`;
  },
  command: (command) => command,
  image(image, align, left, width, right) {
    let r = "";
    const img = PNG.sync.read(Buffer.from(image, "base64"));
    const w = img.width;
    const d = Array(w).fill(0);
    const m = Math.max((this.upsideDown ? right : left) * this.charWidth + (width * this.charWidth - w) * (this.upsideDown ? 2 - align : align) >> 1, 0);
    const l = m + w + 7 >> 3;
    let j = this.upsideDown ? img.data.length - 4 : 0;
    for (let y = 0; y < img.height; y++) {
      let i = 0;
      let e = 0;
      r += `b${$(l & 255, l >> 8 & 255)}`;
      for (let x = 0; x < m + w; x += 8) {
        let b = 0;
        const q = Math.min(m + w - x, 8);
        for (let p = 0; p < q; p++) {
          if (m <= x + p) {
            const f = Math.floor((d[i] + e * 5) / 16 + __pow(((img.data[j] * 0.299 + img.data[j + 1] * 0.587 + img.data[j + 2] * 0.114 - 255) * img.data[j + 3] + 65525) / 65525, 1 / this.gamma) * 255);
            j += this.upsideDown ? -4 : 4;
            if (this.gradient) {
              d[i] = e * 3;
              e = f < this.threshold ? (b |= 128 >> p, f) : f - 255;
              if (i > 0) {
                d[i - 1] += e;
              }
              d[i++] += e * 7;
            } else if (f < this.threshold) {
              b |= 128 >> p;
            }
          }
        }
        r += $(b);
      }
    }
    return r;
  }
};
var _commands = {
  base: __spreadValues({}, _base),
  svg: __spreadValues(__spreadValues({}, _base), _svg),
  escpos: __spreadValues(__spreadValues(__spreadValues({}, _base), _escpos), _thermal),
  sii: __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, _base), _escpos), _thermal), _sii),
  citizen: __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, _base), _escpos), _thermal), _citizen),
  fit: __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, _base), _escpos), _thermal), _fit),
  impact: __spreadValues(__spreadValues(__spreadValues({}, _base), _escpos), _impact),
  impactb: __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, _base), _escpos), _impact), _fontb),
  starsbcs: __spreadValues(__spreadValues(__spreadValues({}, _base), _star), _sbcs),
  starmbcs: __spreadValues(__spreadValues(__spreadValues({}, _base), _star), _mbcs),
  starmbcs2: __spreadValues(__spreadValues(__spreadValues({}, _base), _star), _mbcs2),
  starlinesbcs: __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, _base), _star), _line), _sbcs),
  starlinembcs: __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, _base), _star), _line), _mbcs),
  starlinembcs2: __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, _base), _star), _line), _mbcs2),
  emustarlinesbcs: __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, _base), _star), _line), _emu), _sbcs),
  emustarlinembcs: __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, _base), _star), _line), _emu), _mbcs),
  emustarlinembcs2: __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, _base), _star), _line), _emu), _mbcs2),
  stargraphic: __spreadValues(__spreadValues({}, _base), _stargraphic)
};
var commands = Object.assign(/* @__PURE__ */ Object.create(null), _commands);
var receiptline = {
  getLangEncoding,
  commands,
  createTransform,
  transform
};
var receiptline_default = receiptline;

// src/designer.ts
var initialize = () => {
  const load = document.getElementById("load");
  const loaddialog = document.getElementById("loaddialog");
  const loadbox = document.getElementById("loadbox");
  const loadview = document.getElementById("loadview");
  const loadfile = document.getElementById("loadfile");
  const loadok = document.getElementById("loadok");
  const loadcancel = document.getElementById("loadcancel");
  const save = document.getElementById("save");
  const savedialog = document.getElementById("savedialog");
  const savebox = document.getElementById("savebox");
  const savetext = document.getElementById("savetext");
  const savesvg = document.getElementById("savesvg");
  const saveok = document.getElementById("saveok");
  const savecancel = document.getElementById("savecancel");
  const zoom = document.getElementById("zoom");
  const img = document.getElementById("img");
  const imgdialog = document.getElementById("imgdialog");
  const imgbox = document.getElementById("imgbox");
  const imgfile = document.getElementById("imgfile");
  const imgok = document.getElementById("imgok");
  const imgcancel = document.getElementById("imgcancel");
  const imgview = document.getElementById("imgview");
  const bar = document.getElementById("bar");
  const bardialog = document.getElementById("bardialog");
  const barbox = document.getElementById("barbox");
  const bardata = document.getElementById("bardata");
  const bartype = document.getElementById("bartype");
  const barwidth = document.getElementById("barwidth");
  const barheight = document.getElementById("barheight");
  const barhri = document.getElementById("barhri");
  const barok = document.getElementById("barok");
  const barcancel = document.getElementById("barcancel");
  const qr = document.getElementById("qr");
  const qrdialog = document.getElementById("qrdialog");
  const qrbox = document.getElementById("qrbox");
  const qrdata = document.getElementById("qrdata");
  const qrtype = document.getElementById("qrtype");
  const qrcell = document.getElementById("qrcell");
  const qrlevel = document.getElementById("qrlevel");
  const qrok = document.getElementById("qrok");
  const qrcancel = document.getElementById("qrcancel");
  const format = document.getElementById("format");
  const formatdialog = document.getElementById("formatdialog");
  const formatbox = document.getElementById("formatbox");
  const formatwidth = document.getElementById("formatwidth");
  const formatborder = document.getElementById("formatborder");
  const formattext = document.getElementById("formattext");
  const formatalign = document.getElementById("formatalign");
  const formatok = document.getElementById("formatok");
  const formatcancel = document.getElementById("formatcancel");
  const col = document.getElementById("col");
  const hr = document.getElementById("hr");
  const cut = document.getElementById("cut");
  const ul = document.getElementById("ul");
  const em = document.getElementById("em");
  const iv = document.getElementById("iv");
  const wh = document.getElementById("wh");
  const linewidth = document.getElementById("linewidth");
  const linespace = document.getElementById("linespace");
  const dots = document.getElementById("dots");
  const cpl = document.getElementById("cpl");
  const printerid = document.getElementById("printerid");
  const send = document.getElementById("send");
  const main = document.getElementById("main");
  const edit = document.getElementById("edit");
  const paper = document.getElementById("paper");
  const charWidth = 12;
  load.onclick = (event) => {
    loadbox.style.left = `${event.pageX}px`;
    loadbox.style.top = `${event.pageY}px`;
    loaddialog.style.display = "block";
  };
  loadfile.onclick = () => {
    loadfile.value = "";
  };
  loadfile.onchange = (event) => {
    var _a;
    const file = (_a = event.target) == null ? void 0 : _a.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        loadview.value = reader.result;
      };
      reader.readAsText(file);
    }
  };
  loadok.onclick = () => {
    edit.value = loadview.value;
    edit.oninput();
    loaddialog.style.display = "none";
  };
  loadcancel.onclick = () => {
    loaddialog.style.display = "none";
  };
  save.onclick = (event) => {
    savebox.style.left = `${event.pageX}px`;
    savebox.style.top = `${event.pageY}px`;
    savedialog.style.display = "block";
  };
  saveok.onclick = () => {
    const bom = new Uint8Array([239, 187, 191]);
    if (savetext.checked) {
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(new Blob([bom, edit.value], { type: "text/plain" }));
      a.download = "receiptline.txt";
      a.click();
    }
    if (savesvg.checked) {
      const encoding = receiptline_default.getLangEncoding(window.navigator.language);
      const printer = {
        cpl: Number(cpl.textContent),
        encoding,
        spacing: linespace.checked
      };
      const svg = receiptline_default.transform(edit.value, printer);
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(new Blob([bom, svg], { type: "image/svg+xml" }));
      a.download = "receiptline.svg";
      a.click();
    }
    savedialog.style.display = "none";
  };
  savecancel.onclick = () => savedialog.style.display = "none";
  zoom.oninput = () => edit.style.fontSize = `${zoom.value}px`;
  img.onclick = (event) => {
    imgbox.style.left = `${event.pageX}px`;
    imgbox.style.top = `${event.pageY}px`;
    imgdialog.style.display = "block";
  };
  let image = "";
  imgfile.onclick = () => {
    imgfile.value = "";
  };
  imgfile.onchange = (event) => {
    var _a;
    const file = (_a = event.target) == null ? void 0 : _a.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const im = new Image();
        im.onload = () => {
          imgview.width = im.width;
          imgview.height = im.height;
          imgview.getContext("2d").drawImage(im, 0, 0);
        };
        const result = reader.result;
        im.src = result;
        image = result.replace(/^data:image\/png;base64,(.*)$/, "$1");
      };
      reader.readAsDataURL(file);
    }
  };
  imgok.onclick = () => {
    insertText(edit, `{image:${image}}`, true);
    imgdialog.style.display = "none";
  };
  imgcancel.onclick = () => imgdialog.style.display = "none";
  bar.onclick = (event) => {
    barbox.style.left = `${event.pageX}px`;
    barbox.style.top = `${event.pageY}px`;
    bardialog.style.display = "block";
  };
  barok.onclick = () => {
    const code = bardata.value.replace(/[\\|{};]/g, "\\$&");
    const options = [bartype.value, barwidth.value, barheight.value, barhri.checked ? "hri" : "nohri"];
    insertText(edit, `{code:${code}; option:${options.join(",")}}`, true);
    bardialog.style.display = "none";
  };
  barcancel.onclick = () => bardialog.style.display = "none";
  qr.onclick = (event) => {
    qrbox.style.left = `${event.pageX}px`;
    qrbox.style.top = `${event.pageY}px`;
    qrdialog.style.display = "block";
  };
  qrok.onclick = () => {
    const code = qrdata.value.replace(/[\\|{};]/g, "\\$&");
    const options = [qrtype.value, qrcell.value, qrlevel.value];
    insertText(edit, `{code:${code}; option:${options.join(",")}}`, true);
    qrdialog.style.display = "none";
  };
  qrcancel.onclick = () => qrdialog.style.display = "none";
  format.onclick = (event) => {
    formatbox.style.left = `${event.pageX}px`;
    formatbox.style.top = `${event.pageY}px`;
    formatdialog.style.display = "block";
  };
  formatok.onclick = () => {
    const property = [];
    const width = formatwidth.value.replace(/[\\|{};]/g, "\\$&");
    const border = formatborder.value;
    const text = formattext.value;
    const align = formatalign.value;
    if (width.length > 0) {
      property.push(`width:${width}`);
    }
    if (border.length > 0) {
      property.push(`border:${border}`);
    }
    if (text.length > 0) {
      property.push(`text:${text}`);
    }
    if (align.length > 0) {
      property.push(`align:${align}`);
    }
    insertText(edit, `{${property.join(",")}}`, true);
    formatdialog.style.display = "none";
  };
  formatcancel.onclick = () => formatdialog.style.display = "none";
  col.onclick = () => insertText(edit, "|");
  hr.onclick = () => insertText(edit, "-", true);
  cut.onclick = () => insertText(edit, "=", true);
  ul.onclick = () => insertText(edit, "_");
  em.onclick = () => insertText(edit, '"');
  iv.onclick = () => insertText(edit, "`");
  wh.onclick = () => insertText(edit, "^");
  linewidth.oninput = () => {
    const lineWidthNumber = parseFloat(linewidth.value);
    paper.style.width = `${lineWidthNumber}px`;
    dots.textContent = linewidth.value;
    cpl.textContent = `${lineWidthNumber / charWidth}`;
    edit.oninput();
  };
  linespace.onchange = () => {
    edit.oninput();
  };
  (edit.oninput = () => {
    main.lang = window.navigator.language;
    const encoding = receiptline_default.getLangEncoding(window.navigator.language);
    const printer = {
      cpl: Number(cpl.textContent),
      encoding,
      spacing: linespace.checked
    };
    const svg = receiptline_default.transform(edit.value, printer);
    const dom = new DOMParser().parseFromString(svg, "image/svg+xml").documentElement;
    while (paper.hasChildNodes()) {
      paper.removeChild(paper.firstChild);
    }
    paper.appendChild(dom);
  })();
  printerid.oninput = () => {
    if (/^\w+$/.test(printerid.value)) {
      printerid.classList.remove("invalid");
      send.disabled = false;
    } else {
      printerid.classList.add("invalid");
      send.disabled = true;
    }
  };
  send.onclick = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", printerid.value);
    xhr.setRequestHeader("Content-Type", "text/plain; charset=utf-8");
    xhr.onload = () => alert(`${xhr.status} ${xhr.statusText} ${xhr.responseText}`);
    xhr.onabort = (e) => alert(e.type);
    xhr.onerror = (e) => alert(e.type);
    xhr.ontimeout = (e) => alert(e.type);
    xhr.timeout = 3e5;
    xhr.send(edit.value);
  };
  window.onbeforeunload = (event) => event.returnValue = "";
};
var insertText = (edit, text, lf) => {
  edit.focus();
  const p = edit.selectionStart;
  const q = edit.selectionEnd;
  const r = edit.value.slice(0, p);
  const s = edit.value.slice(q);
  if (lf) {
    if (/[^\n]$/.test(r)) {
      text = `
${text}`;
    }
    if (/^[^\n]/.test(s)) {
      text += "\n";
    }
  }
  edit.value = r + text + s;
  edit.selectionStart = edit.selectionEnd = p + text.length;
  edit.oninput();
};
var designer = { initialize, insertText };
var designer_default = designer;
