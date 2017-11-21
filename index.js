var cheerio = require('cheerio');
var http = require('https');
var iconv = require('iconv-lite');
var fs    = require('fs')

var url = 'https://bj.lianjia.com/chengjiao/daxing/pg2ddo22ng1hu1y1/';

http.get(url, function(sres) {
  var chunks = [];
  sres.on('data', function(chunk) {
    chunks.push(chunk);
  });
  // chunks里面存储着网页的 html 内容，将它zhuan ma传给 cheerio.load 之后
  // 就可以得到一个实现了 jQuery 接口的变量，将它命名为 `$`
  // 剩下就都是 jQuery 的内容了
  sres.on('end', function() {
    var titles = [];
    //由于咱们发现此网页的编码格式为gb2312，所以需要对其进行转码，否则乱码
    //依据：“<meta http-equiv="Content-Type" content="text/html; charset=gb2312">”
    var html = iconv.decode(Buffer.concat(chunks), 'utf-8');
    var $ = cheerio.load(html, {decodeEntities: false});
    $('.listContent li .info').each(function (idx, element) {
      var $element = $(element);
      titles.push({
        title: $element.find('.title>a').text(),
        time: $element.find('.address>.dealDate').text(),
        price:$element.find('.address>.totalPrice>.number').text()
      })
    })    
    var titles = JSON.stringify(titles)
    console.log(titles);
    fs.writeFile("data.json",titles,function  (err) {
    	if (err) throw err;
    	console.log("保存成功")
    })
    
  });
});