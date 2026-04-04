from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.templating import Jinja2Templates
from contextlib import asynccontextmanager
import rjsmin
import os
import uuid
from pathlib import Path
import shutil
from fastapi.middleware.cors import CORSMiddleware
# 임시 파일 저장 디렉토리
UPLOAD_DIR = Path("uploads")
MINIFIED_DIR = Path("minified")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 시작 시: 디렉토리 생성
    UPLOAD_DIR.mkdir(exist_ok=True)
    MINIFIED_DIR.mkdir(exist_ok=True)
    yield
    # 종료 시: 임시 파일 정리 (선택사항)
    if UPLOAD_DIR.exists():
        shutil.rmtree(UPLOAD_DIR)
    if MINIFIED_DIR.exists():
        shutil.rmtree(MINIFIED_DIR)


app = FastAPI(lifespan=lifespan)
# CORS 설정 (JavaScript fetch 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 템플릿 설정
templates = Jinja2Templates(directory="templates")

# 파일 매핑 저장 (실제 프로덕션에서는 DB 사용)
file_mappings = {}


@app.get("/")
async def read_root(request: Request):
    """메인 페이지 HTML 반환"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/data.txt")
async def get_data_txt():
    """
    templates/data.txt 파일을 http://127.0.0.1:3000/data.txt 로 제공
    """
    file_path = os.path.join("templates", "data.txt")
    
    if not os.path.exists(file_path):
        return {"error": "파일을 찾을 수 없습니다."}
    
    return FileResponse(
        path=file_path,
        media_type="application/json",  # JSON 타입으로 제공
        filename="data.txt",
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*"
        }
    )

@app.post("/minify")
async def minify_js(file: UploadFile = File(...)):
    """JS 파일을 업로드받아 minify 처리"""
    
    # 파일 확장자 검증
    if not file.filename.endswith('.js'):
        raise HTTPException(status_code=400, detail="JavaScript 파일만 업로드 가능합니다.")
    
    try:
        # 원본 파일 읽기
        content = await file.read()
        original_content = content.decode('utf-8')
        original_size = len(content)
        
        # JavaScript Minify
        minified_content = rjsmin.jsmin(original_content)
        minified_size = len(minified_content.encode('utf-8'))
        
        # 고유 ID 생성
        file_id = str(uuid.uuid4())
        
        # 압축된 파일명 생성
        original_name = Path(file.filename).stem
        minified_filename = f"{original_name}.min.js"
        
        # 압축된 파일 저장
        minified_path = MINIFIED_DIR / f"{file_id}.min.js"
        with open(minified_path, 'w', encoding='utf-8') as f:
            f.write(minified_content)
        
        # 파일 매핑 저장
        file_mappings[file_id] = {
            'path': minified_path,
            'filename': minified_filename
        }
        
        return {
            'success': True,
            'file_id': file_id,
            'original_filename': file.filename,
            'minified_filename': minified_filename,
            'original_size': original_size,
            'minified_size': minified_size,
            'compression_ratio': round((1 - minified_size / original_size) * 100, 2)
        }
        
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="파일 인코딩 오류. UTF-8 형식의 파일을 업로드해주세요.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"압축 중 오류 발생: {str(e)}")


@app.get("/download/{file_id}")
async def download_file(file_id: str):
    """압축된 파일 다운로드"""
    
    if file_id not in file_mappings:
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")
    
    file_info = file_mappings[file_id]
    file_path = file_info['path']
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="파일이 삭제되었습니다.")
    
    return FileResponse(
        path=file_path,
        filename=file_info['filename'],
        media_type='application/javascript'
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
