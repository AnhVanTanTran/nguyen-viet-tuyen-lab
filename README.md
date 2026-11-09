# Nguyen Viet Tuyen's Lab website

Website của Nguyen Viet Tuyen's Lab, Khoa Vật lý, Trường Đại học Khoa học Tự nhiên, ĐHQGHN.
Công nghệ: React, TypeScript, Vite, Tailwind CSS. Triển khai trên GitHub Pages.

| Cần làm gì | Xem ở đâu |
|---|---|
| Đưa website lên GitHub, chạy thử trên máy | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| Sửa nội dung (bài báo, thành viên, tin tức) | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md), mục 5 |
| Cơ sở dữ liệu công bố | [src/data/publications.ts](src/data/publications.ts) |

## Cấu trúc

```
src/data/        Toàn bộ nội dung: publications, people, news, gallery, piers, topics, site
src/pages/       Các trang
src/components/  Thành phần giao diện
public/images/   research (hình khoa học), people, events, brand
docs/            Hướng dẫn triển khai và cập nhật
```

Nội dung tách khỏi giao diện: muốn thêm bài báo hay thành viên chỉ cần sửa file trong `src/data/`.
