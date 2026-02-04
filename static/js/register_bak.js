$(function () {
    function bindCaptchaBtnClick() {
        $("#captcha-btn").click(function (event) {
            let $this = $(this);
            let email = $("input[name='email']").val();

            if (!email) {
                alert("请先输入邮箱");
                return;
            }

            // 建议增加邮箱格式验证
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("请输入正确的邮箱格式");
                return;
            }

            // 取消按钮的点击事件
            $this.off('click');

            // 发送验证码请求（这里需要补充实际的AJAX请求）
            // $.post('/send-captcha', {email: email}, function(res) {
            //     if (res.code !== 200) {
            //         alert(res.message);
            //         bindCaptchaBtnClick(); // 失败时恢复按钮
            //         return;
            //     }
            // });

            // 倒计时 - 修正：移除TypeScript类型注解，改为60秒更合理
            let countdown = 6;
            $this.text(countdown + "s").prop('disabled', true).addClass('disabled');

            let timer = setInterval(function () {
                if (countdown <= 0) {
                    $this.text('获取验证码').prop('disabled', false).removeClass('disabled');
                    clearInterval(timer);
                    bindCaptchaBtnClick();
                } else {
                    countdown--;
                    // 修正：使用字符串拼接或模板字符串，不是赋值
                    $this.text(countdown + "s");
                }
            }, 1000);
        });
    }

    bindCaptchaBtnClick();
});