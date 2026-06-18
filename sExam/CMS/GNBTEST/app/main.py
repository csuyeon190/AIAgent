from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import os
import uvicorn
import json

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

templates = Jinja2Templates(directory=os.path.join(CURRENT_DIR, "templates"))

# ✅ app/js/, app/static/ → StaticFiles 마운트
JS_DIR = os.path.join(CURRENT_DIR, "js")
STATIC_DIR = os.path.join(CURRENT_DIR, "static")
KR_DIR = os.path.join(CURRENT_DIR, "kr")
if os.path.exists(JS_DIR):
    app.mount("/js", StaticFiles(directory=JS_DIR), name="js")

if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

if os.path.exists(KR_DIR):
    app.mount("/kr", StaticFiles(directory=KR_DIR), name="kr")


# GNB JSON 라우트: /{lang}/gnb/gnb.json
@app.api_route("/{lang}/gnb/gnb.json", methods=["GET", "POST"])
async def get_gnb_json(lang: str):
    paths_to_check = [
        os.path.join(CURRENT_DIR, "templates", "gnb.json"),
        os.path.join(CURRENT_DIR, "gnb.json"),
    ]
    json_path = next((p for p in paths_to_check if os.path.exists(p)), None)

    if not json_path:
        return JSONResponse({"error": "gnb.json not found"}, status_code=404)

    with open(json_path, "r", encoding="utf-8") as f:
        gnb_data = json.load(f)

    # lang != 'kr' 일 때 menuId, url, title 로컬라이즈
    def localize(obj):
        if isinstance(obj, dict):
            new_obj = {}
            for k, v in obj.items():
                if k == "menuId" and isinstance(v, str):
                    new_obj[k] = v.replace("gkr", f"g{lang}")
                elif k == "url" and isinstance(v, str):
                    new_obj[k] = v.replace("/kr/", f"/{lang}/")
                else:
                    new_obj[k] = localize(v)
            return new_obj
        elif isinstance(obj, list):
            return [localize(item) for item in obj]
        return obj

    result = localize(gnb_data) if lang != "kr" else gnb_data
    return JSONResponse(content=result)


# 레이아웃 헤더 HTML (Mock)
@app.api_route("/{lang}/layout/header.html", methods=["GET", "POST"])
async def get_header(lang: str):
    html_path = os.path.join(CURRENT_DIR, "templates", "header.html")
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<div class='gnb'></div>")


# Feature HTML
@app.api_route("/{lang}/gnb/feature/feature.html", methods=["GET", "POST"])
async def get_feature_html(lang: str):
    return HTMLResponse(content=f"<div id='g{lang}1'><div class='feature'><ul></ul></div></div>")


# 메인 페이지
@app.get("/")
async def get_index(request: Request):
    for page in ["index.html"]:
        page_path = os.path.join(CURRENT_DIR, "templates", page)
        if os.path.exists(page_path):
            return templates.TemplateResponse(page, {"request": request})
    return HTMLResponse(content="<h3>index.html not found</h3>", status_code=404)


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
