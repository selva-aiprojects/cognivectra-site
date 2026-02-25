# Intent Router — Dockerfile
# ============================================================
# Python 3.11 slim image for minimal attack surface.
# Runs as non-root user (cognivectra) for security.
# All secrets injected via platform environment — never baked in.
# ============================================================

FROM python:3.11-slim

# Security: run as non-root
RUN groupadd -r cognivectra && useradd -r -g cognivectra cognivectra

WORKDIR /app

# Copy shared secrets manager first (shared layer for cache efficiency)
COPY ../shared/secrets_manager.py ./shared/secrets_manager.py

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy service code
COPY intent_engine.py main.py ./

# Set ownership
RUN chown -R cognivectra:cognivectra /app

USER cognivectra

EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/health')"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "2"]
