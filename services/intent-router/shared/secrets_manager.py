"""
secrets_manager.py — Shared encrypted secrets utility
=====================================================
Used by both intent-router and langgraph-orchestrator services.

HOW IT WORKS:
  1. Generate a Fernet master key:
       python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
  2. Encrypt each plaintext secret:
       python scripts/encrypt_secret.py MY_SECRET_VALUE
  3. Store the ENCRYPTED output in your deployment platform (Railway/Render secrets)
  4. Store the MASTER_KEY in your deployment platform (never in .env files)
  5. At runtime, call get_secret("MY_SECRET_ENV_VAR") — decrypts on-the-fly

SECURITY PROPERTIES:
  - Fernet = AES-128-CBC + HMAC-SHA256 + secure random IV per message
  - Master key is never written to disk; injected via platform secret manager
  - .env files only contain ENCRYPTED: prefixed ciphertexts, never plaintext
  - Logs never print decrypted values
"""

from cryptography.fernet import Fernet, InvalidToken
import os
import logging

logger = logging.getLogger(__name__)


class SecretsManager:
    """Decrypts Fernet-encrypted environment variable values at runtime."""

    ENCRYPTED_PREFIX = "ENCRYPTED:"

    def __init__(self):
        master_key = os.environ.get("MASTER_KEY")
        if not master_key:
            raise EnvironmentError(
                "MASTER_KEY is not set. Set it in your deployment platform's secret manager "
                "(Railway / Render / Fly.io secrets — never in .env files)."
            )
        self._fernet = Fernet(master_key.encode())

    def get(self, env_var: str) -> str:
        """
        Return the decrypted value of an environment variable.
        If the value starts with ENCRYPTED: it is decrypted; otherwise returned as-is
        (useful for local dev where you may use plaintext temporarily).
        """
        raw = os.environ.get(env_var)
        if raw is None:
            raise EnvironmentError(f"Environment variable '{env_var}' is not set.")

        if raw.startswith(self.ENCRYPTED_PREFIX):
            ciphertext = raw[len(self.ENCRYPTED_PREFIX):]
            try:
                return self._fernet.decrypt(ciphertext.encode()).decode()
            except InvalidToken:
                raise ValueError(
                    f"Failed to decrypt '{env_var}'. "
                    "Check that MASTER_KEY matches the key used to encrypt the value."
                )

        # Not encrypted — return as-is (dev/test only)
        logger.warning(
            "Secret '%s' is not encrypted (no ENCRYPTED: prefix). "
            "Use scripts/encrypt_secret.py before deploying to production.",
            env_var,
        )
        return raw


# Module-level singleton — initialized once at startup
_manager: SecretsManager | None = None


def get_secret(env_var: str) -> str:
    """Convenience function. Auto-initializes SecretsManager on first call."""
    global _manager
    if _manager is None:
        _manager = SecretsManager()
    return _manager.get(env_var)
