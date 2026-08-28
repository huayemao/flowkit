import { Calendar, ChevronLeft, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TFunction } from "i18next";
import { BlogPostData } from "@/lib/types/blog";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BlogPostProps {
  slug: string;
  post: BlogPostData;
  content: React.FC;
  t: TFunction;
}

// 服务端组件，直接获取文章数据
const BlogPost = ({ slug, t, post, content: Post }: BlogPostProps) => {
  // 格式化日期，根据语言环境选择合适的格式
  const formatDate = (dateString: string) => {
    try {
      // 使用从post对象中获取的locale属性
      const currentLocale = post.locale || "en";

      return new Date(dateString).toLocaleDateString(currentLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto max-w-5xl md:mt-8 pb-4 shadow-lg bg-white/80 dark:bg-card/80 border border-border">
      {/* 封面图和标题区域 */}

      <div className="overflow-hidden">
        {/* 封面图区域 */}
        {post.coverImage && (
          <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}

        {/* 文章头部 */}
        <div className="p-6 space-y-5">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground mt-2">
            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1 rounded-full">
              <Calendar className="h-4 w-4" />
              <span>
                {" "}
                {t("blog::published_on")}
                {formatDate(post.date)}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4" />
              <span>
                {post.readTime} {t("blog::min_read")}
              </span>
            </div>
          </div>

          {/* 文章标签 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
              {post.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 hover:bg-primary/10 transition-colors"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 文章内容区域 */}
      <div className="py-8 px-4 md:px-8">
        <Button variant="default" size="sm" asChild className="mt-4 md:mt-0">
          <Link href="/blog">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("blog::back_to_list")}
          </Link>
        </Button>
        {/* 文章内容 - 使用客户端组件渲染 */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <Post />
        </div>
      </div>
    </div>
  );
};

// 骨架屏组件，用于初始加载状态
BlogPost.Skeleton = () => (
  <div className="space-y-6">
    <div className="h-16 bg-muted animate-pulse rounded w-3/4"></div>
    <div className="flex items-center space-x-4">
      <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
      <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
    </div>
    <div className="flex flex-wrap gap-2 mt-4">
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="h-6 bg-muted animate-pulse rounded w-24"
          ></div>
        ))}
    </div>
    <div className="h-64 bg-muted animate-pulse rounded mt-6"></div>
    <div className="space-y-4">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="h-4 bg-muted animate-pulse rounded w-full"
          ></div>
        ))}
    </div>
  </div>
);

export default BlogPost;
