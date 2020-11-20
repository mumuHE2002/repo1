let that;
class List {
  constructor(id) {
    that = this;
    this.item = document.querySelector(id);
    //时间
    this.time = this.item.querySelector("main .time");
    this.setTime();
    //添加List
    this.addEvent = this.item.querySelector(".addList");
    this.currentList = this.item.querySelector("main ol");
    this.yesList = this.item.querySelector("main ul");
    //手机端添加按钮
    this.xs_btn = this.item.querySelector("div.btnadd");
    this.xs_input = this.item.querySelector("div.xs_addList");
    //事件端发布按钮
    this.xs_addEvent = this.item.querySelector("div.xs_addList span");
    this.srtScond();
    //绑定事件
    this.init();
  }
  //绑定事件元素
  init() {
    //渲染数据到 dom 上
    this.load();

    this.updateNode();
    //添加按钮
    this.addEvent.children[1].addEventListener("click", this.addList);
    this.addEvent.addEventListener("keyup", this.addKeyup);
    // 删除按钮
    for (let i = 0; i < this.removeBtn.length; i++) {
      this.removeBtn[i].index = i;
      this.removeBtn[i].addEventListener("click", this.removeList);
      this.yesCheck[i].addEventListener("change", this.goYesList);
      this.loggleP[i].addEventListener("dblclick", this.editList);
      this.loggleP[i].addEventListener("touchend", this.editList);
    }
    //手机端端事件
    this.xs_btn.addEventListener("touchstart", this.touchSate);
    //手机端发布 事件
    this.xs_addEvent.addEventListener("touchstart", this.addList);
    //点击屏幕隐藏发布框
    document.addEventListener("touchstart", this.xs_end);
    //禁止点发布框里的事件 触发事件冒泡
    this.xs_addEvent.parentNode.addEventListener("touchstart", function (e) {
      e.stopPropagation();
    });
  }
  // 获取后面添加的元素
  updateNode() {
    //删除 List
    this.removeBtn = this.item.querySelectorAll("main .glyphicon-scissors");
    //完成 List
    this.yesCheck = this.item.querySelectorAll("li .yes");
    //获取 文字p 标签，后面双击修改
    this.loggleP = this.item.querySelectorAll("main li p");
  }
  //修改时间模块
  setTime() {
    function getDate() {
      let date = new Date(); //格式化时间
      let year = date.getFullYear(); //获取当前日期的年份
      let month = date.getMonth() + 1; //获取月份
      let dates = date.getDate(); //获取日期
      let arr = [
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      let day = date.getDay(); //获取星期
      return year + "/" + month + "/" + dates;
    }
    this.time.children[1].innerHTML = getDate();
  }
  //获取小时分钟
  srtScond() {
    function getTime() {
      let date = new Date();
      let hour = date.getHours();
      let mi = date.getMinutes();
      let second = date.getSeconds();
        //网上复制的，两位数
      function zhuan(number, n) {
        //大概意思是 在传进来的数字前加一个0，然后截取字符串保留两位
        return (Array(n).join(0) + number).slice(-n);
      }

      return zhuan(hour, 2) + ":" + zhuan(mi, 2) + ":" + zhuan(second, 2);
    }

    $(".second").text(getTime());
    setInterval(function () {
      $(".second").text(getTime());
    }, 1000);
  }

  //-------------------------------------------------------------------------------
  //读取本地存储模块
  getLocal() {
    const date = localStorage.getItem("mumulist");
    if (date !== null) {
      //本地存储的数据是字符串，需要转换成对象
      return JSON.parse(date);
    } else {
      return [];
    }
  }
  //保存本地存储
  saveLocal(date) {
    localStorage.setItem("mumulist", JSON.stringify(date));
  }
  //渲染加载数据
  load() {
    let date = this.getLocal();
    //遍历添加元素之前，先把 ol 里面的元素清空
    if (date.length != 0) {
      this.currentList.innerHTML = "";
      this.yesList.innerHTML = "";
    }
    //统计完成与进行 任务
    let conrrent = 0; //正在进行
    let yes = 0; //完成
    const colorArr = ['#abc8ce','#b7b4c3','#cbbbc9','#e5c1cd','#f2dbcf','#d2aab3','#e3bfd9','#f1d0e6','#aaa5a4','#f9e1b1']
    //遍历这个数据
    $.each(date, function (i, n) {
      let x = Math.floor(Math.random()*10);
      if (n.done) {
        const li =
          '<li><i style="background-color: '+ colorArr[x] +';"></i><input type="checkbox" name="" id="" class="yes" checked="checked" /><p>' +
          n.title +
          '</p><span class="glyphicon glyphicon-scissors" id=' +
          i +
          " ></span></li>";
        that.yesList.insertAdjacentHTML("afterbegin", li);
        yes++;
      } else {
        const li =
          '<li><i style="background-color: '+ colorArr[x] +';"></i><input type="checkbox" name="" id="" class="yes"/><p>' +
          n.title +
          '</p><span class="glyphicon glyphicon-scissors" id=' +
          i +
          " ></span></li>";
        that.currentList.insertAdjacentHTML("afterbegin", li);
        conrrent++;
      }
    });
    $("#conrrentYes").text(yes);
    $("#conrrentNo").text(conrrent);
  }
  //-----------------------------------------------------------------------
  //添加list 模块
  addList() {
    //点击添加需要把本地的数据获取过来，进行添加
    let local = that.getLocal();
    //当电脑模式value为空，就读取手机模式下的 value
    const vla =
      that.addEvent.children[0].value ||
      that.xs_addEvent.parentNode.children[0].value;
    //自由当 value 不为空才执行添加代码
    if (!(vla == "")) {
      //把获取过来的值追加到 local 数组里
      local.push({ title: vla, done: false });
      //把新的 local 数组，存储到本地存储里
      that.saveLocal(local);
      //清除 input 里的值
      that.addEvent.children[0].value = "";
      that.xs_addEvent.parentNode.children[0].value = "";
    }
    //每次添加完都需要从新绑定事件
    that.init();
  }
  //删除list 模块
  removeList() {
    //防止最后一个删除后不渲染页面，也是让用户开始可以删除自带的li
    this.parentNode.remove()

    //获取本地存储
    const date = that.getLocal();
    //修改数据
    //获取遍历时添加的自定义属性
    const id = this.getAttribute("id");
    //删除对应的数据
    date.splice(id, 1);
    //保存本地存储
    that.saveLocal(date);
    //重新渲染
    that.init();
  }
  //完成模块 yes
  goYesList() {
    //获取本地数据
    const date = that.getLocal();
    //修改数据
    //获取之前给 span 添加的 自定义属性，因为是兄弟关系使用next。。。
    const id = this.nextElementSibling.nextElementSibling.getAttribute("id");
    //把数组里面对应的对象的 done 修改和 input checked 一直
    date[id].done = this.checked;
    //保存本地存储
    that.saveLocal(date);
    that.init();
  }
  //回车键添加
  addKeyup(e) {
    if (e.keyCode == 13) {
      that.addEvent.children[1].click();
    }
  }
  //修改内容模块
  editList() {
    //获取之前的文字
    const trs = this.innerHTML;
    //双击禁止选中文字
    window.getSelection
      ? window.getSelection().removeAllRanges()
      : document.selection.empty();
    this.innerHTML = '<input class="edit" type="text" />';
    const input = this.children[0];
    input.value = trs;
    input.select(); //文本框里文字选中
    //离开时，把inpu 里面的值给 p
    input.addEventListener("blur", function () {
      // this.parentNode.innerHTML = this.value;
      const date = that.getLocal();
      //修改数据
      const id = $(this).parent().siblings("span").attr("id");
      const vla = this.value;
      date[id].title = vla;
      //存储数据
      that.saveLocal(date);
      that.init();
    });
    input.addEventListener("keyup", function (e) {
      if (e.keyCode == 13) {
        //手动调用 blur 事件
        this.blur();
      }
    });
  }
  //手机端端
  //点击按钮弹出添加事件文本框
  touchSate(e) {
    //禁止事件冒泡
    e.stopPropagation();
    $("div.xs_addList").fadeIn();
    $("div.xs_addList input").focus();
  }
  xs_end() {
    //点击屏幕隐藏 发布框
    $("div.xs_addList").fadeOut();
  }
}

$(function () {
  new List("#list");
});



