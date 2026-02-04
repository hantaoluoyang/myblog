$(document).ready(function() {
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');

    $('#submit-btn').on('click', function(e) {
        // 必须阻止默认提交
        e.preventDefault();
        e.stopPropagation();  // 防止事件冒泡

        console.log('按钮被点击');  // 调试：看是否执行到这里

        const $btn = $(this);

        // 检查编辑器是否存在
        if (typeof window.editor === 'undefined') {
            alert('编辑器未初始化，请刷新页面');
            console.error('window.editor 未定义');
            return;
        }

        const title = $('input[name="title"]').val().trim();
        const category = $('select[name="category"]').val();
        const content = window.editor.getHtml();
        const textContent = window.editor.getText().trim();

        // 在控制台查看实际获取到的值
        console.log('标题:', title);
        console.log('分类:', category);
        console.log('内容HTML:', content);
        console.log('内容文本:', textContent);

        // 验证
        if (!title) {
            alert('请输入标题');
            $('input[name="title"]').focus();
            return;
        }
        if (!category) {
            alert('请选择分类');
            return;
        }
        if (!textContent) {
            alert('请输入博客内容');
            return;
        }

        $btn.prop('disabled', true).text('发布中...');

        // 准备数据
        const postData = {
            title: title,
            category: category,
            content: content,
            csrfmiddlewaretoken: csrftoken
        };

        console.log('发送的数据:', postData);  // 确认 content 有值

        $.ajax({
            url: '/blog/pub',  // 确认这个路径正确
            type: 'POST',
            data: postData,
            dataType: 'json',
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function(response) {
                console.log('返回结果:', response);
                if (response.code === 200) {
                    alert('发布成功！');
                    window.location.href = response.redirect_url || '/myblog/';
                } else {
                    alert('失败：' + (response.message || '') + '\n' + (response.errors ? response.errors.join('\n') : ''));
                    $btn.prop('disabled', false).text('发布');
                }
            },
            error: function(xhr) {
                console.error('请求错误:', xhr.responseText);
                alert('网络错误，状态码：' + xhr.status);
                $btn.prop('disabled', false).text('发布');
            }
        });
    });
});