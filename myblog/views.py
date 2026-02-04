from django.shortcuts import render, reverse, resolve_url, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods,require_POST,require_GET
from django.http.response import JsonResponse
from django.db import transaction, connection
from .models import BlogCategory, Blog, BlogComment
from .forms import PubBlogForm
from django.db.models import Q

def index(request):
    blogs=Blog.objects.all()
    return render(request, 'index.html',context={'blogs':blogs})

def blog_detail(request, blog_id):
    try:
        blog=Blog.objects.get(pk=blog_id)
    except Exception as e:
        blog=None
    return render(request, 'blog_detail.html',context={'blog':blog})

@require_http_methods(['GET', 'POST'])
@login_required(login_url="myauth:login")  # 直接用字符串即可，不需要reverse_lazy
def pub_blog(request):
    if request.method == "GET":
        categories = BlogCategory.objects.all()
        return render(request, 'pub_blog.html', context={'categories': categories})

    else:
        form = PubBlogForm(request.POST)
        if form.is_valid():
            try:
                with transaction.atomic():  # 事务保护
                    # 方式1: 直接用 form.save() 最简单（推荐）
                    blog = form.save(commit=False)
                    blog.author = request.user
                    blog.save()

                return JsonResponse({
                    'code': 200,
                    'success': True,
                    'message': '博客发布成功',
                    'blog_id': blog.id,
                    'redirect_url': reverse('myblog:blog_detail', kwargs={'blog_id': blog.id})
                })

            except Exception as e:
                return JsonResponse({
                    'code': 500,
                    'message': f'发布失败：{str(e)}'
                }, status=500)

        else:
            # 返回具体错误信息给前端
            errors = []
            for field, error_list in form.errors.items():
                field_name = {
                    'title': '标题',
                    'content': '内容',
                    'category': '分类'
                }.get(field, field)
                errors.append(f"{field_name}: {''.join(error_list)}")

            return JsonResponse({
                'code': 400,
                'success': False,
                'message': '参数错误',
                'errors': errors
            }, status=400)

@require_POST
@login_required()
def pub_comment(request):
    blog_id=request.POST.get('blog_id')
    content=request.POST.get('content')
    BlogComment.objects.create(blog_id=blog_id, content=content, author=request.user)
    #重新加载博客详情页
    return redirect(reverse('myblog:blog_detail', kwargs={'blog_id': blog_id}))


@require_GET
def search(request):
    #/search?q=xxx
    q=request.GET.get('q')
    #从博客的标题和内容中查找到含有q关键字的博客
    blogs=Blog.objects.filter(Q(title__icontains=q)|Q(content__icontains=q)).all()
    return render(request,'index.html',context={'blogs':blogs})