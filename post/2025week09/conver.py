import re

# 文件名
filename = 'index.md'

# 尝试打开文件，读取内容，并进行替换
try:
    with open(filename, 'r', encoding='utf-8') as file:
        content = file.read()
        
    # 使用正则表达式替换 "png" 和 "jpg" 为 "webp"
    content = re.sub(r'\b(png|jpg)\b', 'webp', content)
    
    # 将替换后的内容写回文件
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(content)
        
    print(f'All instances of "png" and "jpg" in {filename} have been replaced with "webp".')
except FileNotFoundError:
    print(f'The file {filename} was not found in the current directory.')
except Exception as e:
    print(f'An error occurred: {e}')
