var Excel = require('exceljs');

var start_time = new Date();
var workbook = new Excel.stream.xlsx.WorkbookWriter({
  filename: './streamed-workbook.xlsx'
});
var worksheet = workbook.addWorksheet('Sheet');

worksheet.columns = [
  { header: 'id', key: 'id' },
  { header: 'name', key: 'name' },
  { header: 'phone', key: 'phone' }
];

var data = [{
  id: 100,
  name: 'abc',
  phone: '123456789'
},{
  id: 9,
  name: 'abc',
  phone: '123456789'
},{
  id: 10,
  name: 'abc',
  phone: '123456789'
}];
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

//作者：千罹
//链接：http://www.jianshu.com/p/8aa148435499
//來源：简书
//著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。