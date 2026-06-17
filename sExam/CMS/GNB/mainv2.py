from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.templating import Jinja2Templates
import os
import uvicorn
import json

app = FastAPI()

# Root directory of the project
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# Configure Jinja2Templates using absolute path to be robust against execution CWD differences
templates = Jinja2Templates(directory=os.path.join(CURRENT_DIR, "templates"))

# Route to serve javascript files from local directories or parent workspace directory
@app.get("/js/{filename}")
async def get_js(filename: str):
    paths_to_check = [
        os.path.join(CURRENT_DIR, "templates", "js", filename),
        os.path.join(CURRENT_DIR, "js", filename),
        os.path.join(CURRENT_DIR, "templates", filename),
        os.path.join(BASE_DIR, filename)
    ]
    for file_path in paths_to_check:
        print(f"DEBUG GNB TEST: Checking JS path {file_path} (exists={os.path.exists(file_path)})")
        if os.path.exists(file_path):
            return FileResponse(file_path)
    return JSONResponse({"error": f"File {filename} not found"}, status_code=404)

# Route to serve mock layout header.html
@app.api_route("/{lang}/layout/header.html", methods=["GET", "POST"])
async def get_header(lang: str):
    paths_to_check = [
        os.path.join(CURRENT_DIR, "templates", "header.html"),
        os.path.join(CURRENT_DIR, "header.html")
    ]
    for html_path in paths_to_check:
        if os.path.exists(html_path):
            with open(html_path, "r", encoding="utf-8") as f:
                html_content = f.read()
            return HTMLResponse(content=html_content)
    
    # Fallback to default mock HTML
    html_content = """
    <div class="gnb">
        <!-- GNB will be rendered here dynamically -->
    </div>
    
    <div class="hd-etc">
        <ul class="util">
            <li>
                <button type="button" class="btn_hamburger" style="padding: 5px 10px; background: #333; color: #fff; border: none; cursor: pointer;">
                    ☰ 전체메뉴
                    <span class="blind" style="display:none;"></span>
                </button>
            </li>
        </ul>
    </div>
    
    <div class="rnb" style="display:none;">
        <!-- RNB will be rendered here dynamically -->
    </div>
    """
    return HTMLResponse(content=html_content)

# Route to serve the GNB JSON (5-depth Categories structure)
@app.api_route("/{lang}/gnb/gnb.json", methods=["GET", "POST"])
async def get_gnb_json(lang: str):
    paths_to_check = [
        os.path.join(CURRENT_DIR, "templates", "gnb.json"),
        os.path.join(CURRENT_DIR, "gnb.json")
    ]
    json_path = None
    for path in paths_to_check:
        if os.path.exists(path):
            json_path = path
            break
            
    if not json_path:
        return JSONResponse({"error": "gnb.json not found"}, status_code=404)
        
    with open(json_path, "r", encoding="utf-8") as f:
        gnb_data = json.load(f)
        
    # Recursively localize menuId, url, and title based on path lang parameter
    def localize(obj):
        if isinstance(obj, dict):
            new_obj = {}
            for k, v in obj.items():
                if k == "menuId" and isinstance(v, str):
                    new_obj[k] = v.replace("gkr", f"g{lang}")
                elif k == "url" and isinstance(v, str):
                    new_obj[k] = v.replace("/kr/", f"/{lang}/")
                elif k == "title" and isinstance(v, str) and lang != "kr":
                    translations = {
                        "디지털 & IT 서비스": "Digital & IT Services",
                        "클라우드 & 인프라": "Cloud & Infrastructure",
                        "오퍼링": "Offerings",
                        "데이터센터/네트워크": "Data Center/Network",
                        "데이터센터": "Data Center",
                        "데이터센터 설계/구축/이전": "Data Center Design/Build/Migration",
                        "데이터센터 운영": "Data Center Operation",
                        "네트워크": "Network",
                        "국내/해외 데이터 통신 서비스": "Domestic/Global Network Services",
                        "네트워크 설계/구축": "Network Design/Build"
                    }
                    new_obj[k] = translations.get(v, v)
                elif k == "gnb_title" and isinstance(v, str) and lang != "kr":
                    translations = {
                        "클라우드 & 인프라": "Cloud & Infrastructure"
                    }
                    new_obj[k] = translations.get(v, v)
                else:
                    new_obj[k] = localize(v)
            return new_obj
        elif isinstance(obj, list):
            return [localize(item) for item in obj]
        else:
            return obj

    localized_data = localize(gnb_data)
    return JSONResponse(content=localized_data)

# Route to serve GNB feature content
@app.api_route("/{lang}/gnb/feature/feature.html", methods=["GET", "POST"])
async def get_feature_html(lang: str):
    menu_id = f"g{lang}1"
    html = f"""
    <div id="{menu_id}">
        <div class="feature">
            <ul>
                <li><a href="#">Featured: Samsung SDS Cloud Services</a></li>
            </ul>
        </div>
    </div>
    """
    return HTMLResponse(content=html)

# Route to serve HTML page
@app.get("/")
async def get_index(request: Request):
    # Try indexv2.html first, then index.html
    for page in ["indexv2.html", "index.html"]:
        page_path = os.path.join(CURRENT_DIR, "templates", page)
        if os.path.exists(page_path):
            return templates.TemplateResponse(page, {"request": request})
    return HTMLResponse(content="<h3>No index file found in templates/</h3>", status_code=404)

# Route to serve CSS style
@app.get("/style.css")
async def get_css():
    css_path = os.path.join(CURRENT_DIR, "templates", "style.css")
    if os.path.exists(css_path):
        return FileResponse(css_path, media_type="text/css")
    return JSONResponse({"error": "style.css not found"}, status_code=404)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
