// Get the modal
let modal = document.getElementById('id01');
let valueLevel = 0;

function modalLogIn(value){
    document.getElementById('id01').style.display='block';
    valueLevel = value;
    var titleLogInLevel = "IC3 GS6 Level " + valueLevel.toString();
    var htmlModelLogIn = "";
    var colorTitleLogInLevel = "";
    if(valueLevel == 1){
        colorTitleLogInLevel = "#994589";
    }
    else if(valueLevel == 2){
        colorTitleLogInLevel = "#843C0C";
    }
    else{
        colorTitleLogInLevel = "#385723";
    }
    htmlModelLogIn = "<div class=\"modal-content animate\">"
                    + "<div class=\"imgcontainer\">"
                    + "<span onclick=\"document.getElementById(\'id01\').style.display=\'none\'\" class=\"close\" title=\"Close Modal\">&times;</span>"
                    + "</div>"
                    + "<div class=\"container\" autocomplete=\"off\" >"
                    + "<h2 style=\"text-align: center; color: "
                    + colorTitleLogInLevel
                    + ";\" for=\"uname\"><b>"
                    + titleLogInLevel
                    + "</b></h2>"
                    + "<label for=\"uname\"><b>Tên Đăng Nhập</b></label>"
                    + "<input id=\"uname\" type=\"text\" placeholder=\"Nhập Tên Đăng Nhập\" autocomplete=\"off\" required>"
                    + "<label for=\"psw\"><b>Mã Xác Thực</b></label>"
                    + "<input id=\"psw\" type=\"password\" placeholder=\"Nhập Mã Xác Thực\" autocomplete=\"new-password\" required>"
                    + "<button onclick=\"submit()\">Đăng Nhập</button>"
                    + "</div>"
                    + "</div>";
    document.getElementById("id01").innerHTML = htmlModelLogIn;
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

let sheetID = '1soOOOMYSdq89r7CHVtMi10Na7tuP2RoAf6J8cACKzrY';
let base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
let data = [];
let user = "";
let end_time = "";
let checkRow = false;
let numberPhone = "0703.895.605";

function submit(){   
    data = [];
    user = "";
    end_time = "";
    check = false;
    //console.log("Value: ",valueLevel);
    if(document.getElementById("uname").value=="" || document.getElementById("psw").value==""){
        alert("Bạn hãy nhập đầy đủ thông tin nhé!");
    }
    else{
        var u = document.getElementById("uname").value;
        var p = document.getElementById("psw").value;
        var sheetName = '';
        if(valueLevel == 1){            
            sheetName = 'LogIn1';
        }
        else if(valueLevel == 2){            
            sheetName = 'LogIn2';
        }
        else if(valueLevel == 3){            
            sheetName = 'LogIn3';
        }
        var qu_AllData = 'Select A, D WHERE A = \"' + u + '\" AND B = \"' + p + '\"';            
        //var qu_AllData = 'Select * ';
        var queryAllData = encodeURIComponent(qu_AllData);
        var urlAllData = `${base}&sheet=${sheetName}&tq=${queryAllData}`;
        
        //console.log(urlAllData);
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
                data = Object.keys(row).map((key) => [key, row[key]]);
                //console.log(typeof Object.keys(row).map((key) => [key, row[key]]));
                //data.push(row);
                user = data[0][1].toString();
                end_time = data[1][1].toString();
                checkLogIn();
                checkRow = true;
            })
            if(checkRow == false){
                checkLogIn();
            }
        })
    }    
}

function checkLogIn(){
    var currentDate = new Date();
    if(user == document.getElementById("uname").value){
        if(currentDate.getUTCFullYear() > Number(end_time.slice(5,9))){
            alert("Tài khoản của bạn đã hết hạn!\nĐể tiếp tục sử dụng thì bạn hãy liên hệ qua Zalo: " + numberPhone);
        }
        else if(currentDate.getUTCFullYear() == Number(end_time.slice(5,9))){
            var strMonth_Day_Tmp = end_time.slice(end_time.indexOf(",")+1,end_time.length-1);
            var strMonth = strMonth_Day_Tmp.slice(0,strMonth_Day_Tmp.indexOf(","));
            if(currentDate.getUTCMonth() > Number(strMonth)){
                alert("Tài khoản của bạn đã hết hạn!\nĐể tiếp tục sử dụng thì bạn hãy liên hệ qua Zalo: " + numberPhone);
            }
            else if(currentDate.getUTCMonth() == Number(strMonth)){
                var strDay = strMonth_Day_Tmp.slice(strMonth_Day_Tmp.indexOf(",")+1,strMonth_Day_Tmp.length);
                if(currentDate.getUTCDate() > Number(strDay)){
                    alert("Tài khoản của bạn đã hết hạn!\nĐể tiếp tục sử dụng thì bạn hãy liên hệ qua Zalo: " + numberPhone);
                }
                else{
                    goToLinkCongCuLuyenThi();
                }
            }
            else{
                goToLinkCongCuLuyenThi();
            }
        }
        else{
            goToLinkCongCuLuyenThi();
        }
        // var strMonth_Day_Tmp = end_time.slice(end_time.indexOf(",")+1,end_time.length-1);
        // var strYear = end_time.slice(5,9);
        // var strMonth = strMonth_Day_Tmp.slice(0,strMonth_Day_Tmp.indexOf(","));
        // var strDay = strMonth_Day_Tmp.slice(strMonth_Day_Tmp.indexOf(",")+1,strMonth_Day_Tmp.length);
        // var stringEndTime = strMonth + "/" + strDay + "/" + strYear;        
    }
    else{
        alert("Bạn đã NHẬP SAI thông tin đăng nhập!");
    }
}

function goToLinkCongCuLuyenThi(){
    //Up
    setCookie("usr", user, 2);
    //Up
    var linkCongCuLuyenThi = "";
    if(valueLevel == 1){
        linkCongCuLuyenThi = "https://luyentap-ic3.github.io/CongCu/IC3GS6LEVEL1.html";
        window.location.href = linkCongCuLuyenThi;
    }
    else if(valueLevel == 2){
        linkCongCuLuyenThi = "https://luyentap-ic3.github.io/CongCu/IC3GS6LEVEL2.html";
        window.location.href = linkCongCuLuyenThi;
    }
    else if(valueLevel == 3){
        linkCongCuLuyenThi = "https://luyentap-ic3.github.io/CongCu/IC3GS6LEVEL3.html";
        window.location.href = linkCongCuLuyenThi;
    }
}

function setCookie(cname,cvalue,exhours) {
    const d = new Date();
    d.setTime(d.getTime() + (exhours*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    // document.cookie = courseName + "=" + courseValue + ";" + expires + ";path=/";
    // document.cookie = achievementsOfUserName + "=" + achievementsOfUserValue + ";" + expires + ";path=/";    
}