import sys
import os

def get_template_path():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    return os.path.join(project_root, 'templates', 'template.txt')

def main():
    if len(sys.argv) < 2:
        print("에러: user_name이 필요합니다.")
        sys.exit(1)
        
    user_name = sys.argv[1]
    
    template_path = get_template_path()
    
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            template_content = f.read()
            
        greeting = template_content.replace('{{name}}', user_name)
        
        print(greeting)
        
    except FileNotFoundError:
        print(f"에러: 템플릿 파일을 찾을 수 없습니다. (경로: {template_path})")
        sys.exit(1)
    except Exception as e:
        print(f"스크립트 실행 중 에러 발생: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()