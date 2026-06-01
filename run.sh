#!/bin/bash

# Hàm xử lý khi bấm Ctrl+C để tắt toàn bộ các server con
cleanup() {
    echo -e "\n\nStopping all servers..."
    kill $PID_ML $PID_SERVER $PID_CLIENT 2>/dev/null
    exit
}
trap cleanup INT TERM EXIT

echo "1. Starting ML Server (Python)..."
# Trỏ thẳng đến Python của môi trường CS146 để chạy, không cần dùng 'cd' hay 'activate'
/home/ducquan/miniconda3/envs/CS146/bin/python -m ml_server.routers.main &
PID_ML=$!

echo "2. Starting Express Server (Node)..."
cd server && npm run dev &
PID_SERVER=$!
cd ..

echo "3. Starting Client (Vite)..."
cd client && npm run dev &
PID_CLIENT=$!
cd ..

# Giữ cho script chính luôn chạy để hứng log
wait