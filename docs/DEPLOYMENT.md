# Hướng dẫn triển khai lên GitHub Pages

Website dùng đường dẫn tương đối và định tuyến bằng dấu `#`, nên chạy được với **bất kỳ tên repository nào**, không cần sửa cấu hình.

## 1. Chuẩn bị

- Tài khoản GitHub. Nên tạo một **Organization** cho lab để website không phụ thuộc vào một cá nhân.
- [Git for Windows](https://git-scm.com/download/win) hoặc [GitHub Desktop](https://desktop.github.com/).
- Không dùng cách kéo thả trên trang github.com: giới hạn 100 file mỗi lần và dễ bỏ sót thư mục ẩn `.github`.

## 2. Đẩy mã nguồn lên

Tạo repository trống trên GitHub (Public, không thêm README), rồi mở PowerShell trong thư mục dự án:

```powershell
cd "$HOME\Downloads\lab-website\nguyen-viet-tuyen-lab"
git init -b main
git add .
git commit -m "Initial lab website"
git remote add origin https://github.com/TEN-TAI-KHOAN/TEN-REPO.git
git push -u origin main
```

Theo dõi và dừng: `git status` xem trạng thái, thanh tiến trình của `git push` hiện ngay trong cửa sổ, `Get-Process git | Select-Object Id,CPU,WS` xem tài nguyên, `Ctrl+C` để dừng.

## 3. Bật GitHub Pages

1. Vào **Settings → Pages** của repository.
2. Ở **Build and deployment → Source**, chọn **GitHub Actions**.
3. Vào tab **Actions**, mở workflow *Deploy to GitHub Pages*. Nếu chưa chạy, bấm **Run workflow**.

Khi xong, địa chỉ website là:

- `https://TEN-TAI-KHOAN.github.io/TEN-REPO/`, hoặc
- `https://TEN-TAI-KHOAN.github.io/` nếu repository đặt tên đúng là `TEN-TAI-KHOAN.github.io`.

Theo dõi tiến trình trên tab **Actions** (thường vài phút), hoặc nếu có GitHub CLI:

```powershell
gh run list --limit 5          # các lần chạy gần nhất
gh run watch                   # xem trực tiếp tiến trình
gh run view --log-failed       # xem log khi lỗi
gh run cancel <RUN_ID>         # dừng một lần chạy
```

## 4. Chạy thử trên máy (không bắt buộc)

Cần [Node.js 22](https://nodejs.org/).

```powershell
npm install          # tải thư viện
npm run dev          # xem trực tiếp tại http://localhost:5173
npm run build        # kiểm tra kiểu và build bản chính vào thư mục dist
npm run preview      # xem bản đã build
```

Theo dõi và dừng: tiến trình in ngay trong cửa sổ, `Get-Process node | Select-Object Id,CPU,WS` xem CPU và bộ nhớ (hoặc Task Manager), `Ctrl+C` để dừng, `Stop-Process -Name node` nếu tiến trình bị treo.

Muốn xem nhanh mà không cài gì: mở `preview\index.html` ở thư mục `lab-website` bằng trình duyệt.

## 5. Cập nhật nội dung

Có thể sửa ngay trên github.com: mở file, bấm biểu tượng bút chì, sửa, rồi **Commit changes**. Website tự cập nhật sau vài phút.

**Thêm bài báo**: mở `src/data/publications.ts`, thêm một khối vào đầu danh sách:

```ts
{
  id: "2026-ten-ngan-khong-trung",
  title: "Tiêu đề chính xác của bài báo",
  authors: ["Tác giả 1", "Tác giả 2"],
  journal: "Tên tạp chí",
  year: 2026,
  volume: "12",
  issue: null,
  pages: "123456",
  doi: "10.xxxx/xxxxx",
  publisherUrl: "https://...",
  topics: ["piers"],
  source: { page: "", listedUnderYear: 2026, originalLink: null, authorsFrom: "source", metadataFrom: "source-only" },
  verification: "unverified",
},
```

`topics` nhận các giá trị: `piers`, `sers`, `photocatalysis`, `fabrication`, `optics`. Thêm `featured: true` để đưa bài lên mục nổi bật. Thêm `thumbnail: "images/research/ten-file.jpg"` nếu lab có graphical abstract được phép dùng.

**Thêm thành viên**: mở `src/data/people.ts`, thêm `{ name: "Họ Tên" }` vào đúng khóa. Muốn có ảnh, chép ảnh vuông vào `public/images/people/` rồi thêm `photo: "images/people/ten-file.jpg"`.

**Thêm tin tức**: mở `src/data/news.ts`, chép một khối có sẵn rồi sửa. `category` nhận `research`, `exchange` hoặc `life`.

**Sửa địa chỉ, email**: `src/data/site.ts`.

**Thêm hình khoa học**: chép file gốc vào `public/images/research/`, thêm một khối vào `piersFigures` trong `src/data/gallery.ts`, giữ nguyên `width`, `height` thật của ảnh. Thành phần `ScienceFigure` hiển thị nguyên hình, không cắt.

**Chỉnh hiệu ứng nền**: mở `src/App.tsx`, tìm dòng `<NanoBackground intensity=...>`. Số lớn hơn thì nền đậm hơn (từ 0 đến 1); xóa dòng này để tắt hẳn. Hình dạng và số lượng hạt nằm trong `src/lib/nanoScene.ts`.

## 6. Tên miền riêng

Vào **Settings → Pages → Custom domain**, nhập tên miền, rồi trỏ DNS theo [hướng dẫn của GitHub](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
