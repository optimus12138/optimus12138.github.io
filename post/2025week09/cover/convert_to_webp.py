import os
import subprocess

# 检查 cwebp 是否可用
def check_cwebp():
    try:
        subprocess.run(["cwebp", "-version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

# 转换图片文件到 WebP 格式
def convert_to_webp(file_path):
    webp_path = os.path.splitext(file_path)[0] + ".webp"
    command = ["cwebp", file_path, "-o", webp_path]
    subprocess.run(command, check=True)

# 主函数
def main():
    if not check_cwebp():
        print("cwebp is not installed or not found in PATH.")
        return

    # 遍历当前目录中的所有文件
    for filename in os.listdir('.'):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            print(f"Converting {filename} to WebP...")
            convert_to_webp(filename)

if __name__ == "__main__":
    main()
