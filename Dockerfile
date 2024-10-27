# Sử dụng Node.js chính thức từ DockerHub
FROM node:18

# Cài đặt Chromium và các thư viện phụ thuộc
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libgtk-3-0 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  && rm -rf /var/lib/apt/lists/*

# Đặt thư mục làm việc cho ứng dụng
WORKDIR /usr/src/app

# Copy package.json và package-lock.json vào Docker container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở cổng ứng dụng
EXPOSE 3000

# Lệnh chạy ứng dụng
CMD ["node", "index.js"]

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser