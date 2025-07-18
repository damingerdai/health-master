#!/bin/bash

# TODO: 将来需要迁移到https://github.com/containers/podman/discussions/20218
# 检查是否以 root 用户运行
# if [ "$(id -u)" -ne 0 ]; then
#   echo "此脚本需要 root 权限运行。" >&2
#   exit 1
# fi

# 获取名为 health-master 的容器 ID
CONTAINER_ID=$(podman ps -a --filter "name=health-master" --format "{{.ID}}")

if [ -z "$CONTAINER_ID" ]; then
  echo "未找到名为 health-master 的容器。" >&2
  exit 1
fi

echo "找到容器 health-master，ID 为 $CONTAINER_ID"

# 定义服务文件的存储路径
SERVICE_FILE_PATH="$HOME/.config/systemd/user"

SERVICE_NAME="podman-health-master"

# 使用 podman generate systemd 创建服务文件
echo "正在生成 systemd 服务文件..."
podman generate systemd --name --restart-policy=on-failure -t 10 "$CONTAINER_ID" >"$SERVICE_FILE_PATH/$SERVICE_NAME.service"

if [ $? -ne 0 ]; then
  echo "错误: 无法生成 $SERVICE_NAME 服务。" >&2
  exit 1
fi

# 修复 SELinux 上下文（如启用 SELinux）
restorecon -RvF "$SERVICE_FILE_PATH/$SERVICE_NAME.service"

# 启用用户级 systemd 支持（首次需运行）
loginctl enable-linger "$USER"

# 重新加载 systemd 配置
echo "重新加载 systemd 配置..."
systemctl --user daemon-reload

if [ $? -ne 0 ]; then
  echo "错误: 无法重新加载 systemd 配置。" >&2
  exit 1
fi

# 启用服务
echo "启用服务 $SERVICE_NAME..."
systemctl --user enable --now "$SERVICE_NAME"

if [ $? -ne 0 ]; then
  echo "错误: 无法启用服务 $SERVICE_NAME。" >&2
  exit 1
fi

# 启动服务
echo "启动服务 $SERVICE_NAME..."
systemctl --user start "$SERVICE_NAME"

if [ $? -ne 0 ]; then
  echo "错误: 无法启动服务 $SERVICE_NAME。" >&2
  exit 1
fi

echo "服务 $SERVICE_NAME 已成功创建并启动。"
echo "你现在可以使用以下命令管理服务:"
echo "  systemctl --user status $SERVICE_NAME  # 查看服务状态"
echo "  systemctl --user stop $SERVICE_NAME    # 停止服务"
echo "  systemctl --user restart $SERVICE_NAME # 重启服务"
