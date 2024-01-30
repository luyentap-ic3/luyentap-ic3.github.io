let sheetID = '1soOOOMYSdq89r7CHVtMi10Na7tuP2RoAf6J8cACKzrY';
let base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
let linkBackToLogInPage = "http://localhost/3_Website_LuyenIC3/CongCu-DeCode/analysis/index.html";
let data1 = [];
let listUnitLT = [];
let listUnitTT = [];
let listDataAnalysis = [];
let user1 = "";
let end_time1 = "";
let checkRow1 = false;
window.onload = init;

function init() {
  checkCookie();
  renderNameUsr();
  getListUnit();
  logOut();
}

function renderNameUsr(){
  document.getElementById("nameUsr").innerHTML = getCookie("nameUsr");
}

function actionLoadListUnit(lstU1,lstU2){
  var htmlListUnit1 = "<option value=\"0\">-----</option>";
  
  for(var i=0; i<lstU1.length; i++){
    htmlListUnit1 = htmlListUnit1
                  + "<option value=\""
                  + lstU1[i]["id"]
                  + "\">"
                  + lstU1[i]["nametodo"]
                  + "</option>";
  }

  var htmlListUnit2 = "";
  for(var i=0; i<lstU2.length; i++){
    htmlListUnit2 = htmlListUnit2
                  + "<option value=\""
                  + lstU2[i]["id"]
                  + "\">"
                  + lstU2[i]["nametodo"]
                  + "</option>";
  }
  var htmlSelectUnit = "<label>Chọn Bài:&ensp;</label>"
                      + "<select id=\"select-unit-analysis\" onchange=\"renderDataUnitAnalysis()\" required>"
                      + htmlListUnit1
                      + htmlListUnit2
                      + "</select>";
  htmlSelectUnit = htmlSelectUnit + "<hr>";
  document.getElementById("select-tool").innerHTML = htmlSelectUnit;
}

function getListUnit(){
  listUnitLT = [];
  var sheetName = 'CC1_LV2';
  var qu_AllData = 'Select B, E';
  var queryAllData = encodeURIComponent(qu_AllData);
  var urlAllData = `${base}&sheet=${sheetName}&tq=${queryAllData}`;
  fetch(urlAllData)
  .then(res => res.text())
  .then(rep => {                
      const jsData = JSON.parse(rep.substr(47).slice(0, -2));
      const colz = [];
      jsData.table.cols.forEach((heading) => {
          if (heading.label) {
              colz.push(heading.label.toLowerCase().replace(/\s/g, ''));
          }
      })
      jsData.table.rows.forEach((main) => {
          const row = {};
          colz.forEach((ele, ind) => {
              row[ele] = (main.c[ind] != null) ? main.c[ind].v : '';
          })
          listUnitLT.push(row);
      })
      getListUnit2(listUnitLT);
  });
}

function getListUnit2(listUnitLT){
  listUnitTT = [];
  var sheetName = 'CC2_LV2';
  var qu_AllData = 'Select B, E';
  var queryAllData = encodeURIComponent(qu_AllData);
  var urlAllData = `${base}&sheet=${sheetName}&tq=${queryAllData}`;
  fetch(urlAllData)
  .then(res => res.text())
  .then(rep => {                
      const jsData = JSON.parse(rep.substr(47).slice(0, -2));
      const colz = [];
      jsData.table.cols.forEach((heading) => {
          if (heading.label) {
              colz.push(heading.label.toLowerCase().replace(/\s/g, ''));
          }
      })
      jsData.table.rows.forEach((main) => {
          const row = {};
          colz.forEach((ele, ind) => {
              row[ele] = (main.c[ind] != null) ? main.c[ind].v : '';
          })
          listUnitTT.push(row);
      })
      actionLoadListUnit(listUnitLT,listUnitTT);
  });
}

function renderDataUnitAnalysis(){
  var unitSelected = document.getElementById("select-unit-analysis");
  unitSelected = unitSelected.value;
  //console.log(unitSelected);
  listDataAnalysis = [];
  var sheetName = 'Result_All';
  var qu_AllData = 'Select D, E, F WHERE C = \"' + unitSelected + '\"';
  var queryAllData = encodeURIComponent(qu_AllData);
  var urlAllData = `${base}&sheet=${sheetName}&tq=${queryAllData}`;
  fetch(urlAllData)
  .then(res => res.text())
  .then(rep => {                
      const jsData = JSON.parse(rep.substr(47).slice(0, -2));
      const colz = [];
      jsData.table.cols.forEach((heading) => {
          if (heading.label) {
              colz.push(heading.label.toLowerCase().replace(/\s/g, ''));
          }
      })
      jsData.table.rows.forEach((main) => {
          const row = {};
          colz.forEach((ele, ind) => {
              row[ele] = (main.c[ind] != null) ? main.c[ind].v : '';
          })
          listDataAnalysis.push(row);
      })
      renderToTableDataAnalysis(listDataAnalysis);
  });
}

function renderToTableDataAnalysis(lstLoadData){
  
  if(lstLoadData.length == 0){
    document.getElementById("main").innerHTML = "<h2><span style=\"color:blue;font-weight:bold;font-style:italic\">Chưa có dữ liệu!</span></h2>";
  }
  else{
    var htmlListForm = "";
    htmlListForm = htmlListForm + "<table class=\"table-form-real-estate-CongVu\">"
                                + "<tr class=\"table-row-form-real-estate-CongVu\">"
                                + "<th class=\"table-header-form-real-estate-CongVu\">STT</th>"
                                + "<th class=\"table-header-form-real-estate-CongVu\">Ngày Nộp Bài</th>"
                                + "<th class=\"table-header-form-real-estate-CongVu\">Giờ Nộp Bài</th>"
                                + "<th class=\"table-header-form-real-estate-CongVu\">Thời Gian Làm Bài</th>"
                                + "<th class=\"table-header-form-real-estate-CongVu\">Điểm</th>"
                                + "</tr>";
    
    for(var count=0; count<lstLoadData.length; count++){
        var d = lstLoadData[count]['time'];
        d = d.slice(d.indexOf("(")+1,d.indexOf(")"));
        var dDetail = [];
        var iStart = 0;
        for(var i=0; i<d.length; i++){
            if(d[i] == ","){
                dDetail.push(d.slice(iStart,i));
                iStart = i+1;
            }
        }
        dDetail.push(d.slice(iStart,d.length));
        dDetail[1] = (Number(dDetail[1]) + 1).toString();

        var dDuration = Number(lstLoadData[count]['duration']);
        var dMinute = Math.floor(dDuration/60);
        var dSecond = dDuration%60;
        htmlListForm = htmlListForm + "<tr "
                                    + " class=\"table-row-form-real-estate-CongVu\">"
                                    + "<td class=\"table-data-form-real-estate-CongVu\">"
                                    + (count+1).toString()
                                    + "</td>"
                                    + "<td class=\"table-data-form-real-estate-CongVu\">"
                                    + dDetail[2]+"/" + dDetail[1]+"/" + dDetail[0]
                                    + "</td>"
                                    + "<td class=\"table-data-form-real-estate-CongVu\">"
                                    + dDetail[3]+":" + dDetail[4]+":" + dDetail[5]
                                    + "</td>"
                                    + "<td class=\"table-data-form-real-estate-CongVu\" style=\"text-align:center;\">"
                                    + dMinute.toString() + " phút " + dSecond.toString() + " giây"
                                    + "</td>"
                                    + "<td class=\"table-data-form-real-estate-CongVu\" style=\"font-weight: bold; text-align:center; color:blue;\">"
                                    + lstLoadData[count]['score']
                                    + "</td>"
                                    + "</tr>"
    }
    htmlListForm = htmlListForm + "</table>";
    document.getElementById("main").innerHTML = htmlListForm;
  }
}

function checkCookie() {
    //Up
    let ur = getCookie("usr");
    var sheetName = 'LogIn2';
    var qu_AllData = 'Select A, D, I WHERE A = \"' + ur + '\"';
    var queryAllData = encodeURIComponent(qu_AllData);
    var urlAllData = `${base}&sheet=${sheetName}&tq=${queryAllData}`;
    fetch(urlAllData)
    .then(res => res.text())
    .then(rep => {                
        const jsData = JSON.parse(rep.substr(47).slice(0, -2));
        const colz = [];
        jsData.table.cols.forEach((heading) => {
            if (heading.label) {
                colz.push(heading.label.toLowerCase().replace(/\s/g, ''));
            }
        })
        
        jsData.table.rows.forEach((main) => {
            const row = {};
            colz.forEach((ele, ind) => {
                row[ele] = (main.c[ind] != null) ? main.c[ind].v : '';
            })
            data1 = Object.keys(row).map((key) => [key, row[key]]);
            user1 = data1[0][1].toString();
            end_time1 = data1[1][1].toString();
            setCookie("nameUsr",data1[2][1].toString(),2);
            checkLogIn1(ur);
            checkRow1 = true;
        })
        if(checkRow1 == false){
            checkLogIn1(ur);
        }
    })
}

function checkLogIn1(ur){
    var currentDate = new Date();
    if(user1 == ur){
        if(currentDate.getUTCFullYear() > Number(end_time1.slice(5,9))){
            backToLogInPage();
        }
        else if(currentDate.getUTCFullYear() == Number(end_time1.slice(5,9))){
            var strMonth_Day_Tmp = end_time1.slice(end_time1.indexOf(",")+1,end_time1.length-1);
            var strMonth = strMonth_Day_Tmp.slice(0,strMonth_Day_Tmp.indexOf(","));
            if(currentDate.getUTCMonth() > Number(strMonth)){
                backToLogInPage();
            }
            else if(currentDate.getUTCMonth() == Number(strMonth)){
                var strDay = strMonth_Day_Tmp.slice(strMonth_Day_Tmp.indexOf(",")+1,strMonth_Day_Tmp.length);
                if(currentDate.getUTCDate() > Number(strDay)){
                    backToLogInPage();
                }
                else{
                    return;
                }
            }
            else{
                return;
            }
        }
        else{
            return;
        }  
    }
    else{
        backToLogInPage();
    }
}

function backToLogInPage(){
    alert("Bạn cần đăng nhập lại để tiếp tục!");
    window.location.href = linkBackToLogInPage;
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function setCookie(cname,cvalue,exhours) {
  const d = new Date();
  d.setTime(d.getTime() + (exhours*60*60*1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  // document.cookie = courseName + "=" + courseValue + ";" + expires + ";path=/";
  // document.cookie = achievementsOfUserName + "=" + achievementsOfUserValue + ";" + expires + ";path=/";
  
}

function logOut(){   
    var htmlLogOut = "";
    htmlLogOut = "<div><button class=\"btn-log-out\" onclick=\"actionLogOut()\"><b>Đăng Xuất</b></button></div>"
                    
    document.getElementById("log_out").innerHTML = htmlLogOut;
}

function actionLogOut(){
    document.cookie = 'usr=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = linkBackToLogInPage;
}