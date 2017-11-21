var cheerio = require('cheerio');
var http = require('https');
var iconv = require('iconv-lite');
var fs    = require('fs')
var Excel = require('exceljs');

//var url = 'http://www.ygdy8.net/html/gndy/dyzz/index.html';

var index = 1; //页面数控制
var url = 'https://bj.lianjia.com/chengjiao/daxing/pg';
var titles = []; //用于保存title

function getTitle(url, i) {
  console.log("正在获取第" + i + "页的内容"); 
  http.get(url + i + 'ddo22ng1hu1y1/', function(sres) {
    var chunks = [];
    sres.on('data', function(chunk) {
      chunks.push(chunk);
    });
    sres.on('end', function() {
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
      if(i < 200) { //为了方便只爬了两页
        getTitle(url, ++index); //递归执行，页数+1
      } else {
        console.log(titles); 
        console.log("Title获取完毕！");
       
      }
      
        fs.writeFile("a.json",JSON.stringify(titles),function (err) {
        	if(err) throw err;
        	console.log('文件保存成功')
        })
       
        var start_time = new Date();
		var workbook = new Excel.stream.xlsx.WorkbookWriter({
		  filename: './lj.xlsx'
		});
		var worksheet = workbook.addWorksheet('Sheet');
		
		worksheet.columns = [
		  { header: '标题', key: 'title' },
		  { header: '时间', key: 'time' },
		  { header: '价格', key: 'price' }
		];
		
		var data = titles;
		var length = data.length;
		
		// 当前进度
		var current_num = 0;
		var time_monit = 400;
		var temp_time = Date.now();
		
		console.log('开始添加数据');
		// 开始添加数据
		for(let i in data) {
		  worksheet.addRow(data[i]).commit();
		  current_num = i;
		  if(Date.now() - temp_time > time_monit) {
		    temp_time = Date.now();
		    console.log((current_num / length * 100).toFixed(2) + '%');
		  }
		}
		console.log('添加数据完毕：', (Date.now() - start_time));
		workbook.commit();
		
		var end_time = new Date();
		var duration = end_time - start_time;
		
		console.log('用时：' + duration);
		console.log("程序执行完毕");
    });
  });
}

		function main() {
		  console.log("开始爬取");
		  getTitle(url, index);
		}
		
		main(); //运行主函数