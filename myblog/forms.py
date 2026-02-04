from django import forms

# class PubBlogForm(forms.ModelForm):
#     title = forms.CharField(max_length=200,min_length=2)
#     content = forms.CharField(min_length=2)
#     category = forms.IntegerField()

from django import forms
from .models import Blog, BlogCategory  # 导入模型


class PubBlogForm(forms.ModelForm):
    # 必须添加 Meta 类指定模型
    class Meta:
        model = Blog  # 指定你的 Blog 模型
        fields = ['title', 'content', 'category']  # 包含的字段

    title = forms.CharField(
        max_length=200,
        min_length=2,
        error_messages={
            'min_length': '标题至少2个字符',
            'max_length': '标题最多200个字符',
            'required': '请输入标题'
        }
    )

    content = forms.CharField(
        min_length=2,
        error_messages={
            'min_length': '内容至少2个字符',
            'required': '请输入内容'
        }
    )

    # 关键修改：IntegerField → ModelChoiceField
    # 因为 category 是外键(ForeignKey)，需要选择对象而不是纯数字
    category = forms.ModelChoiceField(
        queryset=BlogCategory.objects.all(),
        error_messages={
            'required': '请选择分类',
            'invalid_choice': '无效的分类'
        }
    )

