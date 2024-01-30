let sheetID = '1soOOOMYSdq89r7CHVtMi10Na7tuP2RoAf6J8cACKzrY';
let base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
let linkBackToLogInPage = "https://luyentap-ic3.github.io/CongCu/index.html";
let data1 = [];
let user1 = "";
let end_time1 = "";
let checkRow1 = false;
let dataAll = [];
let tabPrevious = null;
window.onload = init;

function init() {
    checkCookie();
    logOut();
    renderLuaChonCongCu();
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

function checkCookie() {
    let ur = getCookie("usr");
    var sheetName = 'LogIn2';        
    var qu_AllData = 'Select A, D WHERE A = \"' + ur + '\"';
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
                    alert("Chúc bạn luyện thi hiệu quả!");
                    return;
                }
            }
            else{
                alert("Chúc bạn luyện thi hiệu quả!");
                return;
            }
        }
        else{
            alert("Chúc bạn luyện thi hiệu quả!");
            return;
        }  
    }
    else{
        backToLogInPage();
    }
}

function backToLogInPage(){
    alert("Bạn cần đăng nhập lại để tiếp tục luyện thi!");
    window.location.href = linkBackToLogInPage;
}

function setCookie(cname,cvalue,exhours) {
    const d = new Date();
    d.setTime(d.getTime() + (exhours*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    // document.cookie = courseName + "=" + courseValue + ";" + expires + ";path=/";
    // document.cookie = achievementsOfUserName + "=" + achievementsOfUserValue + ";" + expires + ";path=/";
    
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

function renderLuaChonCongCu(){
    var htmlSelectTool = "";
    htmlSelectTool = "<input type=\"radio\" id=\"s1\" name=\"se_tool\" value=\"s1\"> <b><i>Luyện Tập</i></b>&emsp;&ensp;"
                    + "<input type=\"radio\" id=\"s2\" name=\"se_tool\" value=\"s2\"> <b><i>Thi Thử</i></b><br/>"
                    + "<div><button class=\"btn-select-tool\" onclick=\"confirmRenderCongCu()\"><b>OK</b></button></div>"
                    
    document.getElementById("select-tool").innerHTML = htmlSelectTool;
}

function confirmRenderCongCu(){
    var ele = document.getElementsByName('se_tool');
    var checkSelect = false;
    for (i = 0; i < ele.length; i++) {
        if (ele[i].checked){
            if(ele[i].value == "s1"){
                renderCongCu("CC1_LV2", 1);
            }
            else if(ele[i].value == "s2"){
                renderCongCu("CC2_LV2", 2);
            }
            checkSelect = true;
        }
    }
    if(checkSelect == false){
        alert("Bạn hãy chọn \"Luyện Tập\" hoặc \"Thi Thử\" nhé!");
    }
}

function renderCongCu(nameSheet, typeTool){
    //Up    
    var sheetName = nameSheet;
    var qu_AllData = 'Select *';
    var queryAllData = encodeURIComponent(qu_AllData);
    var urlAllData = `${base}&sheet=${sheetName}&tq=${queryAllData}`;
    dataAll = [];
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
            dataAll.push(row);
        })
        if(typeTool == 1){
            renderToWebsite1(dataAll);
        }
        else{
            renderToWebsite2(dataAll);
        }        
    });
}

function renderToWebsite1(data){
    htmlListForm = "";   
    htmlListForm = htmlListForm + "<table class=\"table-form-real-estate-CongVu\">"
                                + "<tr class=\"table-row-form-real-estate-CongVu\">"
                                + "<th class=\"table-header-form-real-estate-CongVu\">STT</th>"
                                + "<th class=\"table-header-form-real-estate-CongVu\">Chủ Đề</th>"
                                + "<th class=\"table-header-form-real-estate-CongVu\">Luyện Tập</th>"
                                + "</tr>";
    var typeTodo = "";
    var titleTodo = "";
    for(var count = 0; count < data.length; count++){
        typeTodo = "<button class=\"button-google-form\" type=\"button\">"+ data[count]['nametodo'] +"</button>";
        titleTodo = "<span style=\"color:black;font-weight:bold;\">" + data[count]['title'];
    

        htmlListForm = htmlListForm + "<tr "
                                    + "id=\"info" + String(count+1) + "\""
                                    + " class=\"table-row-form-real-estate-CongVu\">"
                                    + "<td class=\"table-data-form-real-estate-CongVu\" style=\"text-align:center;\">"
                                    + data[count]['number']
                                    + "</td>"
                                    + "<td class=\"table-data-form-real-estate-CongVu\">"
                                    + titleTodo
                                    + "</span></td>"
                                    + "<td class=\"table-data-form-real-estate-CongVu\" style=\"text-align:center;\">"
                                    + "<a href=\"#info" + String(count+1) + "\" onclick=\"goToLink("
                                    + "\'"
                                    + String(data[count]['linktodo'])
                                    + "\'"
                                    + ",\'"
                                    + String(data[count]['id'])
                                    + "\'"
                                    + ")\">"
                                    + typeTodo
                                    + "</a>"

                                    + "</td>"
                                    + "</tr>"
    }
    htmlListForm = htmlListForm + "</table>";
    document.getElementById("main").innerHTML = htmlListForm;
}

function renderToWebsite2(data){
    htmlListForm = "";   
    htmlListForm = htmlListForm + "<table class=\"table-form-real-estate-CongVu\">"
                                + "<tr class=\"table-row-form-real-estate-CongVu\">"
                                + "<th class=\"table-header-form-real-estate-CongVu\">STT</th>"
                                + "<th class=\"table-header-form-real-estate-CongVu\">Bộ Đề</th>"
                                + "<th class=\"table-header-form-real-estate-CongVu\">Thi Thử</th>"
                                + "</tr>";
    var typeTodo = "";
    var titleTodo = "";
    for(var count = 0; count < data.length; count++){
        typeTodo = "<button class=\"button-google-form1\" type=\"button\">"+ data[count]['nametodo'] +"</button>";
        titleTodo = "<span style=\"color:black;font-weight:bold;\">" + data[count]['title'];
    

        htmlListForm = htmlListForm + "<tr "
                                    + "id=\"info" + String(count+1) + "\""
                                    + " class=\"table-row-form-real-estate-CongVu\">"
                                    + "<td class=\"table-data-form-real-estate-CongVu\" style=\"text-align:center;\">"
                                    + data[count]['number']
                                    + "</td>"
                                    + "<td class=\"table-data-form-real-estate-CongVu\">"
                                    + titleTodo
                                    + "</span></td>"
                                    + "<td class=\"table-data-form-real-estate-CongVu\" style=\"text-align:center;\">"
                                    + "<a href=\"#info" + String(count+1) + "\" onclick=\"goToLink("
                                    + "\'"
                                    + String(data[count]['linktodo'])
                                    + "\'"
                                    + ",\'"
                                    + String(data[count]['id'])
                                    + "\'"
                                    + ")\">"
                                    + typeTodo
                                    + "</a>"

                                    + "</td>"
                                    + "</tr>"
    }
    htmlListForm = htmlListForm + "</table>";
    document.getElementById("main").innerHTML = htmlListForm;
}

function goToLink(linkToDo,ID){
    setCookie("usr", user1, 2);
    setCookie("ID", ID, 2);
    if(tabPrevious != null){
        tabPrevious.close();
        tabPrevious = window.open(linkToDo,'_blank');
    }
    else{
        tabPrevious = window.open(linkToDo,'_blank'); 
    }       
}