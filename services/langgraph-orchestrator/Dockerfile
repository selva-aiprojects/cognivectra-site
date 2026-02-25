# LangGraph Orchestrator — Dockerfile
# ============================================================
FROM python:3.11-slim

RUN groupadd -r cognivectra && useradd -r -g cognivectra cognivectra

WORKDIR /app

COPY ../shared/secrets_manager.py ./shared/secrets_manager.py

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY agents.py orchestrator.py main.py ./

RUN chown -R cognivectra:cognivectra /app

USER cognivectra

EXPOSE 8002

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8002/health')"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002", "--workers", "2"]
