var sys = require("sys"),
    url = require("url"),
    path = require("path"),
    util = require("util"),
    step = require("step"),
    mime = require("mime"),
    fs = require("fs"),
    http = require("http"),
    _ = require("underscore"),
    select = require("soupselect").select,
    htmlparser = require("htmlparser"),
    connect = require("connect")


String.prototype.toSlug = function() {
  var string = this
  string = string.replace(/^\s+|\s+$/g, '')
  string = string.toLowerCase()
  
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;"
  var to   = "aaaaeeeeiiiioooouuuunc------"
  for (var i=0, l=from.length ; i<l ; i++) {
    string = string.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  string = string.replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return string
}

// var nothingElseMatters = {
//   "name": "Nothing Else Matters",
//   "cover": "/static/nothing-else-matters.jpg",
//   "audio": "/static/nothing-else-matters.mp3",
//   "lyrics": [[ 
//     { word: 'So', timing: 0 },
//     { word: 'close,', timing: 350 },
//     { word: 'no', timing: 700 },
//     { word: 'matter', timing: 1050 },
//     { word: 'how', timing: 1400 },
//     { word: 'far', timing: 1750 } ],
//   [ { word: 'Couldn\'t', timing: 2100 },
//     { word: 'be', timing: 2450 },
//     { word: 'much', timing: 2800 },
//     { word: 'more', timing: 3150 },
//     { word: 'from', timing: 3500 },
//     { word: 'the', timing: 3850 },
//     { word: 'heart', timing: 4200 } ],
//   [ { word: 'Forever', timing: 4550 },
//     { word: 'trust', timing: 4900 },
//     { word: 'in', timing: 5250 },
//     { word: 'who', timing: 5600 },
//     { word: 'we', timing: 5950 },
//     { word: 'are', timing: 6300 } ],
//   [ { word: 'And', timing: 6650 },
//     { word: 'nothing', timing: 7000 }, 
//     { word: 'else', timing: 7350 },
//     { word: 'matters', timing: 7700 } ],
//   [ { word: 'Never', timing: 8050 },
//     { word: 'opened', timing: 8400 },
//     { word: 'myself', timing: 8750 },
//     { word: 'this', timing: 9100 },
//     { word: 'way', timing: 9450 } ],
//   [ { word: 'Life', timing: 9800 },
//     { word: 'is', timing: 10150 },
//     { word: 'ours,', timing: 10500 },
//     { word: 'we', timing: 10850 },
//     { word: 'live', timing: 11200 },
//     { word: 'it', timing: 11550 },
//     { word: 'our', timing: 11900 },
//     { word: 'way', timing: 12250 } ],
//   [ { word: 'All', timing: 12600 },
//     { word: 'these', timing: 12950 },
//     { word: 'words,', timing: 13300 },
//     { word: 'I', timing: 13650 },
//     { word: 'don\'t', timing: 14000 },
//     { word: 'just', timing: 14350 },
//     { word: 'say', timing: 14700 } ],
//   [ { word: 'And', timing: 15050 },
//     { word: 'nothing', timing: 15400 },
//     { word: 'else', timing: 15750 },
//     { word: 'matters', timing: 16100 } ],
//   [ { word: 'Trust', timing: 16450 },
//     { word: 'I', timing: 16800 },
//     { word: 'seek', timing: 17150 },
//     { word: 'and', timing: 17500 },
//     { word: 'I', timing: 17850 },
//     { word: 'find', timing: 18200 },
//     { word: 'in', timing: 18550 },
//     { word: 'you', timing: 18900 } ],
//   [ { word: 'Every', timing: 19250 },
//     { word: 'day', timing: 19600 },
//     { word: 'for', timing: 19950 },
//     { word: 'us', timing: 20300 },
//     { word: 'something', timing: 20650 },
//     { word: 'new', timing: 21000 } ],
//   [ { word: 'Open', timing: 21350 },
//     { word: 'mind', timing: 21700 },
//     { word: 'for', timing: 22050 },
//     { word: 'a', timing: 22400 },
//     { word: 'different', timing: 22750 },
//     { word: 'view', timing: 23100 } ],
//   [ { word: 'And', timing: 23450 },
//     { word: 'nothing', timing: 23800 },
//     { word: 'else', timing: 24150 },
//     { word: 'matters', timing: 24500 } ],
//   [ { word: 'Never', timing: 24850 },
//     { word: 'cared', timing: 25200 },
//     { word: 'for', timing: 25550 },
//     { word: 'what', timing: 25900 },
//     { word: 'they', timing: 26250 },
//     { word: 'do', timing: 26600 } ],
//   [ { word: 'Never', timing: 26950 },
//     { word: 'cared', timing: 27300 },
//     { word: 'for', timing: 27650 },
//     { word: 'what', timing: 28000 },
//     { word: 'they', timing: 28350 },
//     { word: 'know', timing: 28700 } ],
//   [ { word: 'And', timing: 29050 }, 
//     { word: 'I', timing: 29400 },
//     { word: 'know', timing: 29750 } ],
//   [ { word: 'So', timing: 30100 },
//     { word: 'close,', timing: 30450 },
//     { word: 'no', timing: 30800 },
//     { word: 'matter', timing: 31150 },
//     { word: 'how', timing: 31500 },
//     { word: 'far', timing: 31850 } ],
//   [ { word: 'Couldn\'t', timing: 32200 },
//     { word: 'be', timing: 32550 },
//     { word: 'much', timing: 32900 },
//     { word: 'more', timing: 33250 },
//     { word: 'from', timing: 33600 },
//     { word: 'the', timing: 33950 },
//     { word: 'heart', timing: 34300 } ],
//   [ { word: 'Forever', timing: 34650 },
//     { word: 'trusting', timing: 35000 },
//     { word: 'who', timing: 35350 },
//     { word: 'we', timing: 35700 },
//     { word: 'are', timing: 36050 } ],
//   [ { word: 'And', timing: 36400 },
//     { word: 'nothing', timing: 36750 },
//     { word: 'else', timing: 37100 },
//     { word: 'matters', timing: 37450 } ],
//   [ { word: 'Never', timing: 37800 },
//     { word: 'cared', timing: 38150 },
//     { word: 'for', timing: 38500 },
//     { word: 'what', timing: 38850 },
//     { word: 'they', timing: 39200 },
//     { word: 'do', timing: 39550 } ],
//   [ { word: 'Never', timing: 39900 },
//     { word: 'cared', timing: 40250 },
//     { word: 'for', timing: 40600 },
//     { word: 'what', timing: 40950 },
//     { word: 'they', timing: 41300 },
//     { word: 'know', timing: 41650 } ],
//   [ { word: 'And', timing: 42000 },
//     { word: 'I', timing: 42350 },
//     { word: 'know,', timing: 42700 },
//     { word: 'yeah', timing: 43050 } ],
//   [ { word: 'I', timing: 43400 },
//     { word: 'never', timing: 43750 },
//     { word: 'opened', timing: 44100 },
//     { word: 'myself', timing: 44450 },
//     { word: 'this', timing: 44800 },
//     { word: 'way', timing: 45150 } ],
//   [ { word: 'Life', timing: 45500 },
//     { word: 'is', timing: 45850 },
//     { word: 'ours,', timing: 46200 },
//     { word: 'we', timing: 46550 },
//     { word: 'live', timing: 46900 },
//     { word: 'it', timing: 47250 },
//     { word: 'our', timing: 47600 },
//     { word: 'way', timing: 47950 } ],
//   [ { word: 'All', timing: 48300 },
//     { word: 'these', timing: 48650 },
//     { word: 'words,', timing: 49000 },
//     { word: 'I', timing: 49350 },
//     { word: 'don\'t', timing: 49700 },
//     { word: 'just', timing: 50050 },
//     { word: 'say', timing: 50400 } ],
//   [ { word: 'And', timing: 50750 },
//     { word: 'nothing', timing: 51100 },
//     { word: 'else', timing: 51450 },
//     { word: 'matters', timing: 51800 } ],
//   [ { word: 'Trust', timing: 52150 },
//     { word: 'I', timing: 52500 },
//     { word: 'seek', timing: 52850 },
//     { word: 'and', timing: 53200 },
//     { word: 'I', timing: 53550 },
//     { word: 'find', timing: 53900 },
//     { word: 'in', timing: 54250 },
//     { word: 'you', timing: 54600 } ],
//   [ { word: 'Every', timing: 54950 },
//     { word: 'day', timing: 55300 },
//     { word: 'for', timing: 55650 },
//     { word: 'us', timing: 56000 },
//     { word: 'something', timing: 56350 },
//     { word: 'new', timing: 56700 } ],
//   [ { word: 'Open', timing: 57050 },
//     { word: 'mind', timing: 57400 },
//     { word: 'for', timing: 57750 },
//     { word: 'a', timing: 58100 },
//     { word: 'different', timing: 58450 },
//     { word: 'view', timing: 58800 } ],
//   [ { word: 'And', timing: 59150 },
//     { word: 'nothing', timing: 59500 },
//     { word: 'else', timing: 59850 },
//     { word: 'matters', timing: 60200 } ],
//   [ { word: 'Never', timing: 60550 },
//     { word: 'cared', timing: 60900 },
//     { word: 'for', timing: 61250 },
//     { word: 'what', timing: 61600 },
//     { word: 'they', timing: 61950 },
//     { word: 'say', timing: 62300 } ],
//   [ { word: 'Never', timing: 62650 },
//     { word: 'cared', timing: 63000 },
//     { word: 'for', timing: 63350 },
//     { word: 'games', timing: 63700 },
//     { word: 'they', timing: 64050 },
//     { word: 'play', timing: 64400 } ],
//   [ { word: 'Never', timing: 64750 },
//     { word: 'cared', timing: 65100 },
//     { word: 'for', timing: 65450 },
//     { word: 'what', timing: 65800 },
//     { word: 'they', timing: 66150 },
//     { word: 'do', timing: 66500 } ],
//   [ { word: 'Never', timing: 66850 },
//     { word: 'cared', timing: 67200 },
//     { word: 'for', timing: 67550 },
//     { word: 'what', timing: 67900 },
//     { word: 'they', timing: 68250 },
//     { word: 'know', timing: 68600 } ],
//   [ { word: 'And', timing: 68950 },
//     { word: 'I', timing: 69300 },
//     { word: 'know,', timing: 69650 },
//     { word: 'ooh,', timing: 70000 },
//     { word: 'yeah', timing: 70350 } ],
//   [ { word: 'So', timing: 70700 },
//     { word: 'close,', timing: 71050 },
//     { word: 'no', timing: 71400 },
//     { word: 'matter', timing: 71750 },
//     { word: 'how', timing: 72100 },
//     { word: 'far', timing: 72450 } ],
//   [ { word: 'Couldn\'t', timing: 72800 },
//     { word: 'be', timing: 73150 },
//     { word: 'much', timing: 73500 },
//     { word: 'more', timing: 73850 },
//     { word: 'from', timing: 74200 },
//     { word: 'the', timing: 74550 },
//     { word: 'heart', timing: 74900 } ],
//   [ { word: 'Forever', timing: 75250 },
//     { word: 'trust', timing: 75600 },
//     { word: 'in', timing: 75950 },
//     { word: 'who', timing: 76300 },
//     { word: 'we', timing: 76650 },
//     { word: 'are', timing: 77000 } ],
//   [ { word: 'No,', timing: 77350 },
//     { word: 'nothing', timing: 77700 },
//     { word: 'else', timing: 78050 },
//     { word: 'matters', timing: 78400 }
//   ]]
// }

var sereNereLyrics = [
  [ { word: 'Mentre', timing: 0 },
    { word: 'passa', timing: 170 },
    { word: 'distratta', timing: 350 },
    { word: 'la', timing: 530 },
    { word: 'tua', timing: 830 },
    { word: 'voce', timing: 1020 },
    { word: 'alla', timing: 1690 },
    { word: 'tv', timing: 2040 } ],
  [ { word: 'Tra', timing: 2900 },
    { word: 'la', timing: 3300 },
    { word: 'radio', timing: 3700 },
    { word: 'e', timing: 4010 },
    { word: 'il', timing: 4490 },
    { word: 'telefono', timing: 6990 },
    { word: 'risuonerà', timing: 7230 },
    { word: 'il', timing: 7440 },
    { word: 'tuo', timing: 7710 },
    { word: 'addio', timing: 8170 } ],
  [ { word: 'Di', timing: 8700 },
    { word: 'sere', timing: 9000 },
    { word: 'nere', timing: 9750 } ],
  [ { word: 'Che', timing: 10231 },
    { word: 'non', timing: 11140 },
    { word: 'see\'è', timing: 11450 },
    { word: 'tempo', timing: 12250 } ],
  [ { word: 'Non', timing: 14120 },
    { word: 'see\'è', timing: 14530 },
    { word: 'spazio', timing: 14920 } ],
  [ { word: 'E', timing: 17991 },
    { word: 'mai', timing: 20930 },
    { word: 'nessuno', timing: 21821 },
    { word: 'capirà', timing: 22030 } ],
  [ { word: 'Puoi', timing: 22200 },
    { word: 'rimanere', timing: 22530 } ]
]


var connections = {}, port = 3009, host = "0.0.0.0"


function waitForContent(response, callback, encoding) {
  var encoding = encoding || "utf8",
      contentLength = parseInt(response.headers["content-length"], 10),
      buffer = new Buffer(contentLength, encoding),
      offset = 0
  response.setEncoding(encoding || "utf8")
  response.on("data", function(chunk) {
    buffer.write(chunk, encoding, offset)
    offset += Buffer.byteLength(chunk, encoding)
  })
  response.on("end", function() {
    callback(null, buffer)
  })
}

function waitForJsonContent(response, callback, contentForFailure) {
  var encoding = "utf8"
  contentForFailure = contentForFailure || {}
  waitForContent(response, function(error, content) {
    if (error) {
      return callback(error, contentForFailure)
    }
    try {
      callback(null, JSON.parse(content.toString(encoding)))
    } catch(exception) {
      callback(exception, contentForFailure)
    }
  }, encoding)
}

var searchSong = (function() {
  var playme = "api.playme.com",
      client = http.createClient(80, playme),
      searchFor = { 
        "protocol": "http:",
        "slashes": true,
        "host": playme,
        "hostname": playme,
        "pathname": "/track.search",
        "query": {
          "country": "it",
          "apikey": "586752545943734956",
          "format": "json"
        }
      }

  return function(title, callback) {
    client
      .request("GET", url.format(_(searchFor).extend({"query": _(searchFor.query).extend({"query": title})})), {"host": playme})
      .on("response", function(response) {
        waitForJsonContent(response, function(error, allSongs) {
          if (error) return callback(error, {})
          if (allSongs.response.tracks.length === 0) {
            return callback("No songs found for title: " + title, {})
          }
          callback(error, _(allSongs.response.tracks).first())
        }, {})
      })
      .end()
  }
})()


function cacheResourceFor(song, resourceUrl, resourceExtensionType, callback) {
  resourceUrl = url.parse(resourceUrl)
  var resourcePath = path.join("static", song.name.toSlug() + "." + resourceExtensionType),
      cachePath = path.join(__dirname, resourcePath),
      cache = fs.createWriteStream(cachePath, {"flags": "w+"})

  // path.exists(cachePath, function(resourceExists) {
    // if (resourceExists) return callback(null, resourcePath)
    http.get({ "host": resourceUrl.host, "path": resourceUrl.pathname }, function(response) {
      if (response.statusCode !== 200) {
        return callback("request for " + url.format(resourceUrl) + " went wrong: " + response.statusCode)
      }
      response.on("data", function(chunk) {
        cache.write(chunk, "binary")
      })
      response.on("end", function() {
        cache.end()
        callback(null, resourcePath)
      })
    })
  // })
}

function cacheResourcesFrom(song, callback) {
  step(
    function cacheAll() {
      cacheResourceFor(song, song.previewUrl, "mp3", this.parallel())
      cacheResourceFor(song, song.images["img_256"], "jpg", this.parallel())
    },
    callback
  )
}

// searchLyricsForSong("sere nere", function(error, lyricsWithTimings) {
//   util.log(util.inspect(error))
//   util.log(util.inspect(lyricsWithTimings))
// })

// searchSong("sere nere", function(error, song) {
//   // util.log(util.inspect(error))
//   // util.log(util.inspect(allDataAboutSong, false, null))
//   cacheResourcesFrom(song, function(error, pathToAudio, pathToCover) {
//     if (error) {
//       util.log(error)
//     } else {
//       util.log(pathToAudio)
//       util.log(pathToCover)
//     }
//   })
// })

// var searchLyricsForSong = (function() {
//   var instalyrics = "instalyrics.com",
//       client = http.createClient(80, instalyrics),
//       searchFor = { 
//         "protocol": "http:",
//         "slashes": true,
//         "host": "instalyrics.com",
//         "hostname": "instalyrics.com",
//         "pathname": "/search"
//       }
// 
//   return function(title, callback) {
//     client
//       .request("GET", url.format(_(searchFor).extend({"query": {"q": title, "t": "q"}})), {"host": instalyrics})
//       .on("response", function(response) {
//         waitForContent(response, function(error, body) {
//           new htmlparser.Parser(new htmlparser.DefaultHandler(function(error, dom) {
//             if (error) {
//               return callback(error, [])
//             }
//             _(select(dom, "#lyrics-body pre")).chain().first().tap(function(element) {
//               if (!element) {
//                 return callback("No lyrics found for...", [])
//               }
//               callback(null,
//                 _(element.children[0].raw.split(/\r\n|\n/)).chain()
//                   .reject(function(line) { return line.length === 0 })
//                   .map(function(line) {
//                     return _(line.split(/\s+/)).map(function(word) {
//                       return { "word": word, "timing": 0 }
//                     })
//                   })
//                   .value()
//               )
//             })
//           })).parseComplete(body)
//         })
// 
//       })
//       .end()
//   }
// })()

var server = 
  connect(
    connect.favicon(),
    connect.logger({ "buffer": true }),
    connect.router(function(resource) {
      resource.get("/song", function(request, response) {
        searchSong("sere nere", function(error, song) {
          cacheResourcesFrom(song, function(error, pathToAudio, pathToCover) {
            if (error) {
              response.writeHead(500, { "Content-Type": "application/json" })
              response.end(JSON.stringify({ "error": error.toString }))
              return
            }
            response.writeHead(200, { "Content-Type": "application/json" })
            response.end(JSON.stringify({
              "id": song.trackCode,
              "name": song.name,
              "cover": pathToCover,
              "mp3": pathToAudio,
              "lyrics": sereNereLyrics
            }))
          })
        })
      })
    }))
  .use("/static", connect.static(path.join(__dirname, "static"), { "cache": true }))
  .listen(port, host)
