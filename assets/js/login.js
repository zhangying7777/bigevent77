$(function () {
    // 去注册账号
    $("#goToRegi").click(function () {
        // 显示注册
        $(".register").show();
        // 隐藏登录
        $(".login").hide();
    });

    // 去登陆
    $("#goToLogin").click(function () {
        // 隐藏注册
        $(".register").hide();
        // 显示登录
        $(".login").show();
    });

    // 从layui中获取form表单相关的功能 ==> 注意一定要如此操作，否则直接使用form会报错
    let form = layui.form;
    let layer = layui.layer; // layer 弹出功能


    // 表单自定义效验规则
    form.verify({
        /* username: function (value, item) { //value：表单的值、item：表单的DOM对象
             if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                 return '用户名不能有特殊字符';
             }
             if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                 return '用户名首尾不能出现下划线\'_\'';
             }
             if (/^\d+\d+\d$/.test(value)) {
                 return '用户名不能全为数字';
             }

             //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
             if (value === 'xxx') {
                 alert('用户名不能为敏感词');
                 return true;
             }
         }, */

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        // pass 是密码的效验规则
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // repass 就是两次输入密码需要确保一致
        repass: function (value, item) {
            //value：表单的值、item：表单的DOM对象
            // console.log(value); // 再次输入的密码

            // 通过value 和 密码框的值做比较，如果不一致，弹框提示

            // console.log($(".passIpt").val()); // 密码框的值

            if (value !== $(".passIpt").val()) {
                return "两次输入密码需要确保一致";

            }

        },
    });
    // 实现注册功能
    // 1.当form表单提交的时候，触发表单submit提交功能==>注册form的sbumit事件
    // 2.阻止form表单的默认行为
    // 3.收集表单中的数据(用户名，密码) ==> jQ
    // 4.发送ajax ==> 照着接口文档

    // 1
    $("#regiForm").on("submit", function (e) {
        // 2
        e.preventDefault();
        // 3
        let data = $(this).serialize();
        // this注册的表单，收集的表单数据
        // console.log(data);

        // 4
        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data,
            success: function (res) {
                console.log(res); // 注册请求是否成功，0：成功；1：失败

                if (res.status !== 0) {
                    // 注册失败
                    // return console.log(res.message);
                    return layer.msg('只想弱弱提示');
                }

                // 注册成功了
                // console.log("注册成功了");
                layer.msg('注册成功了');

                // 清空注册form表单
                $("#regiForm")[0].reset();

                // 去登录 ==>触发点击功能
                $("#goToLogin").click();
            },
        });
    });

    // 登录功能
    $("#loginForm").on("submit", function (e) {
        e.preventDefault();

        let data = $(this).serialize();

        $.ajax({
            type: "POST",
            url: "/api/login",
            data,
            success: function (res) {
                console.log(res);

                if (res.status !== 0) {
                    // 登录失败的
                    return layer.msg(res.message);
                }
                // 登录成功的
                // layer.msg("登录成功,即将跳转到首页");

                // 跳转页面,原生js跳转  ==> 弹框出现，就跳转了(弹框关闭之后在跳转)
                // location.href = "/bigevent/home/index.html";

                // 把token (令牌)存储到本地存储中
                localStorage.setItem("token", res.token);

                // 上面代码的改写
                layer.msg("登录成功,即将跳转到首页", {
                    time: 2000, // 2秒后关闭，关闭之后在跳转
                }, function () {
                    location.href = "/bigevent/home/index.html";
                }
                );

            },
        });
    });
});

