import os
import re

def replace_in_index_md(directory):
    # 遍历目录
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file == 'index.md':
                # 构建完整的文件路径
                filepath = os.path.join(root, file)
                # 读取文件内容
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 替换内容
                updated_content = re.sub(r'src_clean.webp', 'src_clean.png', content)
                
                # 如果内容有变化，则写回文件
                if updated_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(updated_content)
                    print(f"Updated: {filepath}")

# 替换当前目录及其子目录中的 index.md 文件
replace_in_index_md('.')
