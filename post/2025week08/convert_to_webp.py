import os
import subprocess
import re

# 转换图片文件为 WebP 格式
def convert_to_webp(filepath):
    output_path = os.path.splitext(filepath)[0] + '.webp'
    try:
        subprocess.run(['cwebp', filepath, '-o', output_path], check=True)
        print(f'Converted {filepath} to {output_path}')
    except subprocess.CalledProcessError as e:
        print(f'Failed to convert {filepath}: {e}')

# 遍历文件夹并转换图片
def convert_images_in_folder(folder):
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.lower().endswith(('.png', '.jpg')):
                filepath = os.path.join(root, file)
                convert_to_webp(filepath)

# 替换指定文件中的图片扩展名
def replace_extensions_in_markdown(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # 替换 "png" 和 "jpg" 为 "webp"
        content = content.replace('.png', '.webp')
        content = content.replace('.jpg', '.webp')
        
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Replaced "png" and "jpg" with "webp" in {filepath}')
    except FileNotFoundError:
        print(f'The file {filepath} was not found.')
    except Exception as e:
        print(f'An error occurred: {e}')

# 主函数
def main():
    # 转换当前文件夹及其子文件夹中的图片
    convert_images_in_folder('.')

    # 遍历当前目录及其子目录，替换所有的 index.md 文件中的图片扩展名
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file == 'index.md':
                markdown_path = os.path.join(root, file)
                replace_extensions_in_markdown(markdown_path)

if __name__ == '__main__':
    main()
